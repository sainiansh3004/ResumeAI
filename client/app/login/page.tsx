"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser, verifyOtp, resendOtp } from "@/services/authService";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState("");
  const [targetEmail, setTargetEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      const response = await loginUser(formData);

      if (response.requireOtp) {
        setTargetEmail(response.email || formData.email);
        setStep("otp");
        setSuccessMsg(response.message || "OTP code sent to your email address!");
      } else if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      setSuccessMsg("");

      const response = await verifyOtp({ email: targetEmail, otp: otp.trim() });
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.user?.isPro) {
          localStorage.setItem("pro_member", "true");
        }
        setSuccessMsg("Verification successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      setError("");
      setSuccessMsg("");
      const response = await resendOtp({ email: targetEmail });
      setSuccessMsg(response.message || "A fresh OTP code has been sent to your email.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 font-sans"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%), #f9fafb",
      }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-500/30 mb-2">
            R
          </div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">
            {step === "login" ? "Welcome back" : "Enter Verification Code"}
          </h1>
          <p className="text-sm text-gray-500">
            {step === "login"
              ? "Sign in to your ResumeAI account"
              : `We sent a 6-digit OTP code to ${targetEmail}`}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8 space-y-6">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 font-medium">
              {successMsg}
            </div>
          )}

          {step === "login" ? (
            /* STEP 1: LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
              >
                {loading ? "Verifying Credentials..." : "Continue →"}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP FORM */
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  6-Digit OTP Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  autoFocus
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-center text-2xl font-black tracking-[0.5em] text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <button
                type="submit"
                disabled={verifying || otp.length !== 6}
                className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
              >
                {verifying ? "Verifying Code..." : "Verify OTP & Sign In →"}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-blue-600 font-bold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {resending ? "Resending..." : "Resend OTP Code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("login");
                    setOtp("");
                    setError("");
                  }}
                  className="text-gray-500 font-semibold hover:text-gray-700 cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-gray-400">
          Protected by ResumeAI Email OTP Security Layer.
        </p>
      </div>
    </main>
  );
}