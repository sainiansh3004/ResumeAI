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
  },
  purple: {
    primary: "text-purple-700",
    secondary: "text-purple-600",
    border: "border-purple-600",
  },
  green: {
    primary: "text-green-700",
    secondary: "text-green-600",
    border: "border-green-600",
  },
  black: {
    primary: "text-gray-900",
    secondary: "text-gray-800",
    border: "border-gray-900",
  },
  red: {
    primary: "text-red-700",
    secondary: "text-red-600",
    border: "border-red-600",
  },
} as const;

export default function MinimalTemplate({ resume }: Props) {
  const theme =
    themeMap[resume.themeColor || "blue"];

  return (
    <div className="w-full bg-white p-10 text-sm leading-6 text-black">

      {/* ================= HEADER ================= */}

<div
  className={`mb-8 border-b pb-5 ${theme.border}`}
>
  <div className="flex items-center justify-between">

    <div className="flex-1 text-center">

      <h1
        className={`text-4xl font-bold ${theme.primary}`}
      >
        {resume.personalInfo.fullName || "Your Name"}
      </h1>

      {resume.personalInfo.headline && (
        <p className="mt-2 text-lg text-gray-700">
          {resume.personalInfo.headline}
        </p>
      )}

      <div
        className={`mt-4 space-y-1 ${theme.secondary}`}
      >
        {resume.personalInfo.email && (
          <p>{resume.personalInfo.email}</p>
        )}

        {resume.personalInfo.phone && (
          <p>{resume.personalInfo.phone}</p>
        )}

        {resume.personalInfo.address && (
          <p>{resume.personalInfo.address}</p>
        )}

        {resume.personalInfo.linkedin && (
          <p>{resume.personalInfo.linkedin}</p>
        )}

        {resume.personalInfo.github && (
          <p>{resume.personalInfo.github}</p>
        )}

        {resume.personalInfo.portfolio && (
          <p>{resume.personalInfo.portfolio}</p>
        )}
      </div>

    </div>

    {resume.personalInfo.photo && (
      <img
        src={resume.personalInfo.photo}
        alt="Profile"
        className={`ml-8 h-28 w-28 rounded-full border-4 object-cover ${theme.border}`}
      />
    )}

  </div>
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
              return (
                <section key="summary" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.personalInfo.summary ? (
                    <p className="whitespace-pre-line">{resume.personalInfo.summary}</p>
                  ) : (
                    <p className="italic text-gray-500">No professional summary added yet.</p>
                  )}
                </section>
              );

            case "education":
              return (
                <section key="education" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.education?.length > 0 ? (
                    resume.education.map((edu, index) => (
                      <div key={index} className="mb-5">
                        <div className="flex justify-between">
                          <strong>
                            {edu.degree}
                            {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                          </strong>
                          <span>
                            {edu.startYear}
                            {edu.startYear && edu.endYear && " - "}
                            {edu.endYear}
                          </span>
                        </div>
                        <p>{edu.college}</p>
                        {edu.cgpa && <p>CGPA: {edu.cgpa}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-500">No education added yet.</p>
                  )}
                </section>
              );

            case "experience":
              return (
                <section key="experience" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.experience?.length > 0 ? (
                    resume.experience.map((exp, index) => (
                      <div key={index} className="mb-5">
                        <div className="flex justify-between">
                          <strong>{exp.position || "Position"}</strong>
                          <span>
                            {exp.startDate}
                            {exp.startDate && exp.endDate && " - "}
                            {exp.endDate}
                          </span>
                        </div>
                        <p>{exp.company}</p>
                        {exp.location && <p className="text-gray-600">{exp.location}</p>}
                        {exp.employmentType && <p className="text-sm text-gray-500">{exp.employmentType}</p>}
                        {exp.description && <p className="mt-2 whitespace-pre-line">{exp.description}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-500">No experience added yet.</p>
                  )}
                </section>
              );

            case "skills":
              return (
                <section key="skills" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.skills?.length > 0 ? (
                    <p>{resume.skills.join(" • ")}</p>
                  ) : (
                    <p className="italic text-gray-500">No skills added yet.</p>
                  )}
                </section>
              );

            case "projects":
              return (
                <section key="projects" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.projects?.length > 0 ? (
                    resume.projects.map((project, index) => (
                      <div key={index} className="mb-5">
                        <strong>{project.title || "Project Title"}</strong>
                        {project.technologies?.length > 0 && (
                          <p className={`mt-1 ${theme.secondary}`}>
                            {project.technologies.join(" • ")}
                          </p>
                        )}
                        {project.description && <p className="mt-2 whitespace-pre-line">{project.description}</p>}
                        {(project.github || project.liveDemo) && (
                          <div className="mt-2 flex gap-5">
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
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-500">No projects added yet.</p>
                  )}
                </section>
              );

            case "certifications":
              return (
                <section key="certifications" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.certifications?.length > 0 ? (
                    resume.certifications.map((cert, index) => (
                      <div key={index} className="mb-5">
                        <div className="flex justify-between">
                          <strong>{cert.name}</strong>
                          {cert.issueDate && <span>{cert.issueDate}</span>}
                        </div>
                        {cert.organization && <p>{cert.organization}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-500">No certifications added yet.</p>
                  )}
                </section>
              );

            case "languages":
              return (
                <section key="languages" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.languages?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {resume.languages.map((language, index) => (
                        <div key={index}>
                          <strong className={theme.primary}>{language.name}</strong>
                          {language.proficiency && (
                            <span className="text-gray-600"> ({language.proficiency})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-gray-500">No languages added yet.</p>
                  )}
                </section>
              );

            case "achievements":
              return (
                <section key="achievements" className="mb-8">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.achievements?.length > 0 ? (
                    resume.achievements.map((achievement, index) => (
                      <div key={index} className="mb-5">
                        <strong>{achievement.title}</strong>
                        {achievement.description && <p className="mt-2 whitespace-pre-line">{achievement.description}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-500">No achievements added yet.</p>
                  )}
                </section>
              );

            case "interests":
              return (
                <section key="interests">
                  <h2 className={`mb-2 border-b font-bold uppercase ${theme.border} ${theme.primary}`}>
                    {title}
                  </h2>
                  {resume.interests?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {resume.interests.map((interest, index) => (
                        <span key={index} className={`rounded border px-3 py-1 text-sm ${theme.border} ${theme.primary}`}>
                          {interest.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-gray-500">No interests added yet.</p>
                  )}
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