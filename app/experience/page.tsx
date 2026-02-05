"use client";

import { ResumePageShell } from "@/app/components/ResumePageShell";
import { ExperienceSection } from "@/app/components/ExperienceSection";

export default function ExperiencePage() {
  return (
    <ResumePageShell>
      {(resumeData) =>
        resumeData.experiences.length > 0 ? (
          <ExperienceSection experiences={resumeData.experiences} />
        ) : (
          <div className="py-20 px-6 text-center text-gray-600">
            職務経歴がまだありません。
          </div>
        )
      }
    </ResumePageShell>
  );
}
