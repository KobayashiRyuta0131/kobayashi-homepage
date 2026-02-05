// 職務経歴書データの型定義

export interface Experience {
  no?: string; // No
  startDate?: string; // 開始
  endDate?: string; // 終了
  period?: string; // 期間（計算済み）
  company: string; // 所属
  position: string; // タイトル
  summary?: string; // 要約
  description: string; // 担当業務
  achievements?: string[]; // 実績
  technologies?: string[]; // 言語
  keywords?: string; // その他キーワード
  role?: string; // 役割
  teamSize?: string; // チーム規模
  requirements?: string; // 要件定義 (Y/N)
  parentEquipment?: string; // 親機 (Y/N)
  basicDesign?: string; // 基本設計 (Y/N)
  detailedDesign?: string; // 詳細設計 (Y/N)
  development?: string; // 開発 (Y/N)
  testing?: string; // テスト (Y/N)
  maintenance?: string; // 保守・運用 (Y/N)
}

export interface Skill {
  category: string; // 例: "プログラミング言語"
  items: string[]; // 例: ["TypeScript", "Python", "JavaScript"]
}

export interface Qualification {
  title: string; // 資格名
  date: string; // 取得日
  issuer?: string; // 発行者
}

export interface Education {
  period: string; // 例: "2016年4月 - 2020年3月"
  school: string; // 学校名
  major: string; // 専攻
  details?: string; // 詳細
  research?: string; // 学問・研究内容
}

export interface ResumeData {
  basicInfo: {
    name: string;
    nameJa: string;
    title: string;
    bio?: string;
    profileImage?: string;
    socialLinks: {
      github?: string;
      linkedin?: string;
      facebook?: string;
    };
  };
  basicInfoItems?: {
    label: string;
    value: string;
  }[];
  experiences: Experience[];
  skills: Skill[];
  qualifications: Qualification[];
  education: Education[];
}
