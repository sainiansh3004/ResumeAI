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
import SectionOrderEditor from "./SectionOrderEditor";
import LayoutStyleEditor from "./LayoutStyleEditor";

import {
  Resume,
  ResumeSettings,
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

  onHiddenSectionsChange: (hiddenSections: string[]) => void;

  onCustomTitlesChange: (customTitles: Record<string, string>) => void;

  onSettingsChange: (settings: ResumeSettings) => void;

  onActiveSectionChange?: (sectionKey: string) => void;
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
  onHiddenSectionsChange,
  onCustomTitlesChange,
  onSettingsChange,
  onActiveSectionChange,
}: ResumeFormProps) {
  return (
    <>
      <LayoutStyleEditor
        settings={resume.settings || {
          fontFamily: "Inter",
          fontSize: "md",
          lineHeight: "normal",
          margin: "normal",
          accentColor: "",
          showPageNumbers: true,
        }}
        onSettingsChange={onSettingsChange}
      />

      <SectionOrderEditor
        sectionOrder={sectionOrder}
        hiddenSections={resume.hiddenSections || []}
        customTitles={resume.customTitles || {}}
        onSectionOrderChange={onSectionOrderChange}
        onHiddenSectionsChange={onHiddenSectionsChange}
        onCustomTitlesChange={onCustomTitlesChange}
      />

      {/* ==========================
          Resume Sections
      ========================== */}

      <div
        onFocusCapture={() => onActiveSectionChange?.("personalInfo")}
        onClickCapture={() => onActiveSectionChange?.("personalInfo")}
      >
        <PersonalInfo
          resume={resume}
          data={resume.personalInfo}
          onChange={onPersonalInfoChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("education")}
        onClickCapture={() => onActiveSectionChange?.("education")}
      >
        <Education
          education={resume.education ?? []}
          onChange={onEducationChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("experience")}
        onClickCapture={() => onActiveSectionChange?.("experience")}
      >
        <Experience
          experience={resume.experience ?? []}
          onChange={onExperienceChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("skills")}
        onClickCapture={() => onActiveSectionChange?.("skills")}
      >
        <Skills
          skills={resume.skills ?? []}
          onChange={onSkillsChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("projects")}
        onClickCapture={() => onActiveSectionChange?.("projects")}
      >
        <Projects
          projects={resume.projects ?? []}
          onChange={onProjectsChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("certifications")}
        onClickCapture={() => onActiveSectionChange?.("certifications")}
      >
        <Certifications
          certifications={resume.certifications ?? []}
          onChange={onCertificationsChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("achievements")}
        onClickCapture={() => onActiveSectionChange?.("achievements")}
      >
        <Achievements
          achievements={resume.achievements ?? []}
          onChange={onAchievementsChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("languages")}
        onClickCapture={() => onActiveSectionChange?.("languages")}
      >
        <Languages
          languages={resume.languages ?? []}
          onChange={onLanguagesChange}
        />
      </div>

      <div
        onFocusCapture={() => onActiveSectionChange?.("interests")}
        onClickCapture={() => onActiveSectionChange?.("interests")}
      >
        <Interests
          interests={resume.interests ?? []}
          onChange={onInterestsChange}
        />
      </div>
    </>
  );
}