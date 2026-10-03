"use client";

import { Resume } from "@/types/resume";
import { formatUrl } from "@/utils/formatUrl";

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

  // Helper to render clean, hanging-indent bullet points
  const renderBullets = (text?: string) => {
    if (!text || !text.trim()) return null;
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return null;

    return (
      <ul className="mt-1 space-y-1 text-xs text-gray-800">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-\*\s]+/, "").trim();
          if (!cleanLine) return null;
          return (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-gray-900 select-none font-bold leading-none mt-1 text-[8px]">•</span>
              <span className="leading-relaxed flex-1 text-gray-800">{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full bg-white text-gray-900 font-sans leading-normal">
      {/* ================= HEADER ================= */}
      <header
        id="preview-section-personalInfo"
        className="border-b border-gray-900 pb-3 mb-3 flex items-center justify-between gap-4"
      >
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName || "Profile Photo"}
            className="h-18 w-18 rounded-full object-cover border-2 border-gray-300 shadow-sm flex-shrink-0"
          />
        )}

        <div className="flex-1 text-center">
          <h1 className={`text-2xl font-black uppercase tracking-wider ${theme.primary}`}>
            {personalInfo.fullName || "Your Name"}
          </h1>

          {personalInfo.headline && (
            <p className="mt-1 text-xs font-semibold text-gray-800 uppercase tracking-wide">
              {personalInfo.headline}
            </p>
          )}

          <div className="mt-2 flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-xs font-medium text-gray-700">
            {[
              personalInfo.phone ? { val: personalInfo.phone, href: `tel:${personalInfo.phone}` } : null,
              personalInfo.email ? { val: personalInfo.email, href: `mailto:${personalInfo.email}` } : null,
              personalInfo.address ? { val: personalInfo.address } : null,
              personalInfo.linkedin ? { val: personalInfo.linkedin, href: formatUrl(personalInfo.linkedin) } : null,
              personalInfo.github ? { val: personalInfo.github, href: formatUrl(personalInfo.github) } : null,
              personalInfo.portfolio ? { val: personalInfo.portfolio, href: formatUrl(personalInfo.portfolio) } : null,
            ]
              .filter(Boolean)
              .map((item: any, idx, arr) => (
                <span key={idx} className="flex items-center gap-x-2.5">
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-700 hover:underline cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.val}
                    </a>
                  ) : (
                    <span>{item.val}</span>
                  )}
                  {idx < arr.length - 1 && <span className="text-gray-400 font-bold select-none">|</span>}
                </span>
              ))}
          </div>
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
                <section id="preview-section-summary" key="summary" className="mb-3.5 break-inside-avoid">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-gray-800">
                    {personalInfo.summary}
                  </p>
                </section>
              );

            case "skills":
              if (!skills || skills.length === 0) return null;
              return (
                <section id="preview-section-skills" key="skills" className="mb-3.5 break-inside-avoid">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <div className="mt-1 text-xs text-gray-900 leading-relaxed font-medium">
                    <span className="font-bold text-gray-950">Languages & Tools: </span>
                    {skills.join(" • ")}
                  </div>
                </section>
              );

            case "experience":
              if (!experience || experience.length === 0) return null;
              return (
                <section id="preview-section-experience" key="experience" className="mb-3.5">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <div className="mt-1.5 space-y-2.5">
                    {experience.map((exp, index) => (
                      <div key={index} className="break-inside-avoid">
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
                        {renderBullets(exp.description)}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "projects":
              if (!projects || projects.length === 0) return null;
              return (
                <section id="preview-section-projects" key="projects" className="mb-3.5">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <div className="mt-1.5 space-y-2.5">
                    {projects.map((project, index) => {
                      const githubUrl = project.github || (project as any).githubUrl;
                      const demoUrl =
                        project.liveDemo ||
                        (project as any).liveUrl ||
                        (project as any).demo ||
                        (project as any).url;
                      return (
                        <div key={index} className="break-inside-avoid">
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="font-bold text-gray-950">{project.title || "Project Title"}</span>
                            <div className="text-[11px] font-semibold flex items-center gap-1.5">
                              {githubUrl && (
                                <a
                                  href={formatUrl(githubUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  GitHub
                                </a>
                              )}
                              {githubUrl && demoUrl && (
                                <span className="text-gray-400 font-normal select-none">•</span>
                              )}
                              {demoUrl && (
                                <a
                                  href={formatUrl(demoUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Demo
                                </a>
                              )}
                            </div>
                          </div>
                        {project.technologies && project.technologies.length > 0 && (
                          <p className="text-[11px] font-semibold text-gray-700 mt-0.5">
                            Technologies: {project.technologies.join(", ")}
                          </p>
                        )}
                        {renderBullets(project.description)}
                      </div>
                      );
                    })}
                  </div>
                </section>
              );

            case "education":
              if (!education || education.length === 0) return null;
              return (
                <section id="preview-section-education" key="education" className="mb-3.5">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <div className="mt-1.5 space-y-1.5">
                    {education.map((edu, index) => (
                      <div key={index} className="break-inside-avoid flex justify-between items-baseline text-xs">
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
                <section id="preview-section-certifications" key="certifications" className="mb-3.5 break-inside-avoid">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <div className="mt-1.5 space-y-1.5">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between text-xs items-baseline">
                        <div>
                          <span className="font-bold text-gray-950">{cert.name}</span>
                          {cert.organization && <span className="text-gray-700 italic"> ({cert.organization})</span>}
                        </div>
                        {cert.issueDate && <span className="text-gray-600 font-semibold">{cert.issueDate}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "achievements":
              if (!achievements || achievements.length === 0) return null;
              return (
                <section id="preview-section-achievements" key="achievements" className="mb-3.5">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <ul className="mt-1.5 space-y-1 text-xs text-gray-800">
                    {achievements.map((achievement, index) => {
                      const cleanTitle = (achievement.title || "").replace(/^[•\-\*\s]+/, "").trim();
                      const cleanDesc = (achievement.description || "").replace(/^[•\-\*\s]+/, "").trim();
                      return (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-900 select-none font-bold leading-none mt-1 text-[8px]">•</span>
                          <span className="leading-relaxed flex-1 text-gray-800">
                            <span className="font-bold text-gray-950">{cleanTitle}</span>
                            {cleanDesc && ` — ${cleanDesc}`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );

            case "languages":
              if (!languages || languages.length === 0) return null;
              return (
                <section id="preview-section-languages" key="languages" className="mb-3.5">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-800">
                    {languages
                      .map((lang) => `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ""}`)
                      .join(" • ")}
                  </p>
                </section>
              );

            case "interests":
              if (!interests || interests.length === 0) return null;
              return (
                <section id="preview-section-interests" key="interests" className="mb-3.5">
                  <h2 className="border-b border-gray-900 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-950">
                    {title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-800">
                    {interests.map((interest) => interest.name).join(" • ")}
                  </p>
                </section>
              );

            default:
              return null;
          }
        };

        const rawOrder = Array.isArray(sectionOrder) && sectionOrder.length > 0
          ? sectionOrder
          : [
              "summary",
              "experience",
              "education",
              "skills",
              "projects",
              "certifications",
              "achievements",
              "languages",
              "interests",
            ];
        const effectiveOrder = rawOrder.includes("summary") ? rawOrder : ["summary", ...rawOrder];

        return effectiveOrder.map((sectionKey) => renderSection(sectionKey));
      })()}
    </div>
  );
}
