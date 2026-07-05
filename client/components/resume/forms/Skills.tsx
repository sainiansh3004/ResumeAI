"use client";

import { useEffect, useState } from "react";

interface SkillsProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function Skills({
  skills,
  onChange,
}: SkillsProps) {
  const [input, setInput] = useState("");
  const [skillList, setSkillList] = useState<string[]>(skills || []);

  useEffect(() => {
    setSkillList(skills || []);
  }, [skills]);

  const addSkill = () => {
    const value = input.trim();

    if (!value) return;

    if (skillList.includes(value)) {
      setInput("");
      return;
    }

    const updated = [...skillList, value];

    setSkillList(updated);
    onChange(updated);
    setInput("");
  };

  const removeSkill = (index: number) => {
    const updated = skillList.filter((_, i) => i !== index);

    setSkillList(updated);
    onChange(updated);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="mt-10 bg-white rounded-xl shadow p-6 border">
      <h2 className="text-2xl font-bold mb-5">
        Skills
      </h2>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a skill (React, Node.js, Java...)"
          className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addSkill}
          className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {skillList.map((skill, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <span>{skill}</span>

            <button
              onClick={() => removeSkill(index)}
              className="font-bold hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}