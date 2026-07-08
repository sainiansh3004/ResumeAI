"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/30">
            R
          </div>
          <span className="text-lg font-black tracking-tight text-gray-950">ResumeAI</span>
        </Link>

        {/* Navigation */}
        <div className="hidden gap-8 font-semibold text-sm text-gray-500 md:flex">
          <a href="#home" className="hover:text-gray-900 transition">Home</a>
          <a href="#features" className="hover:text-gray-900 transition">Features</a>
          <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
          >
            Get Started Free
          </Link>
        </div>

      </div>
    </nav>
  );
}