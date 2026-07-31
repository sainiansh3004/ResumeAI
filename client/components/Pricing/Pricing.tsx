"use client";

import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <section id="pricing" className="py-28 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            Invest in Your Career,<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
              Accelerate Your Job Search
            </span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Start for free and upgrade whenever you're ready to unlock unlimited AI bullet rewrites, premium templates, and custom subdomains.
          </p>

          {/* Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-gray-200 p-1 relative transition-colors duration-200 focus:outline-none"
              style={{ backgroundColor: billingCycle === "yearly" ? "#2563eb" : "#e5e7eb" }}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-400"} flex items-center gap-1.5`}>
              Yearly
              <span className="text-[10px] bg-green-100 text-green-700 font-extrabold px-2 py-0.5 rounded-full">
                Save 40%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Tier */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-950">Starter</h3>
                <p className="text-xs text-gray-500">Perfect for building your first resume and testing the platform.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-950">$0</span>
                <span className="text-xs font-semibold text-gray-400">/ forever</span>
              </div>

              <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Up to 2 Resumes
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Access to 3 Free Templates (Modern, Minimal, ATS)
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Standard PDF Downloads
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Basic AI Suggestions (5 per month)
                </li>
                <li className="flex items-center gap-2.5 text-gray-400">
                  <span>✕</span> Premium Templates (Tech, Sleek, Academic)
                </li>
                <li className="flex items-center gap-2.5 text-gray-400">
                  <span>✕</span> Portfolio Custom Subdomain
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl border border-gray-300 text-center text-sm font-bold text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-8 relative">
            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-950">Pro AI Pass</h3>
                <p className="text-xs text-gray-500">For ambitious professionals seeking maximum interview callbacks.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-950">
                  {billingCycle === "yearly" ? "$9" : "$15"}
                </span>
                <span className="text-xs font-semibold text-gray-400">/ month</span>
                {billingCycle === "yearly" && (
                  <span className="text-[10px] text-gray-400 block font-normal ml-2">
                    (Billed annually)
                  </span>
                )}
              </div>

              <ul className="space-y-3.5 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Unlimited Resumes & Portfolios
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Access to ALL 8+ Premium Templates
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Unlimited Gemini AI Writing & Optimization
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Instant ATS Score Audit & Feedback
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Custom Portfolio Subdomain (yourname.resumeai.site)
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span> Priority Support & High-Resolution Exports
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl text-center text-sm font-bold text-white transition shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              Upgrade to Pro →
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
