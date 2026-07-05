"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

        {/* Logo */}
        <Link
          href="/"
          className="cursor-pointer text-3xl font-bold text-blue-600"
        >
          ResumeAI
        </Link>

        {/* Navigation */}
        <div className="hidden gap-10 font-medium text-gray-700 md:flex">

          <a href="#home" className="transition hover:text-blue-600">
            Home
          </a>

          <a href="#features" className="transition hover:text-blue-600">
            Features
          </a>

          <a href="#templates" className="transition hover:text-blue-600">
            Templates
          </a>

          <a href="#pricing" className="transition hover:text-blue-600">
            Pricing
          </a>

          <a href="#contact" className="transition hover:text-blue-600">
            Contact
          </a>

        </div>

        {/* Buttons */}
        <div className="flex gap-4">

          <Link
            href="/login"
            className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}