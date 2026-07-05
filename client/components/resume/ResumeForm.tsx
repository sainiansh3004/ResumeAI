"use client";

import PersonalInfo from "./forms/PersonalInfo";
import Education from "./forms/Education";
import Experience from "./forms/Experience";
import Skills from "./forms/Skills";
import Projects from "./forms/Projects";
import Certifications from "./forms/Certifications";
import Achievements from "./forms/Achievements";
import Languages from "./forms/Languages";
import Interests from "./forms/Interests";


import {
  Resume,
  PersonalInfo as PersonalInfoType,
  Education as EducationType,
  Experience as ExperienceType,
  Project,
  Certification,
  Achievement,
  Language,
  Interest,
} from "@/types/resume";

interface ResumeFormProps {
  resume: Resume;

  onPersonalInfoChange: (data: PersonalInfoType) => void;

  onEducationChange: (
    education: EducationType[]
  ) => void;

  onExperienceChange: (
    experience: ExperienceType[]
  ) => void;

  onSkillsChange: (skills: string[]) => void;

  onProjectsChange: (
    projects: Project[]
  ) => void;

  onCertificationsChange: (
    certifications: Certification[]
  ) => void;

  onAchievementsChange: (
    achievements: Achievement[]
  ) => void;

  onLanguagesChange: (
    languages: Language[]
  ) => void;

  onInterestsChange: (
  interests: Interest[]
) => void;

sectionOrder: Resume["sectionOrder"];

onSectionOrderChange: (
  sectionOrder: Resume["sectionOrder"]
) => void;
}

export default function ResumeForm({
  resume,
  onPersonalInfoChange,
  onEducationChange,
  onExperienceChange,
  onSkillsChange,
  onProjectsChange,
  onCertificationsChange,
  onAchievementsChange,
  onLanguagesChange,
  onInterestsChange,
  sectionOrder,
  onSectionOrderChange,
}: ResumeFormProps) {
  return (
    <>
      

      {/* ==========================
          Resume Sections
      ========================== */}

      <PersonalInfo
        resume={resume}
        data={resume.personalInfo}
        onChange={onPersonalInfoChange}
      />

      <Education
        education={resume.education}
        onChange={onEducationChange}
      />

      <Experience
        experience={resume.experience}
        onChange={onExperienceChange}
      />

      <Skills
        skills={resume.skills}
        onChange={onSkillsChange}
      />

      <Projects
        projects={resume.projects}
        onChange={onProjectsChange}
      />

      <Certifications
        certifications={resume.certifications}
        onChange={onCertificationsChange}
      />

      <Achievements
        achievements={resume.achievements ?? []}
        onChange={onAchievementsChange}
      />

      <Languages
        languages={resume.languages ?? []}
        onChange={onLanguagesChange}
      />

      <Interests
        interests={resume.interests ?? []}
        onChange={onInterestsChange}
      />
    </>
  );
}