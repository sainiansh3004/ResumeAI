"use client";

import { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

const themeMap = {
  blue: {
    primary: "text-blue-700",
    secondary: "text-blue-600",
    border: "border-blue-500",
    chip: "bg-blue-50 text-blue-800 border-blue-100",
    icon: "text-blue-500",
  },
  purple: {
    primary: "text-purple-700",
    secondary: "text-purple-600",
    border: "border-purple-500",
    chip: "bg-purple-50 text-purple-800 border-purple-100",
    icon: "text-purple-500",
  },
  green: {
    primary: "text-green-700",
    secondary: "text-green-600",
    border: "border-green-500",
    chip: "bg-green-50 text-green-800 border-green-100",
    icon: "text-green-500",
  },
  black: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    border: "border-gray-800",
    chip: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "text-gray-700",
  },
  red: {
    primary: "text-red-700",
    secondary: "text-red-600",
    border: "border-red-500",
    chip: "bg-red-50 text-red-800 border-red-100",
    icon: "text-red-500",
  },
} as const;

export default function TechTemplate({ resume }: Props) {
  const theme = themeMap[resume.themeColor || "blue"];
  const { personalInfo, hiddenSections = [], customTitles = {} } = resume;

  const getDefaultTitle = (key: string): string => {
    switch (key) {
      case "summary": return "Profile & Objective";
      case "education": return "Education";
      case "experience": return "Professional Experience";
      case "skills": return "Technical Skills";
      case "projects": return "Projects & Open Source";
      case "certifications": return "Certifications";
      case "achievements": return "Honors & Achievements";
      case "languages": return "Languages";
      case "interests": return "Interests";
      default: return key.charAt(0).toUpperCase() + key.slice(1);
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

  const renderSection = (sectionKey: string) => {
    if (hiddenSections.includes(sectionKey)) return null;
    const title = customTitles[sectionKey] || getDefaultTitle(sectionKey);

    switch (sectionKey) {
      case "summary":
        return (
          <section key="summary" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line text-justify">
              {personalInfo.summary || "No professional summary added yet."}
            </p>
          </section>
        );

      case "skills":
        return (
          <section key="skills" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill, index) => (
                  <span key={index} className={`text-[10px] px-2 py-0.5 rounded border font-semibold shadow-sm ${theme.chip}`}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No skills added yet.</p>
            )}
          </section>
        );

      case "experience":
        return (
          <section key="experience" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.experience?.length > 0 ? (
              <div className="space-y-3.5">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline font-semibold text-gray-900">
                      <span>
                        {exp.position} at <span className={theme.secondary}>{exp.company}</span>
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {exp.startDate} {exp.startDate && exp.endDate && "–"} {exp.endDate}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-[10px] text-gray-500 mb-1">{exp.location} {exp.employmentType ? `• ${exp.employmentType}` : ""}</div>
                    )}
                    {exp.description && (
                      <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line text-[11px]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No experience added yet.</p>
            )}
          </section>
        );

      case "projects":
        return (
          <section key="projects" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.projects?.length > 0 ? (
              <div className="space-y-3.5">
                {resume.projects.map((project, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-900">{project.title}</span>
                      <div className="flex gap-2.5 text-[11px]">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Code
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 mb-1">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.2 rounded border border-gray-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.description && (
                      <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line text-[11px]">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No projects added yet.</p>
            )}
          </section>
        );

      case "education":
        return (
          <section key="education" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.education?.length > 0 ? (
              <div className="space-y-2.5">
                {resume.education.map((edu, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline font-semibold text-gray-900">
                      <span>
                        {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {edu.startYear} {edu.startYear && edu.endYear && "–"} {edu.endYear}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-gray-600 text-[11px]">
                      <span>{edu.college}</span>
                      {edu.cgpa && <span>GPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No education added yet.</p>
            )}
          </section>
        );

      case "certifications":
        return (
          <section key="certifications" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.certifications?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-100 p-2 rounded break-inside-avoid">
                    <div className="font-semibold text-gray-900">{cert.name}</div>
                    <div className="text-gray-600 text-[10px]">{cert.organization}</div>
                    {cert.issueDate && <div className="text-gray-400 text-[9px]">{cert.issueDate}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No certifications added yet.</p>
            )}
          </section>
        );

      case "achievements":
        return (
          <section key="achievements" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.achievements?.length > 0 ? (
              <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                {resume.achievements.map((ach, index) => (
                  <li key={index} className="break-inside-avoid">
                    <strong className="text-gray-900">{ach.title}</strong>
                    {ach.description && ` – ${ach.description}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">No achievements added yet.</p>
            )}
          </section>
        );

      case "languages":
        return (
          <section key="languages" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.languages?.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-xs">
                {resume.languages.map((lang, index) => (
                  <span key={index} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 font-medium text-gray-700">
                    {lang.name} {lang.proficiency ? `(${lang.proficiency})` : ""}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No languages added yet.</p>
            )}
          </section>
        );

      case "interests":
        return (
          <section key="interests" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-l-4 pl-2 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 text-xs">
                {resume.interests.map((int, index) => (
                  <span key={index} className="bg-gray-50 border border-gray-100 rounded px-2 py-0.5 text-gray-600">
                    {int.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No interests added yet.</p>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full text-gray-800 bg-white min-h-[1100px] p-8 flex flex-col gap-5">
      {/* Header Block: Grid Layout for Developers */}
      <div className="border-b pb-4 mb-1 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center gap-4">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName || "Profile Photo"}
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-300 shadow-sm flex-shrink-0"
            />
          )}
          <div>
            <h1 className={`text-3xl font-black tracking-tight ${theme.primary}`}>
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.headline && (
              <p className="text-sm font-medium uppercase tracking-widest mt-1 text-gray-500">
                {personalInfo.headline}
              </p>
            )}
          </div>
        </div>

        {/* Contact info list */}
        <div className="flex flex-col items-end text-right text-[11px] text-gray-600 gap-y-1 shrink-0">
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-1">
            {personalInfo.email && (
              <div>
                <span className="font-bold text-gray-400 mr-1">EMAIL:</span>
                <span className="font-medium text-gray-800">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <span className="font-bold text-gray-400 mr-1">PHONE:</span>
                <span className="font-medium text-gray-800">{personalInfo.phone}</span>
              </div>
            )}
          </div>

          {personalInfo.address && (
            <div>
              <span className="font-bold text-gray-400 mr-1">LOC:</span>
              <span className="font-medium text-gray-800">{personalInfo.address}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[11px]">
            {personalInfo.linkedin && (
              <div>
                <span className="font-bold text-gray-400 mr-1">IN:</span>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div>
                <span className="font-bold text-gray-400 mr-1">GH:</span>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </div>
            )}
            {personalInfo.portfolio && (
              <div>
                <span className="font-bold text-gray-400 mr-1">WEB:</span>
                <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic sections ordered list */}
      <div className="flex-grow flex flex-col gap-5">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
}
