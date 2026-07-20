"use client";

import TemplateGallery from "./TemplateGallery";
import { Resume } from "@/types/resume";

interface TemplateSelectorProps {
  selectedTemplate: Resume["template"];
  selectedTheme: Resume["themeColor"];

  onTemplateChange: (template: Resume["template"]) => void;
  onThemeChange: (theme: Resume["themeColor"]) => void;
}

const themeColors: Resume["themeColor"][] = [
  "blue",
  "purple",
  "green",
  "black",
  "red",
];

const COLOR_MAP: Record<Resume["themeColor"], string> = {
  blue: "#2563eb",
  purple: "#7c3aed",
  green: "#10b981",
  black: "#111827",
  red: "#ef4444",
};

export default function TemplateSelector({
  selectedTemplate,
  selectedTheme,
  onTemplateChange,
  onThemeChange,
}: TemplateSelectorProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      <TemplateGallery
        selectedTemplate={selectedTemplate}
        onSelectTemplate={onTemplateChange}
      />

      {/* Theme Colors */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Theme Color
        </h3>

        <div className="flex gap-3">
          {themeColors.map((color) => (
            <button
              key={color}
              onClick={() => onThemeChange(color)}
              className={`h-10 w-10 rounded-full border-4 transition ${
                selectedTheme === color
                  ? "border-gray-900 scale-110"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: COLOR_MAP[color] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}