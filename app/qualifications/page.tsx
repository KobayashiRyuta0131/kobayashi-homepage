"use client";

import { ResumePageShell } from "@/app/components/ResumePageShell";
import { QualificationsSection } from "@/app/components/QualificationsSection";

export default function QualificationsPage() {
  return (
    <ResumePageShell>
      {(resumeData) =>
        resumeData.qualifications.length > 0 ? (
          <QualificationsSection qualifications={resumeData.qualifications} />
        ) : (
          <div className="py-20 px-6 text-center text-gray-600">
            資格がまだありません。
          </div>
        )
      }
    </ResumePageShell>
  );
}
