"use client";

import { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

const themeMap = {
  blue: {
    primary: "text-blue-700",
    secondary: "text-blue-600",
    border: "border-blue-600",
    light: "bg-blue-50",
  },
  purple: {
    primary: "text-purple-700",
    secondary: "text-purple-600",
    border: "border-purple-600",
    light: "bg-purple-50",
  },
  green: {
    primary: "text-green-700",
    secondary: "text-green-600",
    border: "border-green-600",
    light: "bg-green-50",
  },
  black: {
    primary: "text-gray-900",
    secondary: "text-gray-800",
    border: "border-gray-900",
    light: "bg-gray-100",
  },
  red: {
    primary: "text-red-700",
    secondary: "text-red-600",
    border: "border-red-600",
    light: "bg-red-50",
  },
} as const;

export default function ModernTemplate({ resume }: Props) {
  const theme = themeMap[resume.themeColor || "blue"];
  console.log("Modern Resume:", resume);
  console.log("Modern PersonalInfo:", resume.personalInfo);
  console.log("PHOTO:", resume.personalInfo.photo);
  console.log("FULL RESUME:", resume);

  return (
    <div className="w-full bg-white">
      {/* ================= HEADER ================= */}

      <div
        id="preview-section-personalInfo"
        className={`mb-5 flex items-start justify-between border-b-2 pb-3 ${theme.border}`}
      >
        <div className="flex-1">
          <h1
            className={`text-3xl font-bold ${theme.primary}`}
          >
            {resume.personalInfo.fullName || "Your Name"}
          </h1>

          {resume.personalInfo.headline && (
            <p className="mt-2 text-xl font-medium text-gray-700">
              {resume.personalInfo.headline}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            {resume.personalInfo.email && (
              <span>{resume.personalInfo.email}</span>
            )}

            {resume.personalInfo.phone && (
              <span>{resume.personalInfo.phone}</span>
            )}

            {resume.personalInfo.address && (
              <span>{resume.personalInfo.address}</span>
            )}
          </div>

          <div
            className={`mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm ${theme.secondary}`}
          >
            {resume.personalInfo.linkedin && (
              <span>{resume.personalInfo.linkedin}</span>
            )}

            {resume.personalInfo.github && (
              <span>{resume.personalInfo.github}</span>
            )}

            {resume.personalInfo.portfolio && (
              <span>{resume.personalInfo.portfolio}</span>
            )}
          </div>
        </div>

        {resume.personalInfo.photo && (
          <img
            src={resume.personalInfo.photo}
            alt="Profile"
            className={`ml-6 h-28 w-28 shrink-0 rounded-full border-4 object-cover shadow-lg ${theme.border}`}
          />
        )}
      </div>

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
                <section id="preview-section-summary" key="summary" className="mb-8 break-inside-avoid">
                  <h2 className={`mb-3 border-b-2 pb-1 text-lg font-bold ${theme.primary} ${theme.border}`}>
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
                <section id="preview-section-education" key="education" className="mt-4">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  {resume.education.map((edu, index) => (
                    <div key={index} className="mb-5 flex items-start justify-between break-inside-avoid education-item">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree}
                          {edu.fieldOfStudy && (
                            <span className="font-normal"> in {edu.fieldOfStudy}</span>
                          )}
                        </h3>
                        <p className="font-medium text-gray-700">{edu.college}</p>
                        {edu.cgpa && <p className="text-gray-600">CGPA : {edu.cgpa}</p>}
                      </div>
                      <div className="whitespace-nowrap text-right text-gray-500">
                        {edu.startYear}
                        {edu.startYear && edu.endYear && " - "}
                        {edu.endYear}
                      </div>
                    </div>
                  ))}
                </section>
              );

            case "experience":
              if (!resume.experience || resume.experience.length === 0) return null;
              return (
                <section id="preview-section-experience" key="experience" className="mt-4">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="mb-6 flex items-start justify-between break-inside-avoid experience-item">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="font-medium text-gray-700">
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        {exp.employmentType && (
                          <p className="text-sm text-gray-500">{exp.employmentType}</p>
                        )}
                        {exp.description && (
                          <p className="mt-2 whitespace-pre-line text-gray-700">{exp.description}</p>
                        )}
                      </div>
                      <div className="ml-6 whitespace-nowrap text-right text-gray-500">
                        {exp.startDate}
                        {exp.startDate && exp.endDate && " - "}
                        {exp.endDate}
                      </div>
                    </div>
                  ))}
                </section>
              );

            case "skills":
              if (!resume.skills || resume.skills.length === 0) return null;
              return (
                <section id="preview-section-skills" key="skills" className="mt-4 break-inside-avoid">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resume.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`rounded-full border px-4 py-2 text-sm font-medium ${theme.border} ${theme.light} ${theme.primary}`}
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
                <section id="preview-section-projects" key="projects" className="mt-4">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  {resume.projects.map((project, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      {project.technologies?.length > 0 && (
                        <p className={`mt-1 text-sm font-medium ${theme.secondary}`}>
                          {project.technologies.join(" • ")}
                        </p>
                      )}
                      <div className="mt-2 flex gap-5 text-sm">
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
                </section>
              );

            case "certifications":
              if (!resume.certifications || resume.certifications.length === 0) return null;
              return (
                <section id="preview-section-certifications" key="certifications" className="mt-4">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="mb-5 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                        {cert.organization && <p className="font-medium text-gray-700">{cert.organization}</p>}
                      </div>
                      {cert.issueDate && (
                        <div className="ml-6 whitespace-nowrap text-right text-gray-500">
                          {cert.issueDate}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              );

            case "languages":
              if (!resume.languages || resume.languages.length === 0) return null;
              return (
                <section id="preview-section-languages" key="languages" className="mt-4">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resume.languages.map((language, index) => (
                      <div key={index} className={`rounded-full border px-4 py-2 ${theme.border} ${theme.light}`}>
                        <span className={`font-medium ${theme.primary}`}>{language.name}</span>
                        {language.proficiency && (
                          <span className="ml-2 text-sm text-gray-600">({language.proficiency})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "achievements":
              if (!resume.achievements || resume.achievements.length === 0) return null;
              return (
                <section id="preview-section-achievements" key="achievements" className="mt-4">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  {resume.achievements.map((achievement, index) => (
                    <div key={index} className={`mb-5 rounded-lg border p-4 ${theme.border} ${theme.light}`}>
                      <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="mt-2 whitespace-pre-line text-gray-700">{achievement.description}</p>
                      )}
                    </div>
                  ))}
                </section>
              );

            case "interests":
              if (!resume.interests || resume.interests.length === 0) return null;
              return (
                <section id="preview-section-interests" key="interests" className="mt-4">
                  <h2 className={`mb-4 border-b-2 pb-1 text-xl font-bold ${theme.primary} ${theme.border}`}>
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resume.interests.map((interest, index) => (
                      <span
                        key={index}
                        className={`rounded-full border px-4 py-2 text-sm font-medium ${theme.border} ${theme.light} ${theme.primary}`}
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
  );
}