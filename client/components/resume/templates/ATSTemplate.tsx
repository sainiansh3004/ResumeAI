"use client";

import { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

const themeMap = {
  blue: {
    primary: "text-blue-700",
    secondary: "text-blue-600",
    border: "border-blue-700",
  },
  purple: {
    primary: "text-purple-700",
    secondary: "text-purple-600",
    border: "border-purple-700",
  },
  green: {
    primary: "text-green-700",
    secondary: "text-green-600",
    border: "border-green-700",
  },
  black: {
    primary: "text-gray-900",
    secondary: "text-gray-800",
    border: "border-gray-900",
  },
  red: {
    primary: "text-red-700",
    secondary: "text-red-600",
    border: "border-red-700",
  },
} as const;

export default function ATSTemplate({ resume }: Props) {
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    interests,
  } = resume;

  const theme =
    themeMap[resume.themeColor || "blue"];

  return (
    <div className="mx-auto w-full bg-white px-10 py-8 font-sans text-[13px] leading-relaxed text-black">

      {/* ================= HEADER ================= */}

<header
  id="preview-section-personalInfo"
  className={`border-b-2 pb-4 ${theme.border}`}
>
  <div className="flex items-center justify-between gap-6">

    <div className="flex-1 min-w-0">
      <h1
        className={`text-3xl font-bold uppercase tracking-wide ${theme.primary}`}
      >
        {personalInfo.fullName || "Your Name"}
      </h1>

      {personalInfo.headline && (
        <p className="mt-1 text-sm text-gray-700">
          {personalInfo.headline}
        </p>
      )}

      <div
        className={`mt-2 text-[12px] leading-6 ${theme.secondary}`}
      >
        {[
          personalInfo.phone,
          personalInfo.email,
          personalInfo.linkedin,
          personalInfo.github,
          personalInfo.portfolio,
        ]
          .filter(Boolean)
          .join(" • ")}
      </div>
    </div>

    {personalInfo.photo && (
      <img
        src={personalInfo.photo}
        alt="Profile"
        className={`h-20 w-20 shrink-0 rounded-full border-2 object-cover ${theme.border}`}
      />
    )}

  </div>
</header>

      {/* ================= DYNAMIC SECTIONS ================= */}
      {(() => {
        const getDefaultTitle = (key: string): string => {
          switch (key) {
            case "summary": return "Professional Summary";
            case "education": return "Education";
            case "experience": return "Professional Experience";
            case "skills": return "Technical Skills";
            case "projects": return "Projects";
            case "certifications": return "Certifications";
            case "achievements": return "Achievements";
            case "languages": return "Languages";
            case "interests": return "Interests";
            default: return key.charAt(0).toUpperCase() + key.slice(1);
          }
        };

        const renderSection = (sectionKey: string) => {
          if (resume.hiddenSections?.includes(sectionKey)) return null;
          const title = resume.customTitles?.[sectionKey] || getDefaultTitle(sectionKey);

          switch (sectionKey) {
            case "summary":
              if (!personalInfo.summary?.trim()) return null;
              return (
                <section id="preview-section-summary" key="summary" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-justify">
                    {personalInfo.summary}
                  </p>
                </section>
              );

            case "skills":
              if (!skills || skills.length === 0) return null;
              return (
                <section id="preview-section-skills" key="skills" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="mt-2">{skills.join(" • ")}</p>
                </section>
              );

            case "experience":
              if (!experience || experience.length === 0) return null;
              return (
                <section id="preview-section-experience" key="experience" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-3 space-y-5">
                    {experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold">{exp.position || "Position"}</h3>
                            <p className="italic">
                              {exp.company}
                              {exp.location && ` | ${exp.location}`}
                            </p>
                            {exp.employmentType && <p className="text-[12px]">{exp.employmentType}</p>}
                          </div>
                          <span className="whitespace-nowrap text-sm">
                            {exp.startDate}
                            {exp.startDate && exp.endDate && " – "}
                            {exp.endDate}
                          </span>
                        </div>
                        {exp.description && <div className="mt-2 whitespace-pre-line">{exp.description}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "projects":
              if (!projects || projects.length === 0) return null;
              return (
                <section id="preview-section-projects" key="projects" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-3 space-y-5">
                    {projects.map((project, index) => (
                      <div key={index}>
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold">{project.title || "Project Title"}</h3>
                        </div>
                        {project.technologies && project.technologies.length > 0 && (
                          <p className="mt-1">
                            <strong>Technologies:</strong> {project.technologies.join(", ")}
                          </p>
                        )}
                        {(project.github || project.liveDemo) && (
                          <div className="mt-1 text-[12px]">
                            {project.github && (
                              <p>
                                <strong>GitHub:</strong>{" "}
                                <span className={theme.secondary}>{project.github}</span>
                              </p>
                            )}
                            {project.liveDemo && (
                              <p>
                                <strong>Live:</strong>{" "}
                                <span className={theme.secondary}>{project.liveDemo}</span>
                              </p>
                            )}
                          </div>
                        )}
                        {project.description && <div className="mt-2 whitespace-pre-line">{project.description}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "education":
              if (!education || education.length === 0) return null;
              return (
                <section id="preview-section-education" key="education" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-3 space-y-4">
                    {education.map((edu, index) => (
                      <div key={index}>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold">
                              {edu.degree}
                              {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                            </h3>
                            <p>{edu.college}</p>
                            {edu.cgpa && <p>CGPA: {edu.cgpa}</p>}
                          </div>
                          <span className="whitespace-nowrap">
                            {edu.startYear}
                            {edu.startYear && edu.endYear && " – "}
                            {edu.endYear}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "certifications":
              if (!certifications || certifications.length === 0) return null;
              return (
                <section id="preview-section-certifications" key="certifications" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-3 space-y-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p className="font-bold">{cert.name}</p>
                          {cert.organization && <p>{cert.organization}</p>}
                        </div>
                        {cert.issueDate && <span className="whitespace-nowrap">{cert.issueDate}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "achievements":
              if (!achievements || achievements.length === 0) return null;
              return (
                <section id="preview-section-achievements" key="achievements" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {achievements.map((achievement, index) => (
                      <li key={index}>
                        <strong>{achievement.title}</strong>
                        {achievement.description && ` — ${achievement.description}`}
                      </li>
                    ))}
                  </ul>
                </section>
              );

            case "languages":
              if (!languages || languages.length === 0) return null;
              return (
                <section id="preview-section-languages" key="languages" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="mt-2">
                    {languages
                      .map((language) => `${language.name}${language.proficiency ? ` (${language.proficiency})` : ""}`)
                      .join(" • ")}
                  </p>
                </section>
              );

            case "interests":
              if (!interests || interests.length === 0) return null;
              return (
                <section id="preview-section-interests" key="interests" className="mt-6">
                  <h2 className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="mt-2">
                    {interests.map((interest) => interest.name).join(" • ")}
                  </p>
                </section>
              );

            default:
              return null;
          }
        };

        const order = resume.sectionOrder || [
          "summary",
          "education",
          "experience",
          "skills",
          "projects",
          "certifications",
          "achievements",
          "languages",
          "interests",
        ];

        return order.map((sectionKey) => renderSection(sectionKey));
      })()}
    </div>
  );
}