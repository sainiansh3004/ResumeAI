"use client";

import React from "react";
import { ResumeSettings, PaperSize } from "@/types/resume";
import { Type, AlignVerticalSpaceAround, Maximize, Hash, FileText } from "lucide-react";

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Lato", label: "Lato" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Raleway", label: "Raleway" },
  { value: "Source Sans 3", label: "Source Sans 3" },
  { value: "Nunito", label: "Nunito" },
  { value: "Poppins", label: "Poppins" },
];

const PAPER_SIZE_OPTIONS: { value: PaperSize; label: string; desc: string }[] = [
  { value: "a4", label: "A4 Standard (Recommended for India & Europe)", desc: "210 × 297 mm — Most popular for Campus & Off-Campus" },
  { value: "letter", label: "US Letter (USA & Canada)", desc: "8.5 × 11 in (216 × 279 mm)" },
];

const FONT_SIZE_OPTIONS: { value: ResumeSettings["fontSize"]; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const LINE_HEIGHT_OPTIONS: { value: ResumeSettings["lineHeight"]; label: string }[] = [
  { value: "snug", label: "Snug" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
];

const MARGIN_OPTIONS: { value: ResumeSettings["margin"]; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Normal" },
  { value: "spacious", label: "Spacious" },
];

interface LayoutStyleEditorProps {
  settings: ResumeSettings;
  onSettingsChange: (settings: ResumeSettings) => void;
}

export default function LayoutStyleEditor({
  settings,
  onSettingsChange,
}: LayoutStyleEditorProps) {
  const update = (partial: Partial<ResumeSettings>) => {
    onSettingsChange({ ...settings, ...partial });
  };

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Typography & Layout
        </h3>

        {/* Fit to 1 Page Toggle */}
        <button
          type="button"
          onClick={() =>
            update({
              fitToOnePage: !settings.fitToOnePage,
              fontSize: !settings.fitToOnePage ? "sm" : settings.fontSize,
              lineHeight: !settings.fitToOnePage ? "snug" : settings.lineHeight,
              margin: !settings.fitToOnePage ? "compact" : settings.margin,
            })
          }
          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
            settings.fitToOnePage
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-blue-500/20"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          <span>⚡ Fit to 1 Page</span>
          {settings.fitToOnePage && <span>✓</span>}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Paper Size / Sheet Format */}
        <div className="col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <FileText className="h-3.5 w-3.5" />
            Paper Sheet Size
          </label>
          <select
            value={settings.paperSize || "a4"}
            onChange={(e) => update({ paperSize: e.target.value as PaperSize })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
          >
            {PAPER_SIZE_OPTIONS.map((paper) => (
              <option key={paper.value} value={paper.value}>
                {paper.label} — {paper.desc}
              </option>
            ))}
          </select>
        </div>

        {/* Font Family */}
        <div className="col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Type className="h-3.5 w-3.5" />
            Font Family
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => update({ fontFamily: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
            style={{ fontFamily: settings.fontFamily }}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Type className="h-3.5 w-3.5" />
            Size
          </label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ fontSize: opt.value })}
                className={`flex-1 py-2 text-xs font-semibold transition cursor-pointer ${
                  settings.fontSize === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <AlignVerticalSpaceAround className="h-3.5 w-3.5" />
            Spacing
          </label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {LINE_HEIGHT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ lineHeight: opt.value })}
                className={`flex-1 py-2 text-xs font-semibold transition cursor-pointer ${
                  settings.lineHeight === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Maximize className="h-3.5 w-3.5" />
            Margins
          </label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {MARGIN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ margin: opt.value })}
                className={`flex-1 py-2 text-xs font-semibold transition cursor-pointer ${
                  settings.margin === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page Numbers Toggle */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.showPageNumbers}
                onChange={(e) => update({ showPageNumbers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors" />
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Hash className="h-3.5 w-3.5" />
              Page Numbers
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
