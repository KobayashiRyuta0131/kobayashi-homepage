"use client";

import { ResumePageShell } from "@/app/components/ResumePageShell";
export default function BasicInfoPage() {
  return (
    <ResumePageShell>
      {(resumeData) => {
        return (
          <>
            {resumeData.basicInfoItems && resumeData.basicInfoItems.length > 0 && (
              <section className="py-12 px-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  基本情報
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 bg-white border border-gray-200 rounded-lg p-6">
                  {resumeData.basicInfoItems.map((item, index) => {
                    const isSelfPr =
                      item.label.includes("自己PR") ||
                      item.label.includes("自己ＰＲ");

                    if (isSelfPr) {
                      return (
                        <div
                          key={`${item.label}-${index}`}
                          className="md:col-span-2"
                        >
                          <div className="text-sm font-semibold text-gray-600 mb-2">
                            {item.label || "-"}
                          </div>
                          <div className="text-sm text-gray-900 whitespace-pre-wrap">
                            {item.value || "-"}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={`${item.label}-${index}`} className="flex gap-4">
                        <div className="w-40 shrink-0 text-sm font-semibold text-gray-600">
                          {item.label || "-"}
                        </div>
                        <div className="text-sm text-gray-900 whitespace-pre-wrap">
                          {item.value || "-"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        );
      }}
    </ResumePageShell>
  );
}
