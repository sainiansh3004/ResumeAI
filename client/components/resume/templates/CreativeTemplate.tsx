"use client";

import { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

const themeMap = {
  blue: {
    header: "from-blue-700 via-blue-600 to-cyan-600",
    primary: "text-blue-700",
    secondary: "text-blue-600",
    border: "border-blue-600",
    card: "border-blue-200 bg-blue-50",
    chip: "from-blue-600 to-cyan-600",
  },
  purple: {
    header: "from-purple-700 via-indigo-600 to-blue-600",
    primary: "text-purple-700",
    secondary: "text-purple-600",
    border: "border-purple-600",
    card: "border-purple-200 bg-purple-50",
    chip: "from-purple-600 to-indigo-600",
  },
  green: {
    header: "from-green-700 via-emerald-600 to-teal-600",
    primary: "text-green-700",
    secondary: "text-green-600",
    border: "border-green-600",
    card: "border-green-200 bg-green-50",
    chip: "from-green-600 to-emerald-600",
  },
  black: {
    header: "from-gray-900 via-gray-800 to-gray-700",
    primary: "text-gray-900",
    secondary: "text-gray-700",
    border: "border-gray-900",
    card: "border-gray-300 bg-gray-100",
    chip: "from-gray-900 to-gray-700",
  },
  red: {
    header: "from-red-700 via-rose-600 to-pink-600",
    primary: "text-red-700",
    secondary: "text-red-600",
    border: "border-red-600",
    card: "border-red-200 bg-red-50",
    chip: "from-red-600 to-rose-600",
  },
} as const;

export default function CreativeTemplate({ resume }: Props) {
  const theme =
    themeMap[resume.themeColor || "purple"];
  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-lg">

      {/* ================= HEADER ================= */}

<div className={`bg-gradient-to-r ${theme.header} p-8 text-white`}>
  <div className="flex items-start justify-between gap-8">

    {/* LEFT */}
    <div className="flex-1">
      <h1 className="text-4xl font-bold leading-tight">
        {resume.personalInfo.fullName || "Your Name"}
      </h1>

      {resume.personalInfo.headline && (
        <p className="mt-2 text-lg opacity-90">
          {resume.personalInfo.headline}
        </p>
      )}

      <div className="mt-4 space-y-2 text-sm opacity-95">
        {resume.personalInfo.email && (
          <div>{resume.personalInfo.email}</div>
        )}

        {resume.personalInfo.phone && (
          <div>{resume.personalInfo.phone}</div>
        )}

        {resume.personalInfo.address && (
          <div>{resume.personalInfo.address}</div>
        )}

        {resume.personalInfo.linkedin && (
          <div>{resume.personalInfo.linkedin}</div>
        )}

        {resume.personalInfo.github && (
          <div>{resume.personalInfo.github}</div>
        )}

        {resume.personalInfo.portfolio && (
          <div>{resume.personalInfo.portfolio}</div>
        )}
      </div>
    </div>

    {/* RIGHT */}
    {resume.personalInfo.photo && (
      <img
        src={resume.personalInfo.photo}
        alt="Profile"
        className="h-28 w-28 shrink-0 rounded-full border-4 border-white object-cover shadow-xl"
      />
    )}
  </div>
</div>

<div className="p-8">

      {/* ================= DYNAMIC SECTIONS ================= */}
      {(() => {
        const getDefaultTitle = (key: string): string => {
          switch (key) {
            case "summary": return "Professional Summary";
            case "education": return "Education";
            case "experience": return "Experience";
            case "skills": return "Skills";
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
              if (!resume.personalInfo.summary?.trim()) return null;
              return (
                <section key="summary" className="mb-8">
                  <h2 className={`mb-3 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <p className="whitespace-pre-line text-gray-700">
                    {resume.personalInfo.summary}
                  </p>
                </section>
              );

            case "education":
              if (!resume.education || resume.education.length === 0) return null;
              return (
                <section key="education" className="mb-8">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="space-y-5">
                    {resume.education.map((edu, index) => (
                      <div key={index} className={`rounded-lg border p-4 ${theme.card}`}>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {edu.degree}
                              {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                            </h3>
                            <p className={theme.primary}>{edu.college}</p>
                            {edu.cgpa && <p className="text-gray-600">CGPA: {edu.cgpa}</p>}
                          </div>
                          <span className="text-gray-500">
                            {edu.startYear}
                            {edu.startYear && edu.endYear && " - "}
                            {edu.endYear}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "experience":
              if (!resume.experience || resume.experience.length === 0) return null;
              return (
                <section key="experience" className="mb-8">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="space-y-5">
                    {resume.experience.map((exp, index) => (
                      <div key={index} className={`rounded-lg border p-4 ${theme.card}`}>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{exp.position}</h3>
                            <p className={theme.primary}>
                              {exp.company}
                              {exp.location && ` • ${exp.location}`}
                            </p>
                            {exp.employmentType && <p className="text-sm text-gray-500">{exp.employmentType}</p>}
                          </div>
                          <span className="text-gray-500">
                            {exp.startDate}
                            {exp.startDate && exp.endDate && " - "}
                            {exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-3 whitespace-pre-line text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "skills":
              if (!resume.skills || resume.skills.length === 0) return null;
              return (
                <section key="skills" className="mb-8">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resume.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`rounded-full bg-gradient-to-r px-4 py-2 text-sm font-medium text-white ${theme.chip}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              );

            case "projects":
              if (!resume.projects || resume.projects.length === 0) return null;
              return (
                <section key="projects" className="mb-8">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="space-y-5">
                    {resume.projects.map((project, index) => (
                      <div key={index} className={`rounded-lg border p-4 ${theme.card}`}>
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        {project.technologies?.length > 0 && (
                          <p className={`mt-2 text-sm ${theme.secondary}`}>
                            {project.technologies.join(" • ")}
                          </p>
                        )}
                        <div className="mt-3 flex gap-5 text-sm">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${theme.secondary} underline`}
                            >
                              GitHub
                            </a>
                          )}
                          {project.liveDemo && (
                            <a
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${theme.secondary} underline`}
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="mt-3 whitespace-pre-line text-gray-700">{project.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "certifications":
              if (!resume.certifications || resume.certifications.length === 0) return null;
              return (
                <section key="certifications" className="mb-8">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="space-y-5">
                    {resume.certifications.map((cert, index) => (
                      <div key={index} className={`rounded-lg border p-4 ${theme.card}`}>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{cert.name}</h3>
                            {cert.organization && <p className={theme.primary}>{cert.organization}</p>}
                          </div>
                          {cert.issueDate && <span className="text-gray-500">{cert.issueDate}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "languages":
              if (!resume.languages || resume.languages.length === 0) return null;
              return (
                <section key="languages" className="mb-8">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resume.languages.map((language, index) => (
                      <span
                        key={index}
                        className={`rounded-full bg-gradient-to-r px-4 py-2 text-sm font-medium text-white ${theme.chip}`}
                      >
                        {language.name}
                        {language.proficiency && (
                          <span className="ml-2 opacity-90">({language.proficiency})</span>
                        )}
                      </span>
                    ))}
                  </div>
                </section>
              );

            case "achievements":
              if (!resume.achievements || resume.achievements.length === 0) return null;
              return (
                <section key="achievements" className="mb-8">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="space-y-5">
                    {resume.achievements.map((achievement, index) => (
                      <div key={index} className={`rounded-lg border p-4 ${theme.card}`}>
                        <h3 className="text-lg font-semibold">{achievement.title}</h3>
                        {achievement.description && (
                          <p className="mt-2 whitespace-pre-line text-gray-700">{achievement.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "interests":
              if (!resume.interests || resume.interests.length === 0) return null;
              return (
                <section key="interests">
                  <h2 className={`mb-5 border-l-4 pl-3 text-2xl font-bold ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resume.interests.map((interest, index) => (
                      <span
                        key={index}
                        className={`rounded-full bg-gradient-to-r px-4 py-2 text-sm font-medium text-white ${theme.chip}`}
                      >
                        {interest.name}
                      </span>
                    ))}
                  </div>
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
    </div>
  );
}