"use client";

import { ReactNode } from "react";
import { ResumeData } from "@/types/resume";
import { useResumeData } from "./useResumeData";

interface ResumePageShellProps {
  children: (data: ResumeData) => ReactNode;
}

export function ResumePageShell({ children }: ResumePageShellProps) {
  const { resumeData, loading, error } = useResumeData();

  return (
    <main className="bg-gray-50 text-gray-900 pt-24 pb-16 page-enter">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
          <p className="text-yellow-700">
            <span className="font-bold">注意:</span> {error}
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            サンプルデータを表示しています
          </p>
        </div>
      )}

      {loading ? (
        <div className="py-20 px-6 text-center">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      ) : (
        children(resumeData)
      )}
    </main>
  );
}
