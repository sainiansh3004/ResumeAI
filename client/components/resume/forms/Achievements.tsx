"use client";

import { useEffect, useState } from "react";
import { Achievement } from "@/types/resume";

interface AchievementsProps {
  achievements: Achievement[];
  onChange: (achievements: Achievement[]) => void;
}

export default function Achievements({
  achievements,
  onChange,
}: AchievementsProps) {
  const [achievementList, setAchievementList] = useState<Achievement[]>(
  achievements.length > 0
    ? achievements
    : [
        {
          title: "",
          description: "",
        },
      ]
);

  useEffect(() => {
  setAchievementList(
    achievements.length > 0
      ? achievements
      : [
          {
            title: "",
            description: "",
          },
        ]
  );
}, [achievements]);

  const updateAchievements = (list: Achievement[]) => {
    setAchievementList(list);
    onChange(list);
  };

  const handleChange = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    const updated = [...achievementList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updateAchievements(updated);
  };

  const addAchievement = () => {
  console.log("Add Achievement clicked");

  updateAchievements([
    ...achievementList,
    {
      title: "",
      description: "",
    },
  ]);
};

  const removeAchievement = (index: number) => {
    updateAchievements(
      achievementList.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Achievements
        </h2>

        <button
          type="button"
          onClick={addAchievement}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Achievement
        </button>
      </div>

      {achievementList.length === 0 && (
        <p className="text-sm text-gray-500">
          No achievements added yet.
        </p>
      )}

      {achievementList.map((achievement, index) => (
        <div
          key={index}
          className="rounded-lg border bg-white p-5 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Achievement {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeAchievement(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <input
              type="text"
              value={achievement.title}
              onChange={(e) =>
                handleChange(
                  index,
                  "title",
                  e.target.value
                )
              }
              placeholder="e.g. Winner - Smart India Hackathon"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={3}
              value={achievement.description}
              onChange={(e) =>
                handleChange(
                  index,
                  "description",
                  e.target.value
                )
              }
              placeholder="Describe your achievement..."
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}