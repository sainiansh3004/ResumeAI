"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMyResumes,
  createResume,
  deleteResume,
} from "@/services/resumeService";

interface User {
  name?: string;
}

interface Resume {
  _id: string;
  title: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User>({});
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await getMyResumes();
      setResumes(response.resumes || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const response = await createResume();

      alert("Resume Created Successfully");

      router.push(`/resume/${response.resume._id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create resume");
    }
  };

  const handleDeleteResume = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResume(id);

      alert("Resume Deleted");

      loadResumes();
    } catch (error) {
      console.error(error);
      alert("Failed to delete resume");
    }
  };

  const handleEditResume = (id: string) => {
    router.push(`/resume/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-5 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">ResumeAI Dashboard</h1>
          <p className="mt-2">Welcome, {user.name}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">My Resumes</h2>

          <button
            onClick={handleCreateResume}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            + Create Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-2xl font-bold">No Resumes Yet</h2>

            <p className="text-gray-500 mt-3">
              Click "Create Resume" to get started.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold">{resume.title}</h3>

                <p className="text-gray-500 mt-2">Created:</p>

                <p>
                  {new Date(resume.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleEditResume(resume._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteResume(resume._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}