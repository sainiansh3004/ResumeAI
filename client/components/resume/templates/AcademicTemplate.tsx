"use client";

import { Resume } from "@/types/resume";
import { formatUrl } from "@/utils/formatUrl";

interface Props {
  resume: Resume;
}

const themeMap = {
  blue: {
    primary: "text-blue-900",
    secondary: "text-blue-700",
    border: "border-blue-900",
  },
  purple: {
    primary: "text-purple-900",
    secondary: "text-purple-700",
    border: "border-purple-900",
  },
  green: {
    primary: "text-green-900",
    secondary: "text-green-700",
    border: "border-green-900",
  },
  black: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    border: "border-gray-950",
  },
  red: {
    primary: "text-red-900",
    secondary: "text-red-700",
    border: "border-red-900",
  },
} as const;

export default function AcademicTemplate({ resume }: Props) {
  const theme = themeMap[resume.themeColor || "black"];
  const { personalInfo, hiddenSections = [], customTitles = {} } = resume;

  const getDefaultTitle = (key: string): string => {
    switch (key) {
      case "summary": return "Research Interests & Profile";
      case "education": return "Education";
      case "experience": return "Professional Appointments";
      case "skills": return "Areas of Expertise";
      case "projects": return "Research & Projects";
      case "certifications": return "Certifications";
      case "achievements": return "Awards & Honors";
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
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed text-justify whitespace-pre-line">
              {personalInfo.summary || "No professional summary added yet."}
            </p>
          </section>
        );

      case "education":
        return (
          <section key="education" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2.5 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.education?.length > 0 ? (
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline font-semibold text-gray-900">
                      <span>{edu.college}</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {edu.startYear} {edu.startYear && edu.endYear && "–"} {edu.endYear}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-gray-600">
                      <span className="italic">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</span>
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

      case "experience":
        return (
          <section key="experience" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2.5 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.experience?.length > 0 ? (
              <div className="space-y-3.5">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline font-semibold text-gray-900">
                      <span>{exp.position}</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {exp.startDate} {exp.startDate && exp.endDate && "–"} {exp.endDate}
                      </span>
                    </div>
                    <div className="text-gray-600 italic text-[11px] mb-1">
                      {exp.company}{exp.location && `, ${exp.location}`}
                    </div>
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

      case "skills":
        return (
          <section key="skills" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.skills?.length > 0 ? (
              <p className="text-xs text-gray-700 leading-normal">
                {resume.skills.join(" • ")}
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">No skills added yet.</p>
            )}
          </section>
        );

      case "projects":
        return (
          <section key="projects" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2.5 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.projects?.length > 0 ? (
              <div className="space-y-3">
                {resume.projects.map((project, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-900">{project.title}</span>
                      <div className="flex gap-3 text-[11px]">
                        {project.github && (
                          <a href={formatUrl(project.github)} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:underline">
                            Code
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={formatUrl(project.liveDemo)} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:underline">
                            Link
                          </a>
                        )}
                      </div>
                    </div>
                    {project.technologies?.length > 0 && (
                      <div className="text-[10px] text-gray-500 italic mt-0.5">
                        Focus: {project.technologies.join(", ")}
                      </div>
                    )}
                    {project.description && (
                      <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line text-[11px] mt-0.5">
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

      case "certifications":
        return (
          <section key="certifications" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.certifications?.length > 0 ? (
              <div className="space-y-2 text-xs">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between break-inside-avoid">
                    <div>
                      <span className="font-semibold text-gray-900">{cert.name}</span>
                      {cert.organization && <span className="text-gray-600">, {cert.organization}</span>}
                    </div>
                    {cert.issueDate && <span className="text-gray-500 font-medium text-[11px]">{cert.issueDate}</span>}
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
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.achievements?.length > 0 ? (
              <div className="space-y-2 text-xs">
                {resume.achievements.map((ach, index) => (
                  <div key={index} className="break-inside-avoid">
                    <span className="font-semibold text-gray-900">{ach.title}</span>
                    {ach.description && <span className="text-gray-600"> – {ach.description}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No achievements added yet.</p>
            )}
          </section>
        );

      case "languages":
        return (
          <section key="languages" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.languages?.length > 0 ? (
              <p className="text-xs text-gray-700 leading-normal">
                {resume.languages.map((lang) => `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ""}`).join(" • ")}
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">No languages added yet.</p>
            )}
          </section>
        );

      case "interests":
        return (
          <section key="interests" className="break-inside-avoid">
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2 ${theme.primary} ${theme.border}`}>
              {title}
            </h2>
            {resume.interests?.length > 0 ? (
              <p className="text-xs text-gray-700 leading-normal">
                {resume.interests.map((int) => int.name).join(" • ")}
              </p>
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
    <div className="w-full text-gray-800 bg-white min-h-[1100px] p-10 flex flex-col gap-6" style={{ fontFamily: "Georgia, serif" }}>
      {/* Header Block: Traditional Academic CV Header */}
      <div className="flex flex-col items-center justify-center pb-4 mb-2">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName || "Profile Photo"}
            className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 shadow-sm mb-3"
          />
        )}
        <h1 className={`text-3xl font-normal tracking-tight ${theme.primary} mb-2`}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.headline && (
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            {personalInfo.headline}
          </p>
        )}

        {/* Contact details layout in a single line with bullet separation */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-600 italic">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.address && <span>• {personalInfo.address}</span>}
          {personalInfo.linkedin && (
            <span>
              •{" "}
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </span>
          )}
          {personalInfo.github && (
            <span>
              •{" "}
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
            </span>
          )}
          {personalInfo.portfolio && (
            <span>
              •{" "}
              <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Website
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Dynamic sections list */}
      <div className="flex-grow flex flex-col gap-6">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
}
