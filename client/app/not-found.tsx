"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 text-center"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.10) 0%, transparent 70%), #f9fafb" }}
    >
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center shadow-inner">
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">Page Not Found</h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl text-white text-sm font-bold transition shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
