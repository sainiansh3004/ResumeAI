"use client";

import A4Container from "./A4Container";

import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ATSTemplate from "./templates/ATSTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";

import { Resume } from "@/types/resume";

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({
  resume,
}: ResumePreviewProps) {
  return (
    <div
      id="resume-preview"
      className="flex w-full justify-center overflow-y-auto bg-gray-200 p-8"
    >
      <A4Container>
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
      </A4Container>
    </div>
  );
}