"use client";
import { Resume, ResumeSettings, PaperSize } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Undo, Redo, Upload, Download, RefreshCw, ArrowUp, Sparkles, X, FileText } from "lucide-react";
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

    template: "offcampus",

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
          setSaved(true);
          try {
            await updateResume(id as string, merged);
          } catch (saveErr) {
            console.error("Auto-save after PDF import error:", saveErr);
          }
          setSidebarMode("ai"); // Switch directly to AI Suite so ATS score is shown immediately!
          alert("🎉 PDF Resume parsed & saved successfully! Your ATS Score and detailed recommendations are now visible in the AI Suite.");
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
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState<number>(1);

  useEffect(() => {
    if (!showPDFPreview) return;
    const calculatePages = () => {
      const el = document.getElementById("resume-card");
      if (el) {
        const isSingle = resume.settings?.fitToOnePage === true;
        if (isSingle) {
          setPdfPageCount(1);
        } else {
          const paperSize = resume.settings?.paperSize || "a4";
          const pageHeight = paperSize === "letter" ? 1056 : 1123;
          const totalHeight = el.scrollHeight;
          const count = Math.max(1, Math.ceil(totalHeight / pageHeight));
          setPdfPageCount(count);
        }
      }
    };
    const timer = setTimeout(calculatePages, 120);
    return () => clearTimeout(timer);
  }, [showPDFPreview, resume]);

  // ==========================
  // Download 1-Page PDF Resume
  // ==========================
  const downloadPDF = async () => {
    const el = document.getElementById("resume-card") || document.getElementById("print-area");
    if (!el) {
      window.print();
      return;
    }

    try {
      setDownloadingPDF(true);

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const toRgbColor = (colorStr: string): string => {
        if (!colorStr || !colorStr.includes("oklch")) return colorStr;
        try {
          const cvs = document.createElement("canvas");
          cvs.width = 1;
          cvs.height = 1;
          const ctx = cvs.getContext("2d");
          if (ctx) {
            ctx.fillStyle = colorStr;
            return ctx.fillStyle;
          }
        } catch (e) {}
        return "#000000";
      };

      // Render high resolution canvas (2x scale for sharp text)
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          try {
            // 1. Hide red line badges and styling from any existing spacers in cloned DOM
            const hideMarkerStyle = clonedDoc.createElement("style");
            hideMarkerStyle.textContent = `
              .pdf-page-break-spacer {
                border: none !important;
                margin: 0 !important;
                background: #ffffff !important;
              }
              .pdf-page-break-spacer::after {
                display: none !important;
                content: "" !important;
              }
            `;
            clonedDoc.head.appendChild(hideMarkerStyle);

            // 2. Strip oklch references from cloned style sheets
            const styleNodes = clonedDoc.querySelectorAll("style");
            styleNodes.forEach((s) => {
              if (s.textContent && s.textContent.includes("oklch")) {
                s.textContent = s.textContent.replace(/oklch\([^)]+\)/g, "#111827");
              }
            });

            const elements = clonedDoc.querySelectorAll<HTMLElement>("*");
            elements.forEach((node) => {
              try {
                const style = window.getComputedStyle(node);
                const color = style.color;
                const bg = style.backgroundColor;
                const border = style.borderColor;

                if (color && color.includes("oklch")) {
                  node.style.color = toRgbColor(color);
                }
                if (bg && bg.includes("oklch")) {
                  node.style.backgroundColor = toRgbColor(bg);
                }
                if (border && border.includes("oklch")) {
                  node.style.borderColor = toRgbColor(border);
                }
              } catch (e) {}
            });

            // 3. SMART PAGE BREAK PROTECTION: Calculate exact white page spacers for cloned DOM
            const container = clonedDoc.getElementById("resume-card");
            if (container && !resume.settings?.fitToOnePage) {
              const paperSize = resume.settings?.paperSize || "a4";
              const pageHeightPx = paperSize === "letter" ? 1056 : 1123;
              const breakables = container.querySelectorAll<HTMLElement>(
                ".break-inside-avoid, .experience-item, .project-item, .education-item, .certification-item, .achievement-item"
              );

              const containerRect = container.getBoundingClientRect();
              let currentCutoff = pageHeightPx;

              breakables.forEach((node) => {
                const rect = node.getBoundingClientRect();
                const nodeTop = rect.top - containerRect.top;
                const nodeBottom = nodeTop + rect.height;

                // If element starts before page cutoff but extends beyond it, insert clean white spacer to push to next page
                if (nodeTop < currentCutoff && nodeBottom > currentCutoff - 10) {
                  const spacerHeight = Math.max(0, Math.ceil(currentCutoff - nodeTop));
                  if (spacerHeight > 0 && node.parentNode) {
                    const spacer = clonedDoc.createElement("div");
                    spacer.className = "pdf-page-break-spacer";
                    spacer.style.height = `${spacerHeight}px`;
                    spacer.style.width = "100%";
                    spacer.style.display = "block";
                    spacer.style.clear = "both";
                    spacer.style.backgroundColor = "#ffffff";
                    spacer.style.border = "none";
                    node.parentNode.insertBefore(spacer, node);
                    currentCutoff += pageHeightPx + spacerHeight;
                  }
                }
              });
            }
          } catch (e) {}
        },
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

      const fitToOnePage = resume.settings?.fitToOnePage === true;
      const imgHeightInMm = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      if (fitToOnePage || imgHeightInMm <= pdfHeight) {
        // Fit image onto 1 page
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      } else {
        // Page-by-Page Canvas Cropping Engine: Crops exact A4 pages to eliminate text slicing
        const pageCanvasHeight = Math.floor((canvas.width * pdfHeight) / pdfWidth);
        const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage([pdfWidth, pdfHeight]);
          }

          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageCanvasHeight;
          const pageCtx = pageCanvas.getContext("2d");

          if (pageCtx) {
            pageCtx.fillStyle = "#ffffff";
            pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvasHeight);

            const srcY = i * pageCanvasHeight;
            const srcH = Math.min(pageCanvasHeight, canvas.height - srcY);

            pageCtx.drawImage(
              canvas,
              0,
              srcY,
              canvas.width,
              srcH,
              0,
              0,
              canvas.width,
              srcH
            );

            const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.98);
            pdf.addImage(pageImgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
          }
        }
      }

      // Embed interactive PDF hyperlink annotations for all project & profile links
      try {
        const { formatUrl } = await import("@/utils/formatUrl");
        const containerRect = el.getBoundingClientRect();
        const totalPdfHeightMm = (canvas.height * pdfWidth) / canvas.width;
        const links = el.querySelectorAll<HTMLAnchorElement>("a[href]");

        links.forEach((a) => {
          const rawHref = a.getAttribute("href") || a.href;
          if (!rawHref || rawHref === "#" || rawHref.startsWith("javascript:")) return;

          const url = formatUrl(rawHref);
          if (!url) return;

          const rect = a.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          // X, Y, W, H relative to container in mm
          const x = ((rect.left - containerRect.left) / containerRect.width) * pdfWidth;
          const y = ((rect.top - containerRect.top) / containerRect.height) * totalPdfHeightMm;
          const w = (rect.width / containerRect.width) * pdfWidth;
          const h = (rect.height / containerRect.height) * totalPdfHeightMm;

          if (fitToOnePage || totalPdfHeightMm <= pdfHeight) {
            pdf.setPage(1);
            pdf.link(x, y, w, h, { url });
          } else {
            const pageIndex = Math.floor(y / pdfHeight);
            const pageY = y % pdfHeight;
            const targetPage = pageIndex + 1;
            const totalPagesCount = (pdf as any).internal?.getNumberOfPages
              ? (pdf as any).internal.getNumberOfPages()
              : 1;

            if (targetPage <= totalPagesCount) {
              pdf.setPage(targetPage);
              pdf.link(x, pageY, w, h, { url });
            }
          }
        });
      } catch (linkErr) {
        console.error("Error embedding links into PDF:", linkErr);
      }

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
            template: fetched.template || "offcampus",
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
  // Auto Save & Manual Save
  // ==========================
  const resumeRef = useRef(resume);
  useEffect(() => {
    resumeRef.current = resume;
  }, [resume]);

  const handleManualSave = async () => {
    if (!id || saving) return;
    try {
      setSaving(true);
      await updateResume(id, resumeRef.current);
      setSaving(false);
      setSaved(true);
    } catch (err: any) {
      console.error("Failed to save resume:", err);
      setSaving(false);
      setSaved(false);
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert(`Save failed: ${msg}`);
    }
  };

  useEffect(() => {
    if (loading || saved || !id) return;

    const currentToSave = resume;
    const timer = setTimeout(async () => {
      try {
        setSaving(true);
        await updateResume(id, currentToSave);
        setSaving(false);

        if (resumeRef.current === currentToSave) {
          setSaved(true);
        }
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
  <div className="flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible print:block bg-gray-50">
    {/* FULL-WIDTH TOP NAVIGATION BAR (100% Width — Zero Overflow) */}
    <header className="h-14 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-20 print:hidden shadow-xs">
      {/* Left Group: Title & Core Controls */}
      <div className="flex items-center gap-3">
        {/* Editable Resume Title */}
        <input
          type="text"
          value={resume.title || "Untitled Resume"}
          onChange={(e) => {
            setResume({ ...resume, title: e.target.value });
            setSaved(false);
          }}
          placeholder="Resume Title"
          className="text-sm font-extrabold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 max-w-[180px] truncate"
          title="Click to edit resume title"
        />

        <span className="w-px h-5 bg-gray-200" />

        {/* Primary Download PDF Button */}
        <button
          onClick={() => setShowPDFPreview(true)}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-white transition hover:bg-blue-700 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </button>

        {/* Quick Template Switcher */}
        <select
          value={resume.template}
          onChange={(e) => handleTemplateChange(e.target.value as any)}
          title="Change Resume Template Layout"
          className="rounded-lg border border-blue-200 bg-blue-50/70 px-2.5 py-1.5 text-xs font-bold text-blue-900 shadow-xs transition hover:bg-blue-100 focus:border-blue-500 focus:outline-none cursor-pointer"
        >
          <option value="offcampus">🎨 Off-Campus FAANG ATS</option>
          <option value="modern">🎨 Modern Design</option>
          <option value="minimal">🎨 Minimalist Classic</option>
          <option value="ats">🎨 Standard Corporate ATS</option>
          <option value="creative">🎨 Creative Design</option>
          <option value="executive">👑 Executive Pro</option>
          <option value="tech">👑 Developer Tech Pro</option>
          <option value="academic">👑 Academic CV Pro</option>
          <option value="sleek">👑 Sleek Modern Pro</option>
        </select>

        {/* Page Flow Mode */}
        <select
          value={resume.settings?.fitToOnePage === true ? "single" : "multi"}
          onChange={(e) => {
            const isSingle = e.target.value === "single";
            handleSettingsChange({
              ...(resume.settings || {
                fontFamily: "Inter",
                fontSize: "md",
                lineHeight: "normal",
                margin: "normal",
                accentColor: "",
                showPageNumbers: true,
              }),
              fitToOnePage: isSingle,
            });
          }}
          title="Page Flow Layout Mode"
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 focus:border-blue-500 focus:outline-none cursor-pointer"
        >
          <option value="multi">📑 Multi-Page Flow (2+ Pages)</option>
          <option value="single">📄 Single-Page Strict (Auto-Fit)</option>
        </select>

        {/* Paper Format */}
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
          title="Paper Sheet Format"
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 focus:border-blue-500 focus:outline-none cursor-pointer"
        >
          <option value="a4">📄 A4 (210×297mm)</option>
          <option value="letter">📄 US Letter (8.5×11in)</option>
        </select>
      </div>

      {/* Right Group: Tools & Auto-Save */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <span className="w-px h-4 bg-gray-200" />
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Import File */}
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
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          {importingFile ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
          ) : (
            <Upload className="h-3.5 w-3.5 text-blue-600" />
          )}
          <span>Import</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={exportJSON}
          title="Export Resume JSON Backup"
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-gray-600" />
          <span>Export</span>
        </button>

        {/* Save Status Badge */}
        <div className="ml-1">
          {saving ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </span>
          ) : saved ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <span>✓ Saved</span>
            </span>
          ) : (
            <button
              onClick={handleManualSave}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
            >
              <span>Save Now</span>
            </button>
          )}
        </div>
      </div>
    </header>

    {/* WORKSPACE AREA (2 Column Split) */}
    <div className="flex-1 flex overflow-hidden">
      {/* LEFT PANEL: Independent Scrollable Editor */}
      <div className="w-1/2 shrink-0 h-full overflow-y-auto border-r bg-white p-6 z-10 print:hidden shadow-sm">

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

    {/* PDF PREVIEW & EXPORT MODAL */}
    {showPDFPreview && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto print:hidden">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">PDF Preview & Export</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm ${
                    pdfPageCount === 1 ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-blue-100 text-blue-800 border border-blue-300"
                  }`}>
                    📄 {pdfPageCount} {pdfPageCount === 1 ? "Page PDF" : "Pages PDF"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Review your multi-page document layout before downloading</p>
              </div>
            </div>

            {/* Controls inside modal header */}
            <div className="flex items-center gap-3">
              <select
                value={resume.settings?.fitToOnePage === true ? "single" : "multi"}
                onChange={(e) => {
                  const isSingle = e.target.value === "single";
                  handleSettingsChange({
                    ...(resume.settings || {
                      fontFamily: "Inter",
                      fontSize: "md",
                      lineHeight: "normal",
                      margin: "normal",
                      accentColor: "",
                      showPageNumbers: true,
                    }),
                    fitToOnePage: isSingle,
                  });
                }}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm focus:outline-none cursor-pointer"
              >
                <option value="multi">📑 Multi-Page Flow (2+ Pages)</option>
                <option value="single">📄 Single-Page Strict (Auto-Fit)</option>
              </select>

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
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm focus:outline-none cursor-pointer"
              >
                <option value="a4">📄 A4 (210×297mm)</option>
                <option value="letter">📄 US Letter (8.5×11in)</option>
              </select>

              <button
                onClick={() => setShowPDFPreview(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Interactive Scrollable Resume Preview with Page Cutoff Indicators */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-200/90 flex flex-col items-center min-h-[500px] max-h-[75vh]">
            {/* Sticky Summary Breakdown Banner */}
            <div className="sticky top-0 z-30 mb-4 px-5 py-2.5 bg-white/95 backdrop-blur-md border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 flex items-center justify-between w-full max-w-2xl shadow-md">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Total Output: <strong className="text-blue-900 font-black text-sm">{pdfPageCount} {pdfPageCount === 1 ? "Page Total" : "Pages Total"}</strong> ({resume.settings?.paperSize === "letter" ? "US Letter 8.5×11 in" : "A4 Standard 210×297 mm"})</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold">
                {resume.settings?.fitToOnePage ? "⚡ Single Page Condensed" : "📑 Natural Multi-Page Flow"}
              </span>
            </div>

            {/* Scrollable Full Resume Paper Cards with Page Break Visualizers */}
            <div className="relative shadow-2xl bg-white border border-gray-300 rounded-sm my-2 transition-all" style={{ zoom: 0.82 }}>
              <ResumePreview resume={resume} />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span>Total Output: <strong className="text-blue-700 font-bold">{pdfPageCount} {pdfPageCount === 1 ? "Page PDF" : "Pages PDF"}</strong></span>
              <span>•</span>
              <span>Format: <strong className="text-gray-800 uppercase">{resume.settings?.paperSize || "A4"}</strong></span>
              <span>•</span>
              <span>Layout: <strong className="text-gray-800">{resume.settings?.fitToOnePage ? "Single Page Strict" : "Multi-Page Auto Flow"}</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPDFPreview(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await downloadPDF();
                  setShowPDFPreview(false);
                }}
                disabled={downloadingPDF}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {downloadingPDF ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Generating {pdfPageCount}-Page PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download {pdfPageCount}-Page PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}