"use client";

import A4Container from "./A4Container";

import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ATSTemplate from "./templates/ATSTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechTemplate from "./templates/TechTemplate";
import AcademicTemplate from "./templates/AcademicTemplate";
import SleekTemplate from "./templates/SleekTemplate";

import { Resume, ResumeSettings } from "@/types/resume";

interface ResumePreviewProps {
  resume: Resume;
}

const FONT_SIZE_MAP: Record<ResumeSettings["fontSize"], string> = {
  sm: "13px",
  md: "14px",
  lg: "15.5px",
};

const LINE_HEIGHT_MAP: Record<ResumeSettings["lineHeight"], string> = {
  snug: "1.35",
  normal: "1.5",
  relaxed: "1.75",
};

const MARGIN_MAP: Record<ResumeSettings["margin"], string> = {
  compact: "24px",
  normal: "40px",
  spacious: "56px",
};

function getGoogleFontUrl(family: string): string {
  const formatted = family.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${formatted}:wght@300;400;500;600;700;800&display=swap`;
}

export default function ResumePreview({
  resume,
}: ResumePreviewProps) {
  const settings = resume.settings || {
    fontFamily: "Inter",
    fontSize: "md" as const,
    lineHeight: "normal" as const,
    margin: "normal" as const,
    accentColor: "",
    showPageNumbers: true,
  };

  const fit = settings.fitToOnePage;

  const previewStyle: React.CSSProperties = {
    fontFamily: `"${settings.fontFamily}", ui-sans-serif, system-ui, sans-serif`,
    fontSize: fit ? "11.5px" : FONT_SIZE_MAP[settings.fontSize] || "14px",
    lineHeight: fit ? "1.25" : LINE_HEIGHT_MAP[settings.lineHeight] || "1.5",
  };

  const containerPadding = fit ? "20px" : MARGIN_MAP[settings.margin] || "40px";

  return (
    <>
      {/* Dynamic Google Font */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={getGoogleFontUrl(settings.fontFamily)} />

      <div
        id="resume-preview"
        className="flex w-full justify-center overflow-y-auto bg-gray-200 p-8"
        style={previewStyle}
      >
        <A4Container padding={containerPadding} fitToOnePage={fit}>
          {resume.template === "modern" && (
            <ModernTemplate resume={resume} />
          )}

          {resume.template === "minimal" && (
            <MinimalTemplate resume={resume} />
          )}

          {resume.template === "ats" && (
            <ATSTemplate resume={resume} />
          )}

          {resume.template === "creative" && (
            <CreativeTemplate resume={resume} />
          )}

          {resume.template === "executive" && (
            <ExecutiveTemplate resume={resume} />
          )}

          {resume.template === "tech" && (
            <TechTemplate resume={resume} />
          )}

          {resume.template === "academic" && (
            <AcademicTemplate resume={resume} />
          )}

          {resume.template === "sleek" && (
            <SleekTemplate resume={resume} />
          )}
        </A4Container>
      </div>
    </>
  );
}