"use client";

interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Props {
  experience: ExperienceItem[];
  onChange: (experience: ExperienceItem[]) => void;
}

export default function Experience({
  experience = [],
  onChange,
}: Props) {
  const safeExperience = Array.isArray(experience) ? experience : [];

  const addExperience = () => {
    onChange([
      ...safeExperience,
      {
        company: "",
        position: "",
        location: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    const updated = safeExperience.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const deleteExperience = (index: number) => {
    const updated = safeExperience.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Experience</h2>

        <button
          onClick={addExperience}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Experience
        </button>
      </div>

      {experience.length === 0 && (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          No experience added yet.
        </div>
      )}

      {experience.map((exp, index) => (
        <div
          key={index}
          className="border rounded-xl p-5 mb-6 bg-white shadow-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border rounded p-2"
              placeholder="Company"
              value={exp.company}
              onChange={(e) =>
                handleChange(index, "company", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="Job Title"
              value={exp.position}
              onChange={(e) =>
                handleChange(index, "position", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="Location"
              value={exp.location}
              onChange={(e) =>
                handleChange(index, "location", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="Employment Type"
              value={exp.employmentType}
              onChange={(e) =>
                handleChange(index, "employmentType", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) =>
                handleChange(index, "startDate", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) =>
                handleChange(index, "endDate", e.target.value)
              }
            />

            <textarea
              className="border rounded p-2 col-span-2"
              rows={5}
              placeholder="Describe your responsibilities and achievements..."
              value={exp.description}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={() => deleteExperience(index)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}