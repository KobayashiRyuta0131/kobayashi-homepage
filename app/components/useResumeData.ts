"use client";

import { useEffect, useState } from "react";
import { ResumeData } from "@/types/resume";
import { fetchResumeData } from "@/lib/sheets";

const SAMPLE_DATA: ResumeData = {
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
  experiences: [],
  skills: [],
  qualifications: [],
  education: [],
};

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spreadsheetId =
          process.env.NEXT_PUBLIC_SPREADSHEET_ID ||
          "1OppbWzvUt7g5owjf8HZearJDm0wzNHlN";
        const data = await fetchResumeData(spreadsheetId);
        setResumeData(data);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { resumeData, loading, error };
}
