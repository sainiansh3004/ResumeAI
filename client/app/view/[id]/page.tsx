"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Printer, Share2, Sparkles, Check, ArrowLeft, Download, RefreshCw } from "lucide-react";
import { getPublicResumeById } from "@/services/resumeService";
import { Resume } from "@/types/resume";
import ResumePreview from "@/components/resume/ResumePreview";
import { formatUrl } from "@/utils/formatUrl";

export default function PublicResumeViewPage() {
  const params = useParams();
  const id = params.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPublicResume = async () => {
      try {
        setLoading(true);
        const data = await getPublicResumeById(id);
        if (data.success && data.resume) {
          setResume(data.resume);
        } else {
          setError("Resume not found or has been deleted.");
        }
      } catch (err: any) {
        console.error("Public Resume fetch error:", err);
        setError("Failed to load resume. It may be private or non-existent.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicResume();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const el = document.getElementById("resume-card");
    if (!el) {
      window.print();
      return;
    }

    try {
      setDownloadingPDF(true);

      if (document.fonts) {
        await document.fonts.ready;
      }

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      let capturedLinks: Array<{
        url: string;
        xRatio: number;
        yRatio: number;
        wRatio: number;
        hRatio: number;
      }> = [];

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          try {
            clonedDoc.documentElement.className = document.documentElement.className;
            clonedDoc.body.className = document.body.className;

            if (document.fonts) {
              document.fonts.forEach((font) => {
                try {
                  clonedDoc.fonts.add(font);
                } catch (e) {}
              });
            }

            const fontResetStyle = clonedDoc.createElement("style");
            fontResetStyle.textContent = `
              * {
                letter-spacing: normal !important;
                word-spacing: normal !important;
                font-kerning: normal !important;
                text-rendering: geometricPrecision !important;
              }
            `;
            clonedDoc.head.appendChild(fontResetStyle);

            const targetCard = clonedDoc.getElementById("resume-card");
            if (targetCard) {
              (targetCard.style as any).zoom = "1";
              targetCard.style.transform = "none";
              targetCard.style.maxHeight = "none";
              targetCard.style.height = "auto";
              targetCard.style.overflow = "visible";

              const allClonedNodes = targetCard.querySelectorAll<HTMLElement>("*");
              allClonedNodes.forEach((node) => {
                if ((node.style as any).zoom) {
                  (node.style as any).zoom = "1";
                }
                if (node.style.transform && node.style.transform.includes("scale")) {
                  node.style.transform = "none";
                }
              });

              // Capture links directly from the rendered cloned card
              const cardRect = targetCard.getBoundingClientRect();
              const anchorNodes = targetCard.querySelectorAll<HTMLAnchorElement>("a[href]");
              capturedLinks = [];

              anchorNodes.forEach((a) => {
                const rawHref = a.getAttribute("href") || a.href;
                if (!rawHref || rawHref === "#" || rawHref.startsWith("javascript:")) return;

                const url = formatUrl(rawHref);
                if (!url) return;

                const aRect = a.getBoundingClientRect();
                let relLeft = aRect.left - cardRect.left;
                let relTop = aRect.top - cardRect.top;
                let relWidth = aRect.width;
                let relHeight = aRect.height;

                if (relWidth === 0 || relHeight === 0) {
                  let curr: HTMLElement | null = a;
                  let oTop = 0;
                  let oLeft = 0;
                  while (curr && curr !== targetCard) {
                    oTop += curr.offsetTop || 0;
                    oLeft += curr.offsetLeft || 0;
                    curr = curr.offsetParent as HTMLElement | null;
                  }
                  relLeft = oLeft;
                  relTop = oTop;
                  relWidth = a.offsetWidth || 35;
                  relHeight = a.offsetHeight || 14;
                }

                if (cardRect.width > 0 && cardRect.height > 0 && relWidth > 0 && relHeight > 0) {
                  capturedLinks.push({
                    url,
                    xRatio: relLeft / cardRect.width,
                    yRatio: relTop / cardRect.height,
                    wRatio: relWidth / cardRect.width,
                    hRatio: relHeight / cardRect.height,
                  });
                }
              });
            }
          } catch (e) {
            console.error("onclone error:", e);
          }
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const paperSize = resume?.settings?.paperSize || "a4";
      let pdfWidth = paperSize === "letter" ? 215.9 : 210;
      let pdfHeight = paperSize === "letter" ? 279.4 : 297;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      // Embed clickable PDF hyperlink annotations
      const padX = 1.2;
      const padY = 0.8;
      pdf.setPage(1);

      capturedLinks.forEach((link) => {
        const x = link.xRatio * pdfWidth;
        const y = link.yRatio * pdfHeight;
        const w = link.wRatio * pdfWidth;
        const h = link.hRatio * pdfHeight;

        pdf.link(
          Math.max(0, x - padX),
          Math.max(0, y - padY),
          w + padX * 2,
          h + padY * 2,
          { url: link.url }
        );
      });

      pdf.save(`${resume?.title || resume?.personalInfo?.fullName || "Resume"}.pdf`);
    } catch (err) {
      console.error("PDF download failed, falling back to print:", err);
      window.print();
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">Loading Resume Preview...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-3xl font-black">
          ⚠️
        </div>
        <h1 className="text-2xl font-black text-white">Resume Unavailable</h1>
        <p className="text-sm text-slate-400 max-w-md">{error || "This resume link is invalid or no longer available."}</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
        >
          Return to Home Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col print:bg-white print:text-black">
      {/* Top Navbar for Public View */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              {resume.title || "Shared Resume"}
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Public View
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {resume.personalInfo?.fullName ? `By ${resume.personalInfo.fullName}` : "Created with ResumeAI"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
            <span>{copied ? "Link Copied!" : "Share Link"}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            {downloadingPDF ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
            title="Print or Save as Vector PDF (Cmd+P)"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Print / Save PDF</span>
          </button>

          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-purple-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Create Mine</span>
          </Link>
        </div>
      </header>

      {/* Main Resume Paper View Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 flex justify-center print:p-0 print:max-w-none">
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-900 border border-slate-200 print:shadow-none print:border-none print:rounded-none">
          <ResumePreview resume={resume} />
        </div>
      </main>
    </div>
  );
}
