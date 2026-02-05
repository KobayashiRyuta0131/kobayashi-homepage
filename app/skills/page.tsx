"use client";

import { ResumePageShell } from "@/app/components/ResumePageShell";
import { SkillsSection } from "@/app/components/SkillsSection";

export default function SkillsPage() {
  return (
    <ResumePageShell>
      {(resumeData) =>
        resumeData.skills.length > 0 ? (
          <SkillsSection skills={resumeData.skills} />
        ) : (
          <div className="py-20 px-6 text-center text-gray-600">
            スキルがまだありません。
          </div>
        )
      }
    </ResumePageShell>
  );
}
