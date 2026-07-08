"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await registerUser(formData);
      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === "object" ? JSON.stringify(err.response?.data) : null) ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.08) 0%, transparent 70%), #f9fafb" }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-500/30 mb-2">
            R
          </div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-500">Start building professional resumes for free</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8 space-y-6">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password (min. 6 chars)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              {loading ? "Creating Account..." : "Create Free Account →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}