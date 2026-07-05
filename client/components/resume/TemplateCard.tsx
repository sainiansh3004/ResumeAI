"use client";

import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import TemplateThumbnail from "./TemplateThumbnail";
import { Resume } from "@/types/resume";

export interface TemplateCardProps {
  id: Resume["template"];
  name: string;
  description: string;

  selected: boolean;

  ats?: boolean;
  comingSoon?: boolean;

  category: string;
  recommended?: boolean;

  onSelect: (id: Resume["template"]) => void;
}

export default function TemplateCard({
  id,
  name,
  description,
  selected,
  ats = false,
  comingSoon = false,
  category,
  recommended = false,
  onSelect,
}: TemplateCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-white transition-all duration-300 ${
        selected
          ? "border-blue-600 ring-2 ring-blue-200 shadow-2xl"
          : "border-gray-200 hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      {/* Recommended */}
      {recommended && (
        <div className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
          <Sparkles className="h-3.5 w-3.5" />
          Recommended
        </div>
      )}

      {/* ATS */}
      {ats && (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">
          <ShieldCheck className="h-3.5 w-3.5" />
          ATS
        </div>
      )}

      {/* Thumbnail */}
      <div className="h-64 overflow-hidden border-b bg-gray-100">
        <TemplateThumbnail template={id} />
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {category}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {name}
          </h3>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {description}
          </p>
        </div>

        {comingSoon ? (
          <button
            disabled
            className="w-full rounded-xl bg-gray-300 py-3 font-semibold text-gray-600"
          >
            Coming Soon
          </button>
        ) : (
          <button
            onClick={() => onSelect(id)}
            className={`w-full rounded-xl py-3 font-semibold transition ${
              selected
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            {selected ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Selected
              </span>
            ) : (
              "Use Template"
            )}
          </button>
        )}
      </div>
    </div>
  );
}