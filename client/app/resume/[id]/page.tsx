"use client";
import { Resume, ResumeSettings, PaperSize } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Undo, Redo, Upload, Download, RefreshCw, ArrowUp, Sparkles } from "lucide-react";
import { useUndoRedo } from "@/utils/useUndoRedo";

import { getResumeById, updateResume } from "@/services/resumeService";
import { parsePdfResume } from "@/services/aiService";

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
  const [importingFile, setImportingFile] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowTopBtn(e.currentTarget.scrollTop > 150);
  };

  const handleActiveSectionChange = (sectionKey: string) => {
    const el = document.getElementById(`preview-section-${sectionKey}`);
    if (el && previewContainerRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

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
  // Import PDF or JSON
  // ==========================
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if uploaded file is PDF
    if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
      setImportingFile(true);
      try {
        const res = await parsePdfResume(file);
        if (res.success && res.resume) {
          const parsed = res.resume;
          const merged: Resume = {
            ...resume,
            title: parsed.title || resume.title || "PDF Resume",
            personalInfo: {
              ...resume.personalInfo,
              ...(parsed.personalInfo || {}),
            },
            education: parsed.education && parsed.education.length > 0 ? parsed.education : resume.education,
            experience: parsed.experience && parsed.experience.length > 0 ? parsed.experience : resume.experience,
            skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : resume.skills,
            projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : resume.projects,
            certifications: parsed.certifications && parsed.certifications.length > 0 ? parsed.certifications : resume.certifications,
            achievements: parsed.achievements && parsed.achievements.length > 0 ? parsed.achievements : resume.achievements,
            languages: parsed.languages && parsed.languages.length > 0 ? parsed.languages : resume.languages,
            interests: parsed.interests && parsed.interests.length > 0 ? parsed.interests : resume.interests,
          };
          setResume(merged);
          setSaved(false);
          setSidebarMode("ai"); // Switch directly to AI Suite so ATS score is shown immediately!
          alert("🎉 PDF Resume parsed successfully! Your ATS Score and detailed recommendations are now visible in the AI Suite.");
        } else {
          alert("Failed to parse PDF resume.");
        }
      } catch (err: any) {
        console.error("PDF Parsing error:", err);
        alert(err.response?.data?.message || "Failed to parse PDF resume. Please make sure the PDF contains readable text.");
      } finally {
        setImportingFile(false);
        if (e.target) e.target.value = "";
      }
      return;
    }

    // JSON import fallback
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
          alert("Invalid file format. Please upload a valid .pdf or .json resume file.");
        }
      } catch (err) {
        console.error("Failed to parse JSON file:", err);
        alert("Failed to parse JSON file.");
      } finally {
        if (e.target) e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // ==========================
  // Download 1-Page PDF Resume
  // ==========================
  const downloadPDF = async () => {
    const el = document.getElementById("print-area");
    if (!el) {
      window.print();
      return;
    }

    try {
      setDownloadingPDF(true);

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Render high resolution canvas (2x scale for sharp text)
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      // Determine dimensions based on selected paper size (A4 vs US Letter)
      const paperSize = resume.settings?.paperSize || "a4";
      let pdfWidth = 210; // mm (A4)
      let pdfHeight = 297; // mm (A4)

      if (paperSize === "letter") {
        pdfWidth = 215.9; // mm (US Letter)
        pdfHeight = 279.4; // mm (US Letter)
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      // Fit image onto 1 page (0 margin, 100% single page)
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.title || "Resume"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed, falling back to window.print():", err);
      window.print();
    } finally {
      setDownloadingPDF(false);
    }
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
  <div className="flex h-screen overflow-hidden print:h-auto print:overflow-visible print:block">
    {/* LEFT PANEL: Independent Scrollable Editor */}
    <div className="w-1/2 shrink-0 h-full overflow-y-auto border-r bg-white p-6 z-10 print:hidden shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            disabled={downloadingPDF}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 font-medium text-sm flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {downloadingPDF ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <select
            value={resume.settings?.paperSize || "a4"}
            onChange={(e) => {
              handleSettingsChange({
                ...(resume.settings || {
                  fontFamily: "Inter",
                  fontSize: "md",
                  lineHeight: "normal",
                  margin: "normal",
                  accentColor: "",
                  showPageNumbers: true,
                }),
                paperSize: e.target.value as PaperSize,
              });
            }}
            title="Paper Sheet Size Format"
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="a4">📄 A4 Standard (India & Europe)</option>
            <option value="letter">📄 US Letter (USA & Canada)</option>
          </select>

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
            onChange={handleImportFile}
            accept=".json,.pdf,application/json,application/pdf"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importingFile}
            title="Import PDF or JSON Resume"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 font-medium text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {importingFile ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span className="hidden xl:inline text-blue-600 font-semibold">Parsing PDF...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 text-blue-600" />
                <span className="hidden xl:inline">Import (PDF/JSON)</span>
              </>
            )}
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
            onActiveSectionChange={handleActiveSectionChange}
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
          onNavigateToSection={(sectionKey) => {
            setSidebarMode("edit");
            setTimeout(() => {
              handleActiveSectionChange(sectionKey);
            }, 100);
          }}
        />
      )}
    </div>

    {/* RIGHT PANEL: Independent Scrollable Live Preview with Auto-Sync */}
    <div
      ref={previewContainerRef}
      onScroll={handlePreviewScroll}
      className="flex-1 h-full overflow-y-auto bg-gray-200 p-8 print:h-auto print:overflow-visible print:bg-white relative scroll-smooth"
    >
      {showTopBtn && (
        <button
          onClick={() => {
            if (previewContainerRef.current) {
              previewContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          title="Scroll Preview to Top"
          className="sticky top-2 left-2 z-30 px-3.5 py-1.5 bg-white/95 backdrop-blur-md border border-gray-300 text-gray-800 rounded-full text-xs font-bold shadow-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center gap-1.5 cursor-pointer print:hidden animate-in fade-in duration-200"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          <span>Top of Preview</span>
        </button>
      )}

      <div
        ref={previewRef}
        id="print-area"
        className="mx-auto w-fit pb-12"
      >
        <ResumePreview resume={resume} />
      </div>
    </div>
  </div>
);
}