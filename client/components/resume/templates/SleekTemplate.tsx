"use client";

import { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

const themeMap = {
  blue: {
    primary: "text-blue-900",
    secondary: "text-blue-600",
    border: "border-blue-600",
    line: "bg-blue-100",
  },
  purple: {
    primary: "text-purple-900",
    secondary: "text-purple-600",
    border: "border-purple-600",
    line: "bg-purple-100",
  },
  green: {
    primary: "text-green-900",
    secondary: "text-green-600",
    border: "border-green-600",
    line: "bg-green-100",
  },
  black: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    border: "border-gray-800",
    line: "bg-gray-200",
  },
  red: {
    primary: "text-red-900",
    secondary: "text-red-600",
    border: "border-red-600",
    line: "bg-red-100",
  },
} as const;

export default function SleekTemplate({ resume }: Props) {
  const theme = themeMap[resume.themeColor || "blue"];
  const { personalInfo, hiddenSections = [], customTitles = {} } = resume;

  const getDefaultTitle = (key: string): string => {
    switch (key) {
      case "summary": return "Summary";
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
          <section key="summary" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 text-gray-700 text-xs leading-relaxed text-justify whitespace-pre-line">
              {personalInfo.summary || "No professional summary added yet."}
            </div>
          </section>
        );

      case "experience":
        return (
          <section key="experience" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 space-y-4">
              {resume.experience?.length > 0 ? (
                resume.experience.map((exp, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{exp.position}</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {exp.startDate} {exp.startDate && exp.endDate && "–"} {exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-gray-500 mb-1 text-[11px]">
                      <span>{exp.company} {exp.location ? `• ${exp.location}` : ""}</span>
                      {exp.employmentType && <span>{exp.employmentType}</span>}
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line text-[11px]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No experience added yet.</p>
              )}
            </div>
          </section>
        );

      case "projects":
        return (
          <section key="projects" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 space-y-4">
              {resume.projects?.length > 0 ? (
                resume.projects.map((project, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{project.title}</span>
                      <div className="flex gap-3 text-[10px] font-medium">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Code
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Live
                          </a>
                        )}
                      </div>
                    </div>
                    {project.technologies?.length > 0 && (
                      <div className="text-[10px] text-gray-400 mb-1">
                        {project.technologies.join(" • ")}
                      </div>
                    )}
                    {project.description && (
                      <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line text-[11px]">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No projects added yet.</p>
              )}
            </div>
          </section>
        );

      case "education":
        return (
          <section key="education" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 space-y-3">
              {resume.education?.length > 0 ? (
                resume.education.map((edu, index) => (
                  <div key={index} className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {edu.startYear} {edu.startYear && edu.endYear && "–"} {edu.endYear}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-gray-500 text-[11px]">
                      <span>{edu.college}</span>
                      {edu.cgpa && <span>GPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No education added yet.</p>
              )}
            </div>
          </section>
        );

      case "skills":
        return (
          <section key="skills" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 text-xs text-gray-700 leading-relaxed font-semibold">
              {resume.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {resume.skills.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No skills added yet.</p>
              )}
            </div>
          </section>
        );

      case "certifications":
        return (
          <section key="certifications" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 grid grid-cols-2 gap-2 text-xs">
              {resume.certifications?.length > 0 ? (
                resume.certifications.map((cert, index) => (
                  <div key={index} className="break-inside-avoid">
                    <div className="font-bold text-gray-900">{cert.name}</div>
                    <div className="text-gray-500 text-[10px]">{cert.organization} {cert.issueDate && `• ${cert.issueDate}`}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic col-span-2">No certifications added yet.</p>
              )}
            </div>
          </section>
        );

      case "achievements":
        return (
          <section key="achievements" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 space-y-1.5 text-xs text-gray-700">
              {resume.achievements?.length > 0 ? (
                resume.achievements.map((ach, index) => (
                  <div key={index} className="break-inside-avoid flex items-start gap-1">
                    <span className="text-gray-400">•</span>
                    <div>
                      <strong className="text-gray-900">{ach.title}</strong>
                      {ach.description && ` – ${ach.description}`}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No achievements added yet.</p>
              )}
            </div>
          </section>
        );

      case "languages":
        return (
          <section key="languages" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 text-xs text-gray-700 leading-relaxed">
              {resume.languages?.length > 0 ? (
                <div className="flex flex-wrap gap-x-4">
                  {resume.languages.map((lang, index) => (
                    <span key={index} className="font-semibold">
                      {lang.name} {lang.proficiency && <span className="font-normal text-gray-400">({lang.proficiency})</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No languages added yet.</p>
              )}
            </div>
          </section>
        );

      case "interests":
        return (
          <section key="interests" className="grid grid-cols-4 gap-4 break-inside-avoid">
            <h2 className={`col-span-1 text-xs font-bold uppercase tracking-widest text-right ${theme.secondary}`}>
              {title}
            </h2>
            <div className="col-span-3 text-xs text-gray-600">
              {resume.interests?.length > 0 ? (
                <div className="flex flex-wrap gap-x-3">
                  {resume.interests.map((int, index) => (
                    <span key={index}>{int.name}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No interests added yet.</p>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full text-gray-800 bg-white min-h-[1100px] p-10 flex flex-col gap-6">
      {/* Header Block: Large, Modern Minimal Headline */}
      <div className="border-b pb-6 flex justify-between items-end gap-6">
        <div>
          <h1 className={`text-4xl font-light tracking-tight text-gray-900`}>
            {personalInfo.fullName?.split(" ")[0] || "Your"}{" "}
            <span className={`font-black ${theme.primary}`}>
              {personalInfo.fullName?.split(" ").slice(1).join(" ") || "Name"}
            </span>
          </h1>
          {personalInfo.headline && (
            <p className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-400">
              {personalInfo.headline}
            </p>
          )}
        </div>

        {/* Dynamic Photo rendering inside header */}
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover border border-gray-100 shadow-sm"
          />
        )}
      </div>

      {/* Grid of contact Info details */}
      <div className="grid grid-cols-4 gap-4 text-[10px] tracking-wide text-gray-500 font-bold uppercase border-b pb-4 mb-2">
        <span className="text-right">Contact</span>
        <div className="col-span-3 flex flex-wrap gap-x-5 gap-y-1 font-medium text-gray-700 normal-case text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Dynamic sections ordered list */}
      <div className="flex-grow flex flex-col gap-6">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
}
