"use client";

import { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

const themeStyles: Record<
  Resume["themeColor"],
  {
    primary: string;
    border: string;
    secondary: string;
    light: string;
  }
> = {
  blue: {
    primary: "text-blue-900",
    border: "border-blue-800",
    secondary: "text-blue-700",
    light: "bg-blue-50",
  },
  purple: {
    primary: "text-purple-900",
    border: "border-purple-800",
    secondary: "text-purple-700",
    light: "bg-purple-50",
  },
  green: {
    primary: "text-emerald-900",
    border: "border-emerald-800",
    secondary: "text-emerald-700",
    light: "bg-emerald-50",
  },
  black: {
    primary: "text-gray-950",
    border: "border-gray-900",
    secondary: "text-gray-700",
    light: "bg-gray-100",
  },
  red: {
    primary: "text-red-900",
    border: "border-red-800",
    secondary: "text-red-700",
    light: "bg-red-50",
  },
};

export default function OffCampusTemplate({ resume }: Props) {
  const theme = themeStyles[resume.themeColor || "blue"];
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
    sectionOrder,
  } = resume;

  return (
    <div className="w-full bg-white text-gray-900 font-sans leading-normal">
      {/* ================= HEADER ================= */}
      <header
        id="preview-section-personalInfo"
        className="text-center border-b-2 pb-4 mb-4 border-gray-900"
      >
        <h1 className={`text-3xl font-extrabold uppercase tracking-tight ${theme.primary}`}>
          {personalInfo.fullName || "Your Name"}
        </h1>

        {personalInfo.headline && (
          <p className="mt-1 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {personalInfo.headline}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs font-medium text-gray-800">
          {[
            personalInfo.phone,
            personalInfo.email,
            personalInfo.address,
            personalInfo.linkedin,
            personalInfo.github,
            personalInfo.portfolio,
          ]
            .filter(Boolean)
            .map((item, idx, arr) => (
              <span key={idx} className="flex items-center gap-x-3">
                <span>{item}</span>
                {idx < arr.length - 1 && <span className="text-gray-400 font-bold">|</span>}
              </span>
            ))}
        </div>
      </header>

      {/* ================= DYNAMIC SECTIONS ================= */}
      {(() => {
        const getDefaultTitle = (key: string): string => {
          switch (key) {
            case "summary": return "SUMMARY";
            case "skills": return "TECHNICAL SKILLS";
            case "experience": return "WORK EXPERIENCE";
            case "projects": return "PROJECTS & OPEN SOURCE";
            case "education": return "EDUCATION";
            case "certifications": return "CERTIFICATIONS";
            case "achievements": return "HONORS & ACHIEVEMENTS";
            case "languages": return "LANGUAGES";
            case "interests": return "INTERESTS";
            default: return key.toUpperCase();
          }
        };

        const renderSection = (sectionKey: string) => {
          if (resume.hiddenSections?.includes(sectionKey)) return null;
          const title = resume.customTitles?.[sectionKey] || getDefaultTitle(sectionKey);

          switch (sectionKey) {
            case "summary":
              if (!personalInfo.summary?.trim()) return null;
              return (
                <section id="preview-section-summary" key="summary" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-800 text-justify">
                    {personalInfo.summary}
                  </p>
                </section>
              );

            case "skills":
              if (!skills || skills.length === 0) return null;
              return (
                <section id="preview-section-skills" key="skills" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-1.5 text-xs text-gray-900 leading-relaxed font-medium">
                    <span className="font-bold text-gray-950">Languages & Tools: </span>
                    {skills.join(" • ")}
                  </div>
                </section>
              );

            case "experience":
              if (!experience || experience.length === 0) return null;
              return (
                <section id="preview-section-experience" key="experience" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-2 space-y-3">
                    {experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline text-xs">
                          <div>
                            <span className="font-bold text-gray-950">{exp.position || "Position"}</span>
                            <span className="text-gray-700 italic"> — {exp.company}</span>
                            {exp.location && <span className="text-gray-500"> ({exp.location})</span>}
                          </div>
                          <span className="font-semibold text-gray-600 whitespace-nowrap">
                            {exp.startDate}
                            {exp.startDate && exp.endDate && " – "}
                            {exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <div className="mt-1 text-xs text-gray-800 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-gray-200">
                            {exp.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "projects":
              if (!projects || projects.length === 0) return null;
              return (
                <section id="preview-section-projects" key="projects" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-2 space-y-3">
                    {projects.map((project, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-gray-950">{project.title || "Project Title"}</span>
                          <div className="text-[11px] text-blue-800 font-medium space-x-2">
                            {project.github && <span>GitHub: {project.github}</span>}
                            {project.liveDemo && <span>Demo: {project.liveDemo}</span>}
                          </div>
                        </div>
                        {project.technologies && project.technologies.length > 0 && (
                          <p className="text-[11px] font-semibold text-gray-700 mt-0.5">
                            Technologies: {project.technologies.join(", ")}
                          </p>
                        )}
                        {project.description && (
                          <div className="mt-1 text-xs text-gray-800 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-gray-200">
                            {project.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "education":
              if (!education || education.length === 0) return null;
              return (
                <section id="preview-section-education" key="education" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-2 space-y-2">
                    {education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="font-bold text-gray-950">{edu.college}</span>
                          <span className="text-gray-800">
                            {" "}
                            — {edu.degree}
                            {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                          </span>
                          {edu.cgpa && <span className="font-medium text-gray-600"> (CGPA: {edu.cgpa})</span>}
                        </div>
                        <span className="font-semibold text-gray-600 whitespace-nowrap">
                          {edu.startYear}
                          {edu.startYear && edu.endYear && " – "}
                          {edu.endYear}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "certifications":
              if (!certifications || certifications.length === 0) return null;
              return (
                <section id="preview-section-certifications" key="certifications" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="mt-2 space-y-1.5">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <div>
                          <span className="font-bold text-gray-950">{cert.name}</span>
                          {cert.organization && <span className="text-gray-700"> ({cert.organization})</span>}
                        </div>
                        {cert.issueDate && <span className="text-gray-600 font-medium">{cert.issueDate}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "achievements":
              if (!achievements || achievements.length === 0) return null;
              return (
                <section id="preview-section-achievements" key="achievements" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <ul className="mt-1.5 list-disc list-inside text-xs text-gray-800 space-y-1">
                    {achievements.map((achievement, index) => (
                      <li key={index}>
                        <span className="font-bold text-gray-950">{achievement.title}</span>
                        {achievement.description && ` — ${achievement.description}`}
                      </li>
                    ))}
                  </ul>
                </section>
              );

            case "languages":
              if (!languages || languages.length === 0) return null;
              return (
                <section id="preview-section-languages" key="languages" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="mt-1.5 text-xs text-gray-800">
                    {languages
                      .map((lang) => `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ""}`)
                      .join(" • ")}
                  </p>
                </section>
              );

            case "interests":
              if (!interests || interests.length === 0) return null;
              return (
                <section id="preview-section-interests" key="interests" className="mb-4">
                  <h2 className={`border-b-2 pb-0.5 text-xs font-bold uppercase tracking-wider ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="mt-1.5 text-xs text-gray-800">
                    {interests.map((interest) => interest.name).join(" • ")}
                  </p>
                </section>
              );

            default:
              return null;
          }
        };

        return sectionOrder.map((sectionKey) => renderSection(sectionKey));
      })()}
    </div>
  );
}
