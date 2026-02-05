import { Education } from "@/types/resume";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto bg-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">学歴</h2>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">{edu.period}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {edu.school}
            </h3>
            <div className="text-lg text-gray-700">{edu.major}</div>
            {edu.details && (
              <p className="text-gray-600 mt-2">{edu.details}</p>
            )}
            {edu.research && (
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                {edu.research}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
