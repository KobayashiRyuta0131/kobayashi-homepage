"use client";

import { ResumePageShell } from "@/app/components/ResumePageShell";
import { EducationSection } from "@/app/components/EducationSection";

export default function EducationPage() {
  return (
    <ResumePageShell>
      {(resumeData) =>
        resumeData.education.length > 0 ? (
          <EducationSection education={resumeData.education} />
        ) : (
          <div className="py-20 px-6 text-center text-gray-600">
            学歴がまだありません。
          </div>
        )
      }
    </ResumePageShell>
  );
}
