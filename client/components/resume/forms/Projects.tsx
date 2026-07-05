"use client";

import { useEffect, useState } from "react";

interface Project {
  title: string;
  technologies: string[];
  github: string;
  liveDemo: string;
  description: string;
}

interface ProjectsProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export default function Projects({
  projects,
  onChange,
}: ProjectsProps) {
  const [projectList, setProjectList] = useState<Project[]>([]);

  useEffect(() => {
    setProjectList(projects || []);
  }, [projects]);

  const addProject = () => {
    const updated = [
      ...projectList,
      {
        title: "",
        technologies: [],
        github: "",
        liveDemo: "",
        description: "",
      },
    ];

    setProjectList(updated);
    onChange(updated);
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    const updated = [...projectList];

    if (field === "technologies") {
      updated[index].technologies = value
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);
    } else {
      (updated[index][field] as string) = value;
    }

    setProjectList(updated);
    onChange(updated);
  };

  const deleteProject = (index: number) => {
    const updated = projectList.filter((_, i) => i !== index);

    setProjectList(updated);
    onChange(updated);
  };

  return (
    <div className="mt-10 rounded-xl border bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>

        <button
          onClick={addProject}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          + Add Project
        </button>
      </div>

      {projectList.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-gray-500">
          No projects added yet.
        </div>
      )}

      {projectList.map((project, index) => (
        <div
          key={index}
          className="mb-8 rounded-lg border p-5"
        >
          <div className="grid gap-4">
            <input
              placeholder="Project Name"
              value={project.title}
              onChange={(e) =>
                updateProject(index, "title", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <input
              placeholder="Technologies (React, Node.js, MongoDB)"
              value={project.technologies.join(", ")}
              onChange={(e) =>
                updateProject(index, "technologies", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <input
              placeholder="GitHub URL"
              value={project.github}
              onChange={(e) =>
                updateProject(index, "github", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <input
              placeholder="Live Demo URL"
              value={project.liveDemo}
              onChange={(e) =>
                updateProject(index, "liveDemo", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <textarea
              rows={4}
              placeholder="Project Description"
              value={project.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <button
              onClick={() => deleteProject(index)}
              className="ml-auto rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}