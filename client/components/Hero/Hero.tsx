"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center">
          <span className="inline-block rounded-full bg-blue-100 px-5 py-2 font-semibold text-blue-700">
            🚀 AI Powered Resume Builder
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight">
            Build Stunning
            <br />
            Resumes & Portfolios
            <br />
            in Minutes
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-gray-600">
            Create ATS-friendly resumes, beautiful portfolio websites,
            AI-generated cover letters, and land your dream job faster.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              Get Started Free
            </Link>

            <Link
              href="/login"
              className="rounded-xl border px-8 py-4 text-lg font-semibold transition hover:bg-gray-100"
            >
              Login
            </Link>
          </div>

          <div className="mt-12 text-lg text-gray-500">
            ⭐⭐⭐⭐⭐ Trusted by 15,000+ students & professionals
          </div>
        </div>
      </div>
    </section>
  );
}