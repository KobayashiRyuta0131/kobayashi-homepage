"use client";

import { ResumePageShell } from "@/app/components/ResumePageShell";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function HomePage() {
  return (
    <ResumePageShell>
      {(resumeData) => {
        const headingItems = (resumeData.basicInfoItems || [])
          .filter((item) => item.value)
          .slice(0, 3);
        const headingNameJa =
          headingItems[0]?.value || resumeData.basicInfo.nameJa;
        const headingName =
          headingItems[1]?.value || resumeData.basicInfo.name;
        const headingTitle =
          headingItems[2]?.value || resumeData.basicInfo.title;

        return (
          <section className="py-20 px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <img
                src="/KobayashiRyutaShikaku.jpg"
                alt="プロフィール写真"
                className="rounded-full shadow-lg mx-auto w-40 h-40 object-cover"
              />

              <h4 className="mt-6 text-sm font-bold">{headingName}</h4>
              <h1 className="mt-3 text-4xl font-bold">{headingNameJa}</h1>
              <p className="mt-2 text-xl text-gray-600">{headingTitle}</p>

              <div className="flex justify-center gap-6 mt-6 text-2xl">
                <a
                  href="https://github.com/KobayashiRyuta0131"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 transition"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://www.linkedin.com/in/ryutakobayashi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://www.facebook.com/ryuta.kobayashi.779"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-500 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </section>
        );
      }}
    </ResumePageShell>
  );
}
