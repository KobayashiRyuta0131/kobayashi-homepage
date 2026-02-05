"use client";

import { useEffect, useMemo, useState } from "react";
import { Skill } from "@/types/resume";

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
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

  const order = ["A", "B", "C", "D", "E"];
  const orderedSkills = skills
    .filter((skillGroup) => order.includes(skillGroup.category))
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));

  const filteredSkills = useMemo(() => {
    const keyword = debouncedQuery;
    if (!keyword) return orderedSkills;

    return orderedSkills
      .map((group) => {
        const filteredItems = group.items.filter((item) =>
          normalize(item).includes(keyword)
        );
        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [orderedSkills, debouncedQuery]);

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-900">スキル</h2>
      <p className="text-xs text-gray-600 mt-2 mb-8 whitespace-pre-line">
        【A】業務の独力遂行。業務課題発見・解決。後進教育{"\n"}
        【B】業務の独力遂行{"\n"}
        【C】業務を上位者指導のもと遂行{"\n"}
        【D】実務を通じた学習経験あり{"\n"}
        【E】学習経験あり
      </p>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={100}
          placeholder="キーワードで検索（例: Java, AWS, 設計）"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skillGroup, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {skillGroup.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
