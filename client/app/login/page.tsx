"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser, socialLogin } from "@/services/authService";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setUnverifiedEmail("");
  };

  const handleSocialLogin = async (provider: "google" | "linkedin") => {
    try {
      setLoading(true);
      setError("");
      const response = await socialLogin({ provider });
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Sign in with ${provider} failed.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setUnverifiedEmail("");
      const response = await loginUser(formData);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.location.href = "/dashboard";
      } else if (response.requireOtp) {
        setUnverifiedEmail(response.email || formData.email);
        setError("Your email address is not verified yet. Please complete 6-digit OTP verification.");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      if (err.response?.data?.requireOtp) {
        setUnverifiedEmail(err.response?.data?.email || formData.email);
        setError("Your email address is not verified yet. Please complete 6-digit OTP verification.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.10) 0%, transparent 70%), #f9fafb",
      }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-500/30 mb-2">
            R
          </div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your ResumeAI account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8 space-y-6">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-medium space-y-2">
              <p>{error}</p>
              {unverifiedEmail && (
                <Link
                  href="/register"
                  className="inline-block text-xs font-bold text-blue-600 underline hover:text-blue-700"
                >
                  Click here to verify OTP →
                </Link>
              )}
            </div>
          )}

          {/* Social Sign In Options */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm hover:border-gray-300"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("linkedin")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm hover:border-gray-300"
            >
              <svg className="h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-gray-100 w-full" />
            <span className="bg-white px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider absolute">OR</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}