"use client";

import { Resume } from "@/types/resume";
import TemplateCard from "./TemplateCard";

export interface TemplateGalleryProps {
  selectedTemplate: Resume["template"];
  onSelectTemplate: (template: Resume["template"]) => void;
}

const templates: {
  id: Resume["template"];
  name: string;
  category: string;
  description: string;
  ats: boolean;
  recommended: boolean;
  comingSoon: boolean;
  pro?: boolean;
}[] = [
  {
    id: "offcampus",
    name: "Off-Campus FAANG ATS",
    category: "FAANG / Corporate ATS",
    description:
      "Tier-1 single-column layout engineered specifically for top corporate off-campus applications (Google, Amazon, Microsoft, Top Tech).",
    ats: true,
    recommended: true,
    comingSoon: false,
  },
  {
    id: "modern",
    name: "Modern",
    category: "Professional",
    description:
      "Elegant and modern resume perfect for software engineers and professionals.",
    ats: false,
    recommended: false,
    comingSoon: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "ATS Friendly",
    description:
      "Simple, clean and highly readable layout optimized for recruiters.",
    ats: true,
    recommended: false,
    comingSoon: false,
  },
  {
    id: "ats",
    name: "ATS Professional",
    category: "ATS Optimized",
    description:
      "Built specifically for Applicant Tracking Systems with maximum compatibility.",
    ats: true,
    recommended: false,
    comingSoon: false,
  },
  {
    id: "creative",
    name: "Creative",
    category: "Modern Design",
    description:
      "Beautiful sidebar layout designed for designers, developers and creatives.",
    ats: false,
    recommended: false,
    comingSoon: false,
  },
  {
    id: "executive",
    name: "Executive Premium",
    category: "Executive",
    description:
      "A gorgeous multi-column layout optimized for senior staff and leadership.",
    ats: true,
    recommended: false,
    comingSoon: false,
    pro: true,
  },
  {
    id: "tech",
    name: "Developer Tech",
    category: "Technology",
    description:
      "Chronological developer density highlighting key repository and project tags.",
    ats: true,
    recommended: true,
    comingSoon: false,
    pro: true,
  },
  {
    id: "academic",
    name: "CV Academic",
    category: "Academic / Serif",
    description:
      "Sophisticated serif structure styled for research, honors, and publications.",
    ats: true,
    recommended: false,
    comingSoon: false,
    pro: true,
  },
  {
    id: "sleek",
    name: "Sleek Modern",
    category: "Modern / Minimalist",
    description:
      "Clean visual block-grid dividers for outstanding visual presentation.",
    ats: false,
    recommended: false,
    comingSoon: false,
    pro: true,
  },
];

export default function TemplateGallery({
  selectedTemplate,
  onSelectTemplate,
}: TemplateGalleryProps) {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Choose Your Resume Template
        </h2>

        <p className="mt-3 max-w-2xl text-gray-600">
          Every template uses the same resume data. Switch templates anytime
          without losing your information.
        </p>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            name={template.name}
            category={template.category}
            description={template.description}
            ats={template.ats}
            recommended={template.recommended}
            comingSoon={template.comingSoon}
            selected={selectedTemplate === template.id}
            pro={template.pro}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </section>
  );
}