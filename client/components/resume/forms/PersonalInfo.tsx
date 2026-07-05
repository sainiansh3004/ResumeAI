"use client";

import { useEffect, useState } from "react";
import { Sparkles, Upload, Trash2 } from "lucide-react";
import { Resume, PersonalInfo as PersonalInfoType } from "@/types/resume";
import { generateSummary } from "@/services/aiService";

interface Props {
  resume: Resume;
  data: PersonalInfoType;
  onChange: (data: PersonalInfoType) => void;
}

export default function PersonalInfo({
  resume,
  data,
  onChange,
}: Props) {
  const [form, setForm] = useState<PersonalInfoType>({
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
});

  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
  fullName: data.fullName || "",
  headline: data.headline || "",

  photo: data.photo || "",

  email: data.email || "",
  phone: data.phone || "",
  address: data.address || "",

  linkedin: data.linkedin || "",
  github: data.github || "",
  portfolio: data.portfolio || "",

  summary: data.summary || "",
});
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const updated = {
      ...form,
      [name]: value,
    };

    setForm(updated);
    onChange(updated);
  };

  const handlePhotoUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    alert("Only JPG, PNG and WEBP images are allowed.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Image size must be less than 2MB.");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    const updated = {
      ...form,
      photo: reader.result as string,
    };

    setForm(updated);
    onChange(updated);
  };

  reader.readAsDataURL(file);
};

const removePhoto = () => {
  const updated = {
    ...form,
    photo: "",
  };

  setForm(updated);
  onChange(updated);
};

  const handleGenerateSummary = async () => {
    try {
      setGenerating(true);

      const response = await generateSummary(resume);

      const updated = {
        ...form,
        summary: response.summary,
      };

      setForm(updated);
      onChange(updated);
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI summary.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          This information appears at the top of your resume.
        </p>
      </div>

     <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 p-6">

  {form.photo ? (
    <img
      src={form.photo}
      alt="Profile"
      className="h-32 w-32 rounded-full border object-cover"
    />
  ) : (
    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
      <Upload className="h-10 w-10 text-gray-400" />
    </div>
  )}

  <label className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
    Upload Photo
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="hidden"
      onChange={handlePhotoUpload}
    />
  </label>

  {form.photo && (
    <button
      type="button"
      onClick={removePhoto}
      className="flex items-center gap-2 text-red-600 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4" />
      Remove Photo
    </button>
  )}
</div>

<div className="grid gap-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="headline"
          value={form.headline}
          onChange={handleChange}
          placeholder="Professional Headline"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="linkedin"
          value={form.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="github"
          value={form.github}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="portfolio"
          value={form.portfolio}
          onChange={handleChange}
          placeholder="Portfolio Website"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Professional Summary
          </label>

          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />

            {generating
              ? "Generating..."
              : "Generate AI Summary"}
          </button>
        </div>

        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          rows={6}
          placeholder="Professional Summary"
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}