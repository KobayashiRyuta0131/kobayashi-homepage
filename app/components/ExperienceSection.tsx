"use client";

import { useEffect, useMemo, useState } from "react";
import { Experience } from "@/types/resume";

interface ExperienceComponentProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceComponentProps) {
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

  const filteredExperiences = useMemo(() => {
    const keyword = debouncedQuery;
    if (!keyword) return experiences;

    return experiences.filter((exp) => {
      const haystack = normalize(
        [
        exp.company,
        exp.position,
        exp.summary,
        exp.description,
        exp.keywords,
        exp.role,
        exp.teamSize,
        exp.period,
        exp.startDate,
        exp.endDate,
        ...(exp.achievements || []),
        ...(exp.technologies || []),
        ]
          .filter(Boolean)
          .join(" ")
      );

      return haystack.includes(keyword);
    });
  }, [experiences, debouncedQuery]);

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">職務経歴</h2>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={100}
          placeholder="キーワードで検索（例: IBM, Python, テスト）"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
      <div className="space-y-6">
        {filteredExperiences.map((exp, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
            {/* ヘッダー部分：No + Position（大文字）、Period（小）+ Company（小） */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3 mb-1">
                {exp.no && <span className="text-lg font-semibold text-gray-900">No. {exp.no}</span>}
                <h3 className="text-2xl font-bold text-gray-900">{exp.position}</h3>
              </div>
              <div className="text-sm text-gray-600">
                {exp.period && <span>{exp.period}</span>}
                {exp.period && exp.company && <span> / </span>}
                <span className="font-semibold">{exp.company}</span>
              </div>
            </div>

            {/* 詳細情報セクション */}
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              {/* サマリ */}
              {exp.summary && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">サマリ</p>
                  <p className="text-sm text-gray-700">{exp.summary}</p>
                </div>
              )}

              {/* 担当業務 */}
              {exp.description && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">担当業務</p>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              )}

              {/* 役割 */}
              {exp.role && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">役割</p>
                  <p className="text-sm text-gray-700">{exp.role}</p>
                </div>
              )}

              {/* 実績 */}
              {exp.achievements && exp.achievements.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">実績</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 言語 */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">言語</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* その他キーワード */}
              {exp.keywords && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">その他キーワード</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.keywords
                      .split(/[,\n、]/)
                      .map((item) => item.trim())
                      .filter((item) => item)
                      .map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* チーム規模 */}
              {exp.teamSize && (
                <div>
                  <p className="text-xs font-semibold text-gray-600">チーム規模: {exp.teamSize}</p>
                </div>
              )}
            </div>

            {/* チェックボックス部分をテーブル形式で */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-2 py-2 font-semibold text-gray-900 border border-gray-300">要件定義</th>
                    <th className="px-2 py-2 font-semibold text-gray-900 border border-gray-300">基本設計</th>
                    <th className="px-2 py-2 font-semibold text-gray-900 border border-gray-300">詳細設計</th>
                    <th className="px-2 py-2 font-semibold text-gray-900 border border-gray-300">開発</th>
                    <th className="px-2 py-2 font-semibold text-gray-900 border border-gray-300">テスト</th>
                    <th className="px-2 py-2 font-semibold text-gray-900 border border-gray-300">保守・運用</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="px-2 py-2 border border-gray-300">{exp.requirements ? exp.requirements : "-"}</td>
                    <td className="px-2 py-2 border border-gray-300">{exp.basicDesign ? exp.basicDesign : "-"}</td>
                    <td className="px-2 py-2 border border-gray-300">{exp.detailedDesign ? exp.detailedDesign : "-"}</td>
                    <td className="px-2 py-2 border border-gray-300">{exp.development ? exp.development : "-"}</td>
                    <td className="px-2 py-2 border border-gray-300">{exp.testing ? exp.testing : "-"}</td>
                    <td className="px-2 py-2 border border-gray-300">{exp.maintenance ? exp.maintenance : "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
