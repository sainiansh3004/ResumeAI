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
  education: EducationItem[];
  onChange: (education: EducationItem[]) => void;
}

export default function Education({ education, onChange }: Props) {
  const addEducation = () => {
    onChange([
      ...education,
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
    const updated = [...education];
    updated[index][field] = value;
    onChange(updated);
  };

  const deleteEducation = (index: number) => {
    const updated = education.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Education</h2>

        <button
          onClick={addEducation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Education
        </button>
      </div>

      {education.length === 0 && (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          No education added yet.
        </div>
      )}

      {education.map((edu, index) => (
        <div
          key={index}
          className="border rounded-xl p-5 mb-6 bg-white shadow-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border rounded p-2"
              placeholder="College"
              value={edu.college}
              onChange={(e) =>
                handleChange(index, "college", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) =>
                handleChange(index, "degree", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="Field of Study"
              value={edu.fieldOfStudy}
              onChange={(e) =>
                handleChange(index, "fieldOfStudy", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="CGPA"
              value={edu.cgpa}
              onChange={(e) =>
                handleChange(index, "cgpa", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="Start Year"
              value={edu.startYear}
              onChange={(e) =>
                handleChange(index, "startYear", e.target.value)
              }
            />

            <input
              className="border rounded p-2"
              placeholder="End Year"
              value={edu.endYear}
              onChange={(e) =>
                handleChange(index, "endYear", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={() => deleteEducation(index)}
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