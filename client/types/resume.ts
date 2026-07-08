// ==========================
// Section Order
// ==========================

export type SectionType =
  | "summary"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "certifications"
  | "achievements"
  | "languages"
  | "interests";

// ==========================
// Personal Information
// ==========================

export interface PersonalInfo {
  fullName: string;
  headline: string;

  // Profile Photo (Base64)
  photo: string;

  email: string;
  phone: string;
  address: string;

  linkedin: string;
  github: string;
  portfolio: string;

  summary: string;
}

// ==========================
// Education
// ==========================

export interface Education {
  college: string;
  degree: string;
  fieldOfStudy: string;

  startYear: string;
  endYear: string;

  cgpa: string;
}

// ==========================
// Experience
// ==========================

export interface Experience {
  company: string;
  position: string;

  location: string;
  employmentType: string;

  startDate: string;
  endDate: string;

  currentlyWorking?: boolean;

  description: string;
}

// ==========================
// Project
// ==========================

export interface Project {
  title: string;

  description: string;

  technologies: string[];

  github: string;

  liveDemo: string;
}

// ==========================
// Certification
// ==========================

export interface Certification {
  name: string;
  organization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
}

// ==========================
// Achievement
// ==========================

export interface Achievement {
  title: string;
  description: string;
}

// ==========================
// Language
// ==========================

export interface Language {
  name: string;
  proficiency: string;
}

// ==========================
// Interest
// ==========================

export interface Interest {
  name: string;
}

// ==========================
// Resume Settings
// ==========================

export interface ResumeSettings {
  fontFamily: string;
  fontSize: "sm" | "md" | "lg";
  lineHeight: "snug" | "normal" | "relaxed";
  margin: "compact" | "normal" | "spacious";
  accentColor: string; // custom hex color or predefined key
  showPageNumbers: boolean;
}

// ==========================
// Resume
// ==========================

export interface Resume {
  _id?: string;

  title: string;

  template: "modern" | "minimal" | "ats" | "creative" | "executive" | "tech" | "academic" | "sleek";

  themeColor: "blue" | "purple" | "green" | "black" | "red";

  // Controls preview order
  sectionOrder: SectionType[];

  personalInfo: PersonalInfo;

  education: Education[];

  experience: Experience[];

  skills: string[];

  projects: Project[];

  certifications: Certification[];

  achievements: Achievement[];

  languages: Language[];

  interests: Interest[];

  // Customizations
  settings?: ResumeSettings;
  customTitles?: Record<string, string>;
  hiddenSections?: string[];

  createdAt?: string;
  updatedAt?: string;
}