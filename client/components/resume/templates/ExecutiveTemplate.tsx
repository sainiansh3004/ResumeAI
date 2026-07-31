"use client";

import { Resume } from "@/types/resume";
import { formatUrl } from "@/utils/formatUrl";

interface Props {
  resume: Resume;
}

const themeMap = {
  blue: {
    primary: "text-blue-800",
    secondary: "text-blue-600",
    border: "border-blue-600",
    bgLight: "bg-blue-50/50",
    accent: "bg-blue-600",
  },
  purple: {
    primary: "text-purple-800",
    secondary: "text-purple-600",
    border: "border-purple-600",
    bgLight: "bg-purple-50/50",
    accent: "bg-purple-600",
  },
  green: {
    primary: "text-green-800",
    secondary: "text-green-600",
    border: "border-green-600",
    bgLight: "bg-green-50/50",
    accent: "bg-green-600",
  },
  black: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    border: "border-gray-800",
    bgLight: "bg-gray-50",
    accent: "bg-gray-800",
  },
  red: {
    primary: "text-red-800",
    secondary: "text-red-600",
    border: "border-red-600",
    bgLight: "bg-red-50/50",
    accent: "bg-red-600",
  },
} as const;

export default function ExecutiveTemplate({ resume }: Props) {
  const theme = themeMap[resume.themeColor || "blue"];
  const { personalInfo, hiddenSections = [], customTitles = {} } = resume;

  const getDefaultTitle = (key: string): string => {
    switch (key) {
      case "summary": return "Executive Summary";
      case "education": return "Education";
      case "experience": return "Work History";
      case "skills": return "Expertise";
      case "projects": return "Key Projects";
      case "certifications": return "Certifications";
      case "achievements": return "Key Achievements";
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

  const sidebarKeys = ["skills", "certifications", "languages", "interests"];
  const mainKeys = ["summary", "experience", "projects", "education", "achievements"];

  const renderSection = (sectionKey: string) => {
    if (hiddenSections.includes(sectionKey)) return null;
    const title = customTitles[sectionKey] || getDefaultTitle(sectionKey);

    switch (sectionKey) {
      case "summary":
        return (
          <section key="summary" className="mb-6 break-inside-avoid">
            <h2 className={`text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed text-justify whitespace-pre-line">
              {personalInfo.summary || "No professional summary added yet."}
            </p>
          </section>
        );

      case "experience":
        return (
          <section key="experience" className="mb-6 break-inside-avoid">
            <h2 className={`text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.experience?.length > 0 ? (
              <div className="space-y-4">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900 text-sm">{exp.position}</h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {exp.startDate} {exp.startDate && exp.endDate && "–"} {exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-gray-600 mb-1">
                      <span className={`font-medium ${theme.secondary}`}>{exp.company}</span>
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 whitespace-pre-line leading-normal text-justify">
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
          <section key="projects" className="mb-6 break-inside-avoid">
            <h2 className={`text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.projects?.length > 0 ? (
              <div className="space-y-4">
                {resume.projects.map((project, index) => (
                  <div key={index} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900 text-sm">{project.title}</h3>
                      <div className="flex gap-3 text-xs">
                        {project.github && (
                          <a href={formatUrl(project.github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-[11px]">
                            GitHub
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={formatUrl(project.liveDemo)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-[11px]">
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                    {project.technologies?.length > 0 && (
                      <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                        Technologies: {project.technologies.join(" • ")}
                      </div>
                    )}
                    {project.description && (
                      <p className="text-xs text-gray-600 whitespace-pre-line leading-normal mt-1 text-justify">
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
          <section key="education" className="mb-6 break-inside-avoid">
            <h2 className={`text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.education?.length > 0 ? (
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div key={index} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {edu.startYear} {edu.startYear && edu.endYear && "–"} {edu.endYear}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-gray-600">
                      <span className={`font-medium ${theme.secondary}`}>{edu.college}</span>
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

      case "achievements":
        return (
          <section key="achievements" className="mb-6 break-inside-avoid">
            <h2 className={`text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.achievements?.length > 0 ? (
              <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1.5">
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

      case "skills":
        return (
          <section key="skills" className="mb-6 break-inside-avoid">
            <h3 className={`text-xs font-bold uppercase tracking-wider border-b mb-2 pb-0.5 ${theme.primary} ${theme.border}`}>
              {title}
            </h3>
            {resume.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="bg-white/70 border border-gray-100 text-gray-800 text-[11px] px-2 py-0.5 rounded font-medium shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">No skills added yet.</p>
            )}
          </section>
        );

      case "certifications":
        return (
          <section key="certifications" className="mb-6 break-inside-avoid">
            <h3 className={`text-xs font-bold uppercase tracking-wider border-b mb-2 pb-0.5 ${theme.primary} ${theme.border}`}>
              {title}
            </h3>
            {resume.certifications?.length > 0 ? (
              <div className="space-y-2">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="text-[11px]">
                    <div className="font-semibold text-gray-950">{cert.name}</div>
                    <div className="text-gray-600">{cert.organization}</div>
                    {cert.issueDate && <div className="text-gray-400 text-[10px]">{cert.issueDate}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">No certifications added yet.</p>
            )}
          </section>
        );

      case "languages":
        return (
          <section key="languages" className="mb-6 break-inside-avoid">
            <h3 className={`text-xs font-bold uppercase tracking-wider border-b mb-2 pb-0.5 ${theme.primary} ${theme.border}`}>
              {title}
            </h3>
            {resume.languages?.length > 0 ? (
              <div className="space-y-1">
                {resume.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-[11px] text-gray-700">
                    <span className="font-medium">{lang.name}</span>
                    {lang.proficiency && <span className="text-gray-400">({lang.proficiency})</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">No languages added yet.</p>
            )}
          </section>
        );

      case "interests":
        return (
          <section key="interests" className="mb-6 break-inside-avoid">
            <h3 className={`text-xs font-bold uppercase tracking-wider border-b mb-2 pb-0.5 ${theme.primary} ${theme.border}`}>
              {title}
            </h3>
            {resume.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {resume.interests.map((int, index) => (
                  <span key={index} className="text-[11px] text-gray-700 bg-white border border-gray-100 rounded px-1.5 py-0.5 shadow-sm">
                    {int.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">No interests added yet.</p>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full text-gray-800 flex bg-white min-h-[1100px]">
      {/* Sidebar Column */}
      <div className={`w-[240px] ${theme.bgLight} p-6 border-r border-gray-100 shrink-0 flex flex-col gap-6`}>
        {/* Photo inside Sidebar */}
        {personalInfo.photo && (
          <div className="flex justify-center mb-2">
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md"
            />
          </div>
        )}

        {/* Contact info list */}
        <div className="space-y-2.5 text-xs text-gray-700">
          <h3 className={`text-xs font-bold uppercase tracking-wider border-b mb-2 pb-0.5 ${theme.primary} ${theme.border}`}>
            Contact Info
          </h3>
          {personalInfo.email && (
            <div>
              <div className="font-semibold text-gray-500 uppercase text-[9px]">Email</div>
              <div className="truncate">{personalInfo.email}</div>
            </div>
          )}
          {personalInfo.phone && (
            <div>
              <div className="font-semibold text-gray-500 uppercase text-[9px]">Phone</div>
              <div>{personalInfo.phone}</div>
            </div>
          )}
          {personalInfo.address && (
            <div>
              <div className="font-semibold text-gray-500 uppercase text-[9px]">Location</div>
              <div>{personalInfo.address}</div>
            </div>
          )}
          {personalInfo.linkedin && (
            <div>
              <div className="font-semibold text-gray-500 uppercase text-[9px]">LinkedIn</div>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                {personalInfo.linkedin.replace(/https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
          {personalInfo.github && (
            <div>
              <div className="font-semibold text-gray-500 uppercase text-[9px]">GitHub</div>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                {personalInfo.github.replace(/https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
          {personalInfo.portfolio && (
            <div>
              <div className="font-semibold text-gray-500 uppercase text-[9px]">Portfolio</div>
              <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                {personalInfo.portfolio.replace(/https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
        </div>

        {/* Sidebar dynamic sections */}
        <div className="flex-grow flex flex-col gap-6">
          {order.filter(key => sidebarKeys.includes(key)).map(key => renderSection(key))}
        </div>
      </div>

      {/* Main Content Column */}
      <div className="flex-grow p-8 flex flex-col gap-6">
        {/* Header Block */}
        <div className="border-b-2 pb-4 mb-2">
          <h1 className={`text-3xl font-extrabold tracking-tight ${theme.primary}`}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.headline && (
            <p className="text-sm font-semibold uppercase tracking-widest mt-1.5 text-gray-500">
              {personalInfo.headline}
            </p>
          )}
        </div>

        {/* Main Content dynamic sections */}
        <div className="flex-grow flex flex-col gap-6">
          {order.filter(key => mainKeys.includes(key)).map(key => renderSection(key))}
        </div>
      </div>
    </div>
  );
}
