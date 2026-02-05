"use client";

import { useEffect, useMemo, useState } from "react";
import { Qualification } from "@/types/resume";

interface QualificationsSectionProps {
  qualifications: Qualification[];
}

export function QualificationsSection({
  qualifications,
}: QualificationsSectionProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const normalize = (value: string) =>
    value
      .normalize("NFKC")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(normalize(query).slice(0, 100));
    }, 150);

    return () => clearTimeout(handle);
  }, [query]);

  const filteredQualifications = useMemo(() => {
    const keyword = debouncedQuery;
    const sorted = [...qualifications].sort((a, b) => {
      const parseDate = (value: string | undefined) => {
        if (!value) return Number.MAX_SAFE_INTEGER;
        const parts = value
          .replace(/年|月|日/g, "/")
          .split("/")
          .filter((p) => p.trim() !== "");
        const year = Number(parts[0]) || 0;
        const month = Number(parts[1]) || 1;
        const day = Number(parts[2]) || 1;
        if (!year) return Number.MAX_SAFE_INTEGER;
        return year * 10000 + month * 100 + day;
      };

      return parseDate(a.date) - parseDate(b.date);
    });

    if (!keyword) return sorted;

    return sorted.filter((qual) => {
      const haystack = normalize(
        [qual.title, qual.issuer, qual.date].filter(Boolean).join(" ")
      );
      return haystack.includes(keyword);
    });
  }, [qualifications, debouncedQuery]);

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">資格</h2>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={100}
          placeholder="キーワードで検索（例: AWS, Azure, 基本情報）"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
      <div className="space-y-4">
        {filteredQualifications.map((qual, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {qual.title}
                </h3>
                {qual.issuer && (
                  <div className="text-sm text-gray-600">{qual.issuer}</div>
                )}
              </div>
              <div className="text-sm text-gray-600">{qual.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
