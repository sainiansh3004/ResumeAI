"use client";

import { useEffect, useState } from "react";
import { Language } from "@/types/resume";

interface LanguagesProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

export default function Languages({
  languages,
  onChange,
}: LanguagesProps) {
  const [languageList, setLanguageList] = useState<Language[]>(
  languages.length > 0
    ? languages
    : [
        {
          name: "",
          proficiency: "",
        },
      ]
);

  useEffect(() => {
  setLanguageList(
    languages.length > 0
      ? languages
      : [
          {
            name: "",
            proficiency: "",
          },
        ]
  );
}, [languages]);

  const updateLanguages = (list: Language[]) => {
    setLanguageList(list);
    onChange(list);
  };

  const handleChange = (
    index: number,
    field: keyof Language,
    value: string
  ) => {
    const updated = [...languageList];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updateLanguages(updated);
  };

  const addLanguage = () => {
    updateLanguages([
      ...languageList,
      {
        name: "",
        proficiency: "",
      },
    ]);
  };

  const removeLanguage = (index: number) => {
    updateLanguages(
      languageList.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Languages
        </h2>

        <button
          type="button"
          onClick={addLanguage}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Language
        </button>
      </div>

      {languageList.length === 0 && (
        <p className="text-sm text-gray-500">
          No languages added yet.
        </p>
      )}

      {languageList.map((language, index) => (
        <div
          key={index}
          className="rounded-lg border bg-white p-5 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Language {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeLanguage(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Language
            </label>

            <input
              type="text"
              value={language.name}
              onChange={(e) =>
                handleChange(index, "name", e.target.value)
              }
              placeholder="English"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Proficiency
            </label>

            <select
              value={language.proficiency}
              onChange={(e) =>
                handleChange(
                  index,
                  "proficiency",
                  e.target.value
                )
              }
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option>Native</option>
              <option>Fluent</option>
              <option>Professional</option>
              <option>Intermediate</option>
              <option>Basic</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}