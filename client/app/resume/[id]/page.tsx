"use client";
import { Resume, ResumeSettings } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Undo, Redo, Upload, Download } from "lucide-react";
import { useUndoRedo } from "@/utils/useUndoRedo";

import { getResumeById, updateResume } from "@/services/resumeService";

import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TemplateSelector from "@/components/resume/TemplateSelector";
import AiSuite from "@/components/resume/AiSuite";


export default function ResumeBuilder() {
  const params = useParams();
  const id = params.id as string;

  const {
    state: resume,
    setState: setResume,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetResume,
  } = useUndoRedo<Resume>({
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
  const [sidebarMode, setSidebarMode] = useState<"edit" | "ai">("edit");
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================
  // Export JSON
  // ==========================
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resume.title || "resume"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ==========================
  // Import JSON
  // ==========================
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && typeof json === "object") {
          const merged: Resume = {
            ...resume,
            ...json,
            _id: resume._id,
            personalInfo: {
              ...resume.personalInfo,
              ...(json.personalInfo || {}),
            },
            education: json.education || [],
            experience: json.experience || [],
            skills: json.skills || [],
            projects: json.projects || [],
            certifications: json.certifications || [],
            achievements: json.achievements || [],
            languages: json.languages || [],
            interests: json.interests || [],
            settings: json.settings || resume.settings,
            customTitles: json.customTitles || resume.customTitles,
            hiddenSections: json.hiddenSections || resume.hiddenSections,
          };
          setResume(merged);
          setSaved(false);
          alert("Resume data imported successfully!");
        } else {
          alert("Invalid file format. Make sure it is a valid JSON file.");
        }
      } catch (err) {
        console.error("Failed to parse JSON file:", err);
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // ==========================
  // Download / Print Resume
  // ==========================
  const downloadPDF = () => {
    document.title = resume.title || "Resume";
    window.print();
  };

useEffect(() => {
    const fetchResume = async () => {
      try {
        if (!id) return;

        const response = await getResumeById(id);

        if (response?.resume) {
          const fetched = response.resume;
          const merged: Resume = {
            title: fetched.title || "Untitled Resume",
            template: fetched.template || "modern",
            themeColor: fetched.themeColor || "blue",
            sectionOrder: fetched.sectionOrder || [
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
              fullName: fetched.personalInfo?.fullName || "",
              headline: fetched.personalInfo?.headline || "",
              photo: fetched.personalInfo?.photo || "",
              email: fetched.personalInfo?.email || "",
              phone: fetched.personalInfo?.phone || "",
              address: fetched.personalInfo?.address || "",
              linkedin: fetched.personalInfo?.linkedin || "",
              github: fetched.personalInfo?.github || "",
              portfolio: fetched.personalInfo?.portfolio || "",
              summary: fetched.personalInfo?.summary || "",
            },
            education: fetched.education || [],
            experience: fetched.experience || [],
            skills: fetched.skills || [],
            projects: fetched.projects || [],
            certifications: fetched.certifications || [],
            achievements: fetched.achievements || [],
            languages: fetched.languages || [],
            interests: fetched.interests || [],
            settings: fetched.settings || {
              fontFamily: "Inter",
              fontSize: "md",
              lineHeight: "normal",
              margin: "normal",
              accentColor: "",
              showPageNumbers: true,
            },
            customTitles: fetched.customTitles || {},
            hiddenSections: fetched.hiddenSections || [],
          };
          resetResume(merged);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, resetResume]);

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

  const isProTemplate = ["executive", "tech", "academic", "sleek"].includes(template);
  const isProUser = typeof window !== "undefined" && localStorage.getItem("pro_member") === "true";

  if (isProTemplate && !isProUser) {
    alert("This is a Premium Pro Template! Please go to your Dashboard and upgrade to Pro to unlock it.");
    return;
  }

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
// Hidden Sections
// ==========================
const handleHiddenSectionsChange = (
  hiddenSections: string[]
) => {
  setResume((prev) => ({
    ...prev,
    hiddenSections,
  }));

  setSaved(false);
};

// ==========================
// Custom Section Titles
// ==========================
const handleCustomTitlesChange = (
  customTitles: Record<string, string>
) => {
  setResume((prev) => ({
    ...prev,
    customTitles,
  }));

  setSaved(false);
};

// ==========================
// Layout Settings
// ==========================
const handleSettingsChange = (
  settings: ResumeSettings
) => {
  setResume((prev) => ({
    ...prev,
    settings,
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

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (isMod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading Resume...
      </div>
    );
  }

 return (
  <div className="flex min-h-screen print:block">
    {/* LEFT PANEL */}
    <div className="w-1/2 shrink-0 overflow-y-auto border-r bg-white p-6 z-10 print:hidden">
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 font-medium text-sm flex items-center gap-1 shadow-sm"
          >
            Download PDF
          </button>

          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <Undo className="h-4 w-4" />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <Redo className="h-4 w-4" />
          </button>

          <span className="w-px h-6 bg-gray-200 my-auto mx-1" />

          <input
            type="file"
            ref={fileInputRef}
            onChange={importJSON}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 font-medium text-sm flex items-center gap-1.5"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden xl:inline">Import</span>
          </button>

          <button
            onClick={exportJSON}
            title="Export JSON"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 font-medium text-sm flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xl:inline">Export</span>
          </button>
        </div>

        <div className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          {saving ? "Saving..." : saved ? "Saved" : "Not Saved"}
        </div>
      </div>

      <div className="mb-6 flex rounded-xl bg-gray-100 p-1 border border-gray-200">
        <button
          onClick={() => setSidebarMode("edit")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition cursor-pointer ${
            sidebarMode === "edit"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Edit Content & Template
        </button>
        <button
          onClick={() => setSidebarMode("ai")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition cursor-pointer ${
            sidebarMode === "ai"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          ATS Audit & AI Copilot
        </button>
      </div>

      {sidebarMode === "edit" ? (
        <>
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
            onHiddenSectionsChange={handleHiddenSectionsChange}
            onCustomTitlesChange={handleCustomTitlesChange}
            onSettingsChange={handleSettingsChange}
          />
        </>
      ) : (
        <AiSuite
          resume={resume}
          onUpdateResume={(partial) => {
            setResume((prev) => ({
              ...prev,
              ...partial,
            }));
            setSaved(false);
          }}
        />
      )}
    </div>

    {/* RIGHT PANEL */}
<div className="flex-1 overflow-auto bg-gray-200 print:block print:bg-white">
  <div
    ref={previewRef}
    id="print-area"
    className="mx-auto w-fit py-8"
  >
    <ResumePreview resume={resume} />
  </div>
</div>
    </div>
);
}