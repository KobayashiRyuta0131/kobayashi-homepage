import { ResumeData } from "@/types/resume";

interface SheetRow {
  [key: string]: string | undefined;
}

/**
 * Google Sheets公開URLからCSV形式でデータを取得
 */
async function fetchSheetAsCSV(
  spreadsheetId: string,
  sheetGid: number = 0,
  options?: { hasHeader?: boolean }
): Promise<SheetRow[]> {
  try {
    // 公開されたスプレッドシートをCSV形式でエクスポート
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetGid}`;
    console.log("Fetching CSV from sheet gid:", sheetGid);

    const response = await fetch(
      csvUrl,
      typeof window === "undefined"
        ? { headers: { "User-Agent": "Mozilla/5.0" } }
        : undefined
    );

    if (!response.ok) {
      console.warn(`CSV fetch failed for gid ${sheetGid}: ${response.status}`);
      return [];
    }

    const csv = await response.text();
    return parseCSV(csv, options);
  } catch (error) {
    console.error(`Error fetching CSV for gid ${sheetGid}:`, error);
    return [];
  }
}

/**
 * CSVテキストをパース
 */
function parseCSV(csv: string, options?: { hasHeader?: boolean }): SheetRow[] {
  if (!csv.trim()) {
    return [];
  }

  const delimiter = detectDelimiterFromCSV(csv);
  const rows = parseCSVRows(csv, delimiter);

  if (rows.length < 2) {
    return [];
  }

  const hasHeader = options?.hasHeader !== false;

  if (hasHeader) {
    const headers = rows[0].map(normalizeHeader);
    const dataRows: SheetRow[] = [];
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      const row: SheetRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? "";
      });
      dataRows.push(row);
    }
    return dataRows;
  }

  const columnCount = Math.max(...rows.map((row) => row.length));
  const headers = Array.from({ length: columnCount }, (_, i) => `col${i}`);
  return rows.map((values) => {
    const row: SheetRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
}

function detectDelimiterFromCSV(csv: string): "," | "\t" {
  let insideQuotes = false;
  let commaCount = 0;
  let tabCount = 0;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (!insideQuotes) {
      if (char === ",") commaCount++;
      if (char === "\t") tabCount++;
      if (char === "\n") break;
      if (char === "\r" && nextChar === "\n") break;
    }
  }

  return tabCount > commaCount ? "\t" : ",";
}

function normalizeHeader(header: string): string {
  return header.replace(/\uFEFF/g, "").replace(/\u3000/g, " ").trim();
}

/**
 * CSVをパース（クォート対応、改行対応）
 */
function parseCSVRows(csv: string, delimiter: "," | "\t" = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (!insideQuotes && char === delimiter) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if (!insideQuotes && (char === "\n" || (char === "\r" && nextChar === "\n"))) {
      row.push(current.trim());
      rows.push(row);
      row = [];
      current = "";
      if (char === "\r") i++;
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/**
 * 職務経歴書データをGoogle Sheetsから取得
 * 複数シート構成対応
 */
export async function fetchResumeData(
  spreadsheetId: string
): Promise<ResumeData> {
  try {
    console.log("Fetching resume data from spreadsheet:", spreadsheetId);

    // 各シートのデータを取得（gidで各セクション）
    const [basicInfoRows, experienceRows, skillsRows, qualificationsRows, educationRows] =
      await Promise.all([
        fetchSheetAsCSV(spreadsheetId, 850438655, { hasHeader: false }),   // 基本情報
        fetchSheetAsCSV(spreadsheetId, 2122323165),  // 職務経歴
        fetchSheetAsCSV(spreadsheetId, 1328404715),  // スキル
        fetchSheetAsCSV(spreadsheetId, 1822428943),  // 資格
        fetchSheetAsCSV(spreadsheetId, 1075736249),  // 学歴
      ]);

    console.log("Sheet data fetched:");
    console.log("  - BasicInfo rows:", basicInfoRows.length);
    console.log("  - Experience rows:", experienceRows.length);
    console.log("  - Skills rows:", skillsRows.length);
    console.log("  - Qualifications rows:", qualificationsRows.length);
    console.log("  - Education rows:", educationRows.length);

    // 基本情報を抽出
    const basicInfoItems = extractBasicInfoItems(basicInfoRows);
    const basicInfo = extractBasicInfo(basicInfoItems);

    // 職務経歴を抽出
    const experiences = extractExperiences(experienceRows);

    // スキルを抽出
    const skills = extractSkills(skillsRows);

    // 資格を抽出
    const qualifications = extractQualifications(qualificationsRows);

    // 学歴を抽出
    const education = extractEducation(educationRows);

    const result = {
      basicInfo,
      basicInfoItems,
      experiences,
      skills,
      qualifications,
      education,
    };

    console.log("Resume data fetched successfully");
    console.log("  - Experiences:", experiences.length);
    console.log("  - Skills:", skills.length);
    console.log("  - Qualifications:", qualifications.length);
    console.log("  - Education:", education.length);

    return result;
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return getSampleResumeData();
  }
}

/**
 * 基本情報を抽出
 * シート形式: A列に項目名、B列に値
 */
function extractBasicInfoItems(
  rows: SheetRow[]
): { label: string; value: string }[] {
  return rows
    .map((row) => {
      const key = row["col0"] ?? Object.values(row)[0];
      const value = row["col1"] ?? Object.values(row)[1];
      return {
        label: String(key ?? "").trim(),
        value: String(value ?? "").trim(),
      };
    })
    .filter((item) => item.label || item.value);
}

function extractBasicInfo(
  items: { label: string; value: string }[]
): ResumeData["basicInfo"] {
  const basicInfoMap = new Map<string, string>();

  items.forEach((item) => {
    if (item.label && item.value) {
      basicInfoMap.set(item.label, item.value);
    }
  });

  return {
    name: basicInfoMap.get("名前（ローマ字）") || basicInfoMap.get("名前") || "Name",
    nameJa: basicInfoMap.get("名前") || "名前",
    title: basicInfoMap.get("職位") || basicInfoMap.get("役職") || "Job Title",
    bio: basicInfoMap.get("自己紹介") || basicInfoMap.get("説明") || "",
    profileImage: basicInfoMap.get("画像") || basicInfoMap.get("プロフィール画像") || "",
    socialLinks: {
      github: basicInfoMap.get("GitHub") || basicInfoMap.get("Github") || "",
      linkedin: basicInfoMap.get("LinkedIn") || basicInfoMap.get("Linkedin") || "",
      facebook: basicInfoMap.get("Facebook") || basicInfoMap.get("フェイスブック") || "",
    },
  };
}

/**
 * 職務経歴を抽出
 * シート形式: no, 開始, 終了, 所属, タイトル, 要約, 担当業務, 実績, 言語, その他キーワード, 役割, チーム規模, 要件定義, 親機, 基本設計, 詳細設計, 開発, テスト, 保守・運用
 */
function extractExperiences(rows: SheetRow[]): ResumeData["experiences"] {
  if (rows.length > 0) {
    console.log("Experience CSV Headers:", Object.keys(rows[0]));
    console.log("First experience row:", rows[0]);
  }
  
  const getValue = (row: SheetRow, keys: string[]): string => {
    for (const key of keys) {
      const value = row[key];
      if (value !== undefined && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return "";
  };

  const hasAny = (row: SheetRow, keys: string[]): boolean =>
    keys.some((key) => {
      const value = row[key];
      return value !== undefined && String(value).trim() !== "";
    });

  return rows
    .filter(row =>
      hasAny(row, [
        "所属",
        "会社名",
        "プロジェクト名",
        "タイトル",
        "職位",
        "役職",
        "担当業務",
        "業務内容",
      ])
    )
    .map(row => {
      const startDate = getValue(row, [
        "開始",
        "開始日",
        "開始年月",
        "開始年月日",
        "Start",
        "Start Date",
      ]);
      const endDate = getValue(row, [
        "終了",
        "終了日",
        "終了年月",
        "終了年月日",
        "End",
        "End Date",
      ]);
      const period = [startDate, endDate].filter(d => d).join(" - ");

      return {
        no: getValue(row, ["no", "No", "番号", "No."]),
        startDate: startDate,
        endDate: endDate,
        period: period || "",
        company: getValue(row, [
          "所属",
          "会社名",
          "クライアント",
          "プロジェクト名",
          "Company",
        ]),
        position: getValue(row, [
          "タイトル",
          "職位",
          "役職",
          "ポジション",
          "職種",
          "Position",
        ]),
        summary: getValue(row, ["要約", "概要", "サマリ", "Summary"]),
        description: getValue(row, ["担当業務", "業務内容", "仕事内容", "詳細", "Description"]),
        achievements: getValue(row, ["実績", "成果", "Achievement", "Achievements"])
          .split("\n")
          .map(item => item.trim())
          .filter(item => item),
        technologies: getValue(row, ["言語", "使用技術", "技術", "環境", "Technologies", "Tech"])
          .split(/[,\n、]/)
          .map(item => item.trim())
          .filter(item => item),
        keywords: getValue(row, ["その他キーワード", "キーワード", "Keywords"]),
        role: getValue(row, ["役割", "Role"]),
        teamSize: getValue(row, ["規模", "チーム規模", "チーム人数", "人数", "Team Size", "Team"]),
        requirements: getValue(row, ["要件定義", "要件", "Requirements"]),
        parentEquipment: getValue(row, ["親機", "Parent", "Parent Equipment"]),
        basicDesign: getValue(row, ["基本設計", "Basic Design"]),
        detailedDesign: getValue(row, ["詳細設計", "Detailed Design"]),
        development: getValue(row, ["開発", "実装", "Development"]),
        testing: getValue(row, ["テスト", "試験", "Testing"]),
        maintenance: getValue(row, ["保守・運用", "運用保守", "Maintenance"]),
      };
    });
}

/**
 * スキルを抽出
 * シート形式: A列にskill、B列にlevel
 */
function extractSkills(rows: SheetRow[]): ResumeData["skills"] {
  const skillsMap = new Map<string, Set<string>>();
  
  // スキルシートはシンプルな構造（skill, level）
  rows.forEach(row => {
    const skill = String(row["skill"] || row["Skill"] || "").trim();
    const level = String(row["level"] || row["Level"] || "").trim();
    
    if (skill && skill !== "skill" && skill !== "Skill") {
      // レベルをカテゴリとして使用、スキル名をアイテムとして追加
      if (!skillsMap.has(level || "その他")) {
        skillsMap.set(level || "その他", new Set());
      }
      skillsMap.get(level || "その他")!.add(skill);
    }
  });

  return Array.from(skillsMap.entries())
    .map(([category, items]) => ({
      category,
      items: Array.from(items).filter(item => item),
    }))
    .filter(skill => skill.items.length > 0);
}

/**
 * 資格を抽出
 * シート形式: certification_name, year, month, day
 */
function extractQualifications(
  rows: SheetRow[]
): ResumeData["qualifications"] {
  return rows
    .filter(row => row["certification_name"] || row["Certification Name"])
    .map(row => {
      const year = String(row["year"] || "").trim();
      const month = String(row["month"] || "").trim();
      const day = String(row["day"] || "").trim();
      
      const dateParts = [year, month, day].filter(d => d);
      const dateStr = dateParts.length > 0 ? dateParts.join("/") : "";

      return {
        title: String(row["certification_name"] || row["Certification Name"] || ""),
        date: dateStr,
        issuer: String(row["issuer"] || row["Issuer"] || ""),
      };
    });
}

/**
 * 学歴を抽出
 * シート形式: no, 入学年, 卒業年, 学校名, 学部, 学科, 学問・研究内容
 */
function extractEducation(rows: SheetRow[]): ResumeData["education"] {
  return rows
    .filter(row => row["学校名"] || row["School Name"])
    .map(row => {
      const enterYear = String(row["入学年"] || row["Entrance Year"] || "").trim();
      const graduateYear = String(row["卒業年"] || row["Graduation Year"] || "").trim();
      
      const period = [enterYear, graduateYear].filter(y => y).join(" - ");

      return {
        period: period || "",
        school: String(row["学校名"] || row["School Name"] || ""),
        major: String(row["学部"] || row["Faculty"] || ""),
        details: String(row["学科"] || row["Department"] || row["科"] || ""),
        research: String(row["学問・研究内容"] || row["Research"] || ""),
      };
    });
}

/**
 * サンプルデータ
 */
export function getSampleResumeData(): ResumeData {
  return {
    basicInfo: {
      name: "Kobayashi Ryuta",
      nameJa: "小林龍汰",
      title: "Full Stack Engineer",
      bio: "フルスタックエンジニア",
      socialLinks: {
        github: "https://github.com/KobayashiRyuta0131",
        linkedin: "https://www.linkedin.com/in/ryutakobayashi/",
        facebook: "https://www.facebook.com/ryuta.kobayashi.779",
      },
    },
    basicInfoItems: [
      { label: "名前", value: "小林龍汰" },
      { label: "名前（ローマ字）", value: "Kobayashi Ryuta" },
      { label: "職位", value: "Full Stack Engineer" },
    ],
    experiences: [
      {
        no: "1",
        startDate: "2024年1月",
        endDate: "2024年2月",
        period: "2024年1月 - 2024年2月",
        company: "データ基盤プロジェクト",
        position: "エンジニア",
        summary: "データ基盤構築",
        description: "データ基盤・分析プラットフォーム上での開発。テスト・設計・実装。",
        achievements: [
          "プロジェクトに参加",
          "テスト工程を対応",
        ],
        technologies: ["Python", "Windows", "AWS"],
        keywords: "",
        role: "メンバー",
        teamSize: "1～5名",
        requirements: "○",
        parentEquipment: "",
        basicDesign: "○",
        detailedDesign: "○",
        development: "○",
        testing: "○",
        maintenance: "",
      },
    ],
    skills: [
      {
        category: "プログラミング言語",
        items: ["TypeScript", "JavaScript", "Python", "SQL"],
      },
      {
        category: "フレームワーク",
        items: ["React", "Next.js", "Node.js"],
      },
    ],
    qualifications: [],
    education: [],
  };
}
