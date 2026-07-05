"use client";

import { useEffect, useState } from "react";
import { Interest } from "@/types/resume";

interface InterestsProps {
  interests: Interest[];
  onChange: (interests: Interest[]) => void;
}

export default function Interests({
  interests,
  onChange,
}: InterestsProps) {
  const [interestList, setInterestList] = useState<Interest[]>(
  interests.length > 0
    ? interests
    : [
        {
          name: "",
        },
      ]
);

  useEffect(() => {
  setInterestList(
    interests.length > 0
      ? interests
      : [
          {
            name: "",
          },
        ]
  );
}, [interests]);

  const updateInterests = (list: Interest[]) => {
    setInterestList(list);
    onChange(list);
  };

  const handleChange = (
    index: number,
    value: string
  ) => {
    const updated = [...interestList];

    updated[index] = {
      ...updated[index],
      name: value,
    };

    updateInterests(updated);
  };

  const addInterest = () => {
    updateInterests([
      ...interestList,
      {
        name: "",
      },
    ]);
  };

  const removeInterest = (index: number) => {
    updateInterests(
      interestList.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Interests
        </h2>

        <button
          type="button"
          onClick={addInterest}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Interest
        </button>
      </div>

      {interestList.length === 0 && (
        <p className="text-sm text-gray-500">
          No interests added yet.
        </p>
      )}

      {interestList.map((interest, index) => (
        <div
          key={index}
          className="space-y-4 rounded-lg border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Interest {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeInterest(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Interest
            </label>

            <input
              type="text"
              value={interest.name}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              placeholder="Photography"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}