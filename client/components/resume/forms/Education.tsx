"use client";

interface EducationItem {
  college: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  cgpa: string;
}

interface Props {
  education?: EducationItem[];
  onChange: (education: EducationItem[]) => void;
}

export default function Education({ education = [], onChange }: Props) {
  const safeEducation = Array.isArray(education) ? education : [];

  const addEducation = () => {
    onChange([
      ...safeEducation,
      {
        college: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        cgpa: "",
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updated = safeEducation.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const deleteEducation = (index: number) => {
    const updated = safeEducation.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Education</h2>

        <button
          type="button"
          onClick={addEducation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer"
        >
          + Add Education
        </button>
      </div>

      {safeEducation.length === 0 && (
        <div className="border rounded-lg p-6 text-center text-gray-500 bg-gray-50">
          No education added yet. Click &quot;+ Add Education&quot; to get started.
        </div>
      )}

      {safeEducation.map((edu, index) => (
        <div
          key={index}
          className="border rounded-xl p-5 mb-6 bg-white shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                College / Institution
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Stanford University"
                value={edu.college || ""}
                onChange={(e) =>
                  handleChange(index, "college", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Degree
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Bachelor of Science"
                value={edu.degree || ""}
                onChange={(e) =>
                  handleChange(index, "degree", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Field of Study
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Computer Science"
                value={edu.fieldOfStudy || ""}
                onChange={(e) =>
                  handleChange(index, "fieldOfStudy", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                CGPA / Grade
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 3.8 / 4.0 or 8.5"
                value={edu.cgpa || ""}
                onChange={(e) =>
                  handleChange(index, "cgpa", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Start Year
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 2020"
                value={edu.startYear || ""}
                onChange={(e) =>
                  handleChange(index, "startYear", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                End Year
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 2024 or Present"
                value={edu.endYear || ""}
                onChange={(e) =>
                  handleChange(index, "endYear", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => deleteEducation(index)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}