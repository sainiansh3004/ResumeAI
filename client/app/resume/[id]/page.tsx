"use client";
import { Resume } from "@/types/resume";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";


import { getResumeById, updateResume } from "@/services/resumeService";

import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TemplateSelector from "@/components/resume/TemplateSelector";


export default function ResumeBuilder() {
  const params = useParams();
  const id = params.id as string;

  const [resume, setResume] = useState<Resume>({
  title: "",

  template: "modern",

 themeColor: "blue",

sectionOrder: [
  "summary",
  "education",
  "experience",
  "skills",
  "projects",
  "certifications",
  "achievements",
  "languages",
  "interests",
],

personalInfo: {
    fullName: "",
    headline: "",
    photo: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
  },

  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  interests: [],
});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);

  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: resume.title || "Resume",
  });

  // ==========================
  // Load Resume
  // ==========================
  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (!id) return;

        const response = await getResumeById(id);

        if (response?.resume) {
          setResume((prev) => ({
            ...prev,
            ...response.resume,

            personalInfo: {
              ...prev.personalInfo,
              ...(response.resume.personalInfo || {}),
            },

            education: response.resume.education || [],
            experience: response.resume.experience || [],
            skills: response.resume.skills || [],
            projects: response.resume.projects || [],
            certifications: response.resume.certifications || [],
            achievements: response.resume.achievements || [],
            languages: response.resume.languages || [],
            interests: response.resume.interests || [],
            template: response.resume.template || "modern",
themeColor: response.resume.themeColor || "blue",

sectionOrder:
  response.resume.sectionOrder || [
    "summary",
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
    "achievements",
    "languages",
    "interests",
  ],


          }));
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  // ==========================
  // Personal Info
  // ==========================
  const handlePersonalInfoChange = (data: Resume["personalInfo"]) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: data,
    }));

    setSaved(false);
  };

  // ==========================
  // Education
  // ==========================
  const handleEducationChange = (education: Resume["education"]) => {
    setResume((prev) => ({
      ...prev,
      education,
    }));

    setSaved(false);
  };

  // ==========================
  // Experience
  // ==========================
  const handleExperienceChange = (experience: Resume["experience"]) => {
    setResume((prev) => ({
      ...prev,
      experience,
    }));

    setSaved(false);
  };

  // ==========================
  // Skills
  // ==========================
  const handleSkillsChange = (skills: Resume["skills"]) => {
    setResume((prev) => ({
      ...prev,
      skills,
    }));

    setSaved(false);
  };

  // ==========================
  // Projects
  // ==========================
  const handleProjectsChange = (projects: Resume["projects"]) => {
    setResume((prev) => ({
      ...prev,
      projects,
    }));

    setSaved(false);
  };

  // ==========================
  // Certifications
  // ==========================
  const handleCertificationsChange = (
    certifications: Resume["certifications"]
  ) => {
    setResume((prev) => ({
      ...prev,
      certifications,
    }));

    setSaved(false);
  };

  // ==========================
  // Achievements
  // ==========================
  const handleAchievementsChange = (
    achievements: Resume["achievements"]
  ) => {
    setResume((prev) => ({
      ...prev,
      achievements,
    }));

    setSaved(false);
  };
// ==========================
// Languages
// ==========================
const handleLanguagesChange = (
  languages: Resume["languages"]
) => {
  setResume((prev) => ({
    ...prev,
    languages,
  }));

  setSaved(false);
};

// ==========================
// Interests
// ==========================
const handleInterestsChange = (
  interests: Resume["interests"]
) => {
  setResume((prev) => ({
    ...prev,
    interests,
  }));

  setSaved(false);
};

// ==========================
// Template
// ==========================
const handleTemplateChange = async (template: Resume["template"]) => {
  console.log("Clicked Template:", template);

  const updatedResume = {
    ...resume,
    template,
  };

  setResume(updatedResume);
  setSaved(false);

  await updateResume(id, updatedResume);
};

// ==========================
// Theme Color
// ==========================
const handleThemeColorChange = (
  themeColor: Resume["themeColor"]
) => {
  setResume((prev) => ({
    ...prev,
    themeColor,
  }));

  setSaved(false);
};

// ==========================
// Section Order
// ==========================
const handleSectionOrderChange = (
  sectionOrder: Resume["sectionOrder"]
) => {
  setResume((prev) => ({
    ...prev,
    sectionOrder,
  }));

  setSaved(false);
};


  // ==========================
  // Auto Save
  // ==========================
  useEffect(() => {
    if (loading || saved || !id) return;

    const timer = setTimeout(async () => {
      try {
        setSaving(true);

        await updateResume(id, resume);

        setSaving(false);
        setSaved(true);
      } catch (err) {
        console.error("Failed to save resume:", err);
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [resume, saved, loading, id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading Resume...
      </div>
    );
  }

 return (
  <div className="flex h-screen">
    {/* LEFT PANEL */}
    <div className="w-1/2 overflow-y-auto border-r p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handlePrint}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Print / Save PDF
        </button>

        <div className="text-sm text-gray-500">
          {saving ? "Saving..." : saved ? "Saved" : "Not Saved"}
        </div>
      </div>

      <TemplateSelector
  selectedTemplate={resume.template}
  selectedTheme={resume.themeColor}
  onTemplateChange={handleTemplateChange}
  onThemeChange={handleThemeColorChange}
/>


<ResumeForm
  resume={resume}
  onPersonalInfoChange={handlePersonalInfoChange}
  onEducationChange={handleEducationChange}
  onExperienceChange={handleExperienceChange}
  onSkillsChange={handleSkillsChange}
  onProjectsChange={handleProjectsChange}
  onCertificationsChange={handleCertificationsChange}
  onAchievementsChange={handleAchievementsChange}
  onLanguagesChange={handleLanguagesChange}
  onInterestsChange={handleInterestsChange}
  sectionOrder={resume.sectionOrder}
  onSectionOrderChange={handleSectionOrderChange}
/>
    </div>

    {/* RIGHT PANEL */}
    <div
      ref={previewRef}
      className="flex-1 overflow-y-auto bg-gray-100 p-8"
    >
      <ResumePreview resume={resume} />
    </div>
    </div>
);
}