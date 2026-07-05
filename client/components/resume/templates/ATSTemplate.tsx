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

      {/* ================= SUMMARY ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Professional Summary
        </h2>

        <p className="mt-2 whitespace-pre-line text-justify">
          {personalInfo.summary ||
            "No professional summary added yet."}
        </p>
      </section>

      {/* ================= SKILLS ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Technical Skills
        </h2>

        {skills.length > 0 ? (
          <p className="mt-2">{skills.join(" • ")}</p>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No skills added yet.
          </p>
        )}
      </section>

      {/* ================= EXPERIENCE ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Professional Experience
        </h2>

        {experience.length > 0 ? (
          <div className="mt-3 space-y-5">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">
                      {exp.position || "Position"}
                    </h3>

                    <p className="italic">
                      {exp.company}

                      {exp.location &&
                        ` | ${exp.location}`}
                    </p>

                    {exp.employmentType && (
                      <p className="text-[12px]">
                        {exp.employmentType}
                      </p>
                    )}
                  </div>

                  <span className="whitespace-nowrap text-sm">
                    {exp.startDate}
                    {exp.startDate &&
                      exp.endDate &&
                      " – "}
                    {exp.endDate}
                  </span>
                </div>

                {exp.description && (
                  <div className="mt-2 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No experience added yet.
          </p>
        )}
      </section>

      {/* ================= PROJECTS ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Projects
        </h2>

                {projects.length > 0 ? (
          <div className="mt-3 space-y-5">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold">
                    {project.title || "Project Title"}
                  </h3>
                </div>

                {project.technologies.length > 0 && (
                  <p className="mt-1">
                    <strong>Technologies:</strong>{" "}
                    {project.technologies.join(", ")}
                  </p>
                )}

                {(project.github || project.liveDemo) && (
                  <div className="mt-1 text-[12px]">
                    {project.github && (
                      <p>
                        <strong>GitHub:</strong>{" "}
                        <span className={theme.secondary}>
                          {project.github}
                        </span>
                      </p>
                    )}

                    {project.liveDemo && (
                      <p>
                        <strong>Live:</strong>{" "}
                        <span className={theme.secondary}>
                          {project.liveDemo}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {project.description && (
                  <div className="mt-2 whitespace-pre-line">
                    {project.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No projects added yet.
          </p>
        )}
      </section>

      {/* ================= EDUCATION ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Education
        </h2>

        {education.length > 0 ? (
          <div className="mt-3 space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">
                      {edu.degree}
                      {edu.fieldOfStudy &&
                        ` in ${edu.fieldOfStudy}`}
                    </h3>

                    <p>{edu.college}</p>

                    {edu.cgpa && (
                      <p>CGPA: {edu.cgpa}</p>
                    )}
                  </div>

                  <span className="whitespace-nowrap">
                    {edu.startYear}

                    {edu.startYear &&
                      edu.endYear &&
                      " – "}

                    {edu.endYear}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No education added yet.
          </p>
        )}
      </section>

      {/* ================= CERTIFICATIONS ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Certifications
        </h2>

        {certifications.length > 0 ? (
          <div className="mt-3 space-y-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex justify-between"
              >
                <div>
                  <p className="font-bold">
                    {cert.name}
                  </p>

                  {cert.organization && (
                    <p>{cert.organization}</p>
                  )}
                </div>

                {cert.issueDate && (
                  <span className="whitespace-nowrap">
                    {cert.issueDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No certifications added yet.
          </p>
        )}
      </section>

      {/* ================= ACHIEVEMENTS ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Achievements
        </h2>

                {achievements.length > 0 ? (
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {achievements.map((achievement, index) => (
              <li key={index}>
                <strong>{achievement.title}</strong>

                {achievement.description &&
                  ` — ${achievement.description}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No achievements added yet.
          </p>
        )}
      </section>

      {/* ================= LANGUAGES ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Languages
        </h2>

        {languages.length > 0 ? (
          <p className="mt-2">
            {languages
              .map(
                (language) =>
                  `${language.name}${
                    language.proficiency
                      ? ` (${language.proficiency})`
                      : ""
                  }`
              )
              .join(" • ")}
          </p>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No languages added yet.
          </p>
        )}
      </section>

      {/* ================= INTERESTS ================= */}

      <section className="mt-6">
        <h2
          className={`border-b pb-1 text-sm font-bold uppercase tracking-widest ${theme.border} ${theme.primary}`}
        >
          Interests
        </h2>

        {interests.length > 0 ? (
          <p className="mt-2">
            {interests
              .map((interest) => interest.name)
              .join(" • ")}
          </p>
        ) : (
          <p className="mt-2 italic text-gray-500">
            No interests added yet.
          </p>
        )}
      </section>

    </div>
  );
}