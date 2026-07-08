"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%), #ffffff",
      }}
    >
      <div className="max-w-5xl mx-auto px-8 py-28 md:py-36">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-full border border-blue-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Powered by Google Gemini AI — Free to Start
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-gray-950">
            Build Stunning
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
              Resumes & Portfolios
            </span>
            in Minutes
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            ATS-friendly resumes, beautiful portfolio websites, AI-generated cover letters, and real-time scoring — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Sign In
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="text-yellow-500">★★★★★</span>
              Trusted by 15,000+ professionals
            </span>
            <span className="hidden sm:block w-px h-4 bg-gray-200" />
            <span>✓ No credit card required</span>
            <span className="hidden sm:block w-px h-4 bg-gray-200" />
            <span>✓ Download PDF instantly</span>
          </div>
        </div>
      </div>
    </section>
  );
}