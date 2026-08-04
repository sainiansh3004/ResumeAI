"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, RefreshCw } from "lucide-react";
import {
  getMyResumes,
  createResume,
  deleteResume,
  duplicateResume,
} from "@/services/resumeService";
import { parsePdfResume } from "@/services/aiService";
import { Resume } from "@/types/resume";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/services/billingService";
import { getMyPortfolio, convertResumeToPortfolio } from "@/services/portfolioService";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [importingPdf, setImportingPdf] = useState(false);
  const dashboardFileInputRef = useRef<HTMLInputElement>(null);

  const handleImportPDFOnDashboard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportingPdf(true);
    try {
      const res = await parsePdfResume(file);
      if (res.success && res.resume) {
        const created = await createResume(res.resume);
        if (created.success && created.resume?._id) {
          router.push(`/resume/${created.resume._id}`);
        } else {
          alert("Failed to create resume from imported PDF.");
        }
      } else {
        alert("Failed to parse PDF resume. Please ensure it contains readable text.");
      }
    } catch (err: any) {
      console.error("Dashboard PDF import error:", err);
      alert(err.response?.data?.message || "Failed to parse PDF resume.");
    } finally {
      setImportingPdf(false);
      if (e.target) e.target.value = "";
    }
  };
  const [search, setSearch] = useState("");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [subdomainInput, setSubdomainInput] = useState("");
  const [selectedResumeIdForPortfolio, setSelectedResumeIdForPortfolio] = useState<string | null>(null);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user state");
      }
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const resData = await getMyResumes();
      setResumes(resData.data || resData.resumes || (Array.isArray(resData) ? resData : []));

      try {
        const portRes = await getMyPortfolio();
        if (portRes.success && portRes.portfolio) {
          setPortfolio(portRes.portfolio);
        }
      } catch (e) {
        // Portfolio might not exist yet
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.clear();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      setCreating(true);
      const newRes = await createResume("Untitled Resume");
      const resumeId = newRes.data?._id || newRes._id;
      if (resumeId) {
        router.push(`/resume/${resumeId}`);
      } else {
        loadDashboardData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create resume.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert("Failed to delete resume.");
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dup = await duplicateResume(id);
      const newResume = dup.data || dup;
      setResumes((prev) => [newResume, ...prev]);
    } catch (err: any) {
      alert("Failed to duplicate resume.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handlePublishPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeIdForPortfolio || !subdomainInput.trim()) return;

    try {
      const res = await convertResumeToPortfolio(selectedResumeIdForPortfolio, subdomainInput.trim());
      if (res.success) {
        setPortfolio(res.portfolio);
        setPortfolioModalOpen(false);
        alert(`Portfolio published successfully at ${res.portfolio.subdomain}.resumeai.site!`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to publish portfolio.");
    }
  };

  const handleUpgradeToPro = async (planType: "monthly" | "yearly" = "yearly") => {
    try {
      const orderData = await createRazorpayOrder(planType);
      
      // Load Razorpay script if not already present
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ResumeAI Pro Pass",
        description: "Unlimited AI Generation & Premium Templates",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyRazorpayPayment(response);
            if (verifyRes.success) {
              alert("Congratulations! You are now a Pro member!");
              const updatedUser = { ...user, isPro: true, plan: "pro" };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUpgradeModalOpen(false);
            }
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to initiate checkout.");
    }
  };

  const filteredResumes = resumes.filter((r) =>
    (r.title || "Untitled Resume").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/20">
                R
              </div>
              <span className="text-xl font-black tracking-tight text-gray-950">ResumeAI</span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-semibold text-gray-400 border-l border-gray-200 pl-3">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user?.isPro ? (
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                ✦ PRO MEMBER
              </span>
            ) : (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition hover:-translate-y-0.5"
              >
                ⚡ Upgrade to Pro
              </button>
            )}

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900">{user?.name || "User"}</p>
                <p className="text-[10px] text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {/* Top Banner & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-950">Welcome back, {user?.name?.split(" ")[0] || "there"}!</h1>
            <p className="text-xs text-gray-500">
              Manage your resumes, edit designs, build your portfolio, and export ATS-optimized PDFs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={dashboardFileInputRef}
              onChange={handleImportPDFOnDashboard}
              accept=".pdf,.json,application/pdf,application/json"
              className="hidden"
            />
            <button
              onClick={() => dashboardFileInputRef.current?.click()}
              disabled={importingPdf}
              className="px-5 py-3 rounded-2xl bg-gray-900 text-white text-xs font-bold transition-all shadow-md hover:bg-gray-800 hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
            >
              {importingPdf ? (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
              ) : (
                <Upload className="h-4 w-4 text-blue-400" />
              )}
              <span>{importingPdf ? "Parsing PDF..." : "Import PDF Resume"}</span>
            </button>

            <button
              onClick={handleCreateResume}
              disabled={creating}
              className="px-5 py-3 rounded-2xl text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              <span>+</span>
              {creating ? "Creating..." : "Create Blank Resume"}
            </button>
          </div>
        </div>

        {/* Portfolio Status Section if existing */}
        {portfolio && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full border border-blue-400/30">
                🌐 Live Portfolio Site
              </span>
              <h2 className="text-lg font-bold">Your Portfolio is Live!</h2>
              <p className="text-xs text-blue-200">
                Subdomain: <span className="font-mono text-white font-bold">{portfolio.subdomain}.resumeai.site</span>
              </p>
            </div>
            <Link
              href={`/portfolio/${portfolio.subdomain}`}
              target="_blank"
              className="px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition shadow-md"
            >
              View Live Portfolio →
            </Link>
          </div>
        )}

        {/* Resumes Controls */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              My Resumes
              <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full">
                {resumes.length}
              </span>
            </h2>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search resumes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              />
            </div>
          </div>

          {/* Resumes Grid */}
          {loading ? (
            <div className="py-20 text-center text-xs text-gray-400">Loading your resumes...</div>
          ) : filteredResumes.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black mx-auto">
                📄
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">No resumes found</h3>
                <p className="text-xs text-gray-500">
                  {search ? "No resumes match your search criteria." : "Import your existing PDF resume or start with a blank template!"}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => dashboardFileInputRef.current?.click()}
                  disabled={importingPdf}
                  className="px-6 py-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition flex items-center gap-2"
                >
                  {importingPdf ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                  ) : (
                    <Upload className="h-4 w-4 text-blue-400" />
                  )}
                  <span>{importingPdf ? "Parsing..." : "Import PDF Resume"}</span>
                </button>
                <button
                  onClick={handleCreateResume}
                  disabled={creating}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                >
                  + Create Blank Resume
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => router.push(`/resume/${resume._id}`)}
                  className="group bg-white rounded-3xl border border-gray-200/80 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-6 cursor-pointer relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                        {resume.template || "modern"} template
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : "Recently"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-950 group-hover:text-blue-600 transition">
                      {resume.title || "Untitled Resume"}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {resume.personalInfo?.summary || resume.personalInfo?.headline || "No summary provided yet."}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicate(resume._id!, e)}
                        className="text-gray-500 hover:text-blue-600 font-semibold transition py-1 px-2 rounded-lg hover:bg-gray-50"
                        title="Duplicate Resume"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const publicUrl = `${window.location.origin}/view/${resume._id}`;
                          navigator.clipboard.writeText(publicUrl);
                          alert("🔗 Public share link copied to clipboard!\n\nAnyone can view your resume at:\n" + publicUrl);
                        }}
                        className="text-gray-500 hover:text-emerald-600 font-semibold transition py-1 px-2 rounded-lg hover:bg-emerald-50"
                        title="Copy public link so anyone can view your resume"
                      >
                        🔗 Share
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResumeIdForPortfolio(resume._id!);
                          setPortfolioModalOpen(true);
                        }}
                        className="text-gray-500 hover:text-purple-600 font-semibold transition py-1 px-2 rounded-lg hover:bg-gray-50"
                        title="Convert to Portfolio"
                      >
                        🌐 Portfolio
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleDelete(resume._id!, e)}
                      className="text-gray-400 hover:text-red-600 font-semibold transition py-1 px-2 rounded-lg hover:bg-red-50"
                      title="Delete Resume"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upgrade Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setUpgradeModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white font-black text-xl shadow-lg shadow-amber-500/30 mb-1">
                ✦
              </div>
              <h3 className="text-2xl font-black text-gray-950">Upgrade to ResumeAI Pro</h3>
              <p className="text-xs text-gray-500">
                Unlock unlimited AI features, 8+ premium templates, and custom portfolio subdomains.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                <span>Pro Pass Access</span>
                <span className="text-blue-600">$9 / month (billed yearly)</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 font-medium">
                <li>✓ Unlimited Gemini AI Bullet Rewrites</li>
                <li>✓ High-Resolution PDF & Image Exports</li>
                <li>✓ Portfolio Website Subdomain</li>
                <li>✓ ATS Parser Optimization</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleUpgradeToPro("yearly")}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
              >
                Pay & Unlock Pro ($9/mo) →
              </button>
              <button
                onClick={() => handleUpgradeToPro("monthly")}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition"
              >
                Pay Monthly ($15/mo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Portfolio Modal */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setPortfolioModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-950">Publish Portfolio Website</h3>
              <p className="text-xs text-gray-500">
                Choose a unique subdomain for your public portfolio site.
              </p>
            </div>

            <form onSubmit={handlePublishPortfolio} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Subdomain Name
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 text-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="text"
                    placeholder="john-doe"
                    value={subdomainInput}
                    onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    required
                    className="w-full focus:outline-none text-sm font-medium"
                  />
                  <span className="text-xs text-gray-400 font-mono font-bold whitespace-nowrap pl-2">
                    .resumeai.site
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}
              >
                Publish Portfolio Now →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
