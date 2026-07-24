"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getMyResumes,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from "@/services/resumeService";
import { parsePdfResume } from "@/services/aiService";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/services/billingService";
import PortfolioCustomizer from "@/components/portfolio/PortfolioCustomizer";
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  Edit,
  Sparkles,
  LogOut,
  TrendingUp,
  Award,
  ShieldCheck,
  Check,
  RefreshCw,
  CreditCard,
  Upload,
} from "lucide-react";

interface User {
  name?: string;
  email?: string;
  isPro?: boolean;
}

interface Resume {
  _id: string;
  title: string;
  template: string;
  createdAt: string;
}

// Dynamically load Razorpay Checkout SDK script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User>({});
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const dashboardFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.isPro) {
        setIsPro(true);
        localStorage.setItem("pro_member", "true");
      }
    }

    if (localStorage.getItem("pro_member") === "true") {
      setIsPro(true);
    }

    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await getMyResumes();
      setResumes(response.resumes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const response = await createResume();
      router.push(`/resume/${response.resume._id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create resume");
    }
  };

  const handleImportDashboardResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
        const parseRes = await parsePdfResume(file);
        if (parseRes.success && parseRes.resume) {
          const parsed = parseRes.resume;
          const createdRes = await createResume(parsed.title || "Uploaded PDF Resume");
          const resumeId = createdRes.resume._id;
          await updateResume(resumeId, parsed);
          router.push(`/resume/${resumeId}`);
          return;
        } else {
          alert("Failed to parse PDF resume.");
        }
      } else {
        const text = await file.text();
        const json = JSON.parse(text);
        const createdRes = await createResume(json.title || "Imported JSON Resume");
        const resumeId = createdRes.resume._id;
        await updateResume(resumeId, json);
        router.push(`/resume/${resumeId}`);
        return;
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to import resume file. Make sure it has readable text.");
    } finally {
      setUploadingPdf(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResume(id);
      loadResumes();
    } catch (error) {
      console.error(error);
      alert("Failed to delete resume");
    }
  };

  const handleDuplicateResume = async (id: string) => {
    try {
      await duplicateResume(id);
      loadResumes();
    } catch (error) {
      console.error(error);
      alert("Failed to duplicate resume");
    }
  };

  const handleEditResume = (id: string) => {
    router.push(`/resume/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pro_member");
    router.push("/login");
  };

  const handleUpgradeToPro = async () => {
    setUpgrading(true);
    try {
      // 1. Load Checkout SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load payment gateway script. Please verify internet connection.");
        setUpgrading(false);
        return;
      }

      // 2. Request backend order creation
      const res = await createRazorpayOrder();
      
      if (res.demoMode) {
        // Fallback demo setup for local development
        setTimeout(async () => {
          await verifyRazorpayPayment({
            razorpay_order_id: res.order.id,
            razorpay_payment_id: "pay_demo_success",
            razorpay_signature: "sig_demo_success",
          });
          setIsPro(true);
          localStorage.setItem("pro_member", "true");
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            parsed.isPro = true;
            localStorage.setItem("user", JSON.stringify(parsed));
          }
          setUpgrading(false);
          setShowUpgradeModal(false);
          alert("✅ Pro Activated! (Demo mode — add RAZORPAY_KEY_ID in backend env for live UPI/Cards payments)");
        }, 1500);
        return;
      }

      // 3. Open Razorpay live overlay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_id",
        amount: res.order.amount,
        currency: res.order.currency,
        name: "ResumeAI Pro Plan",
        description: "Access to 8 Premium Templates, Cover Letter AI, & Portfolio Sites hosting",
        order_id: res.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment signature
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setIsPro(true);
            localStorage.setItem("pro_member", "true");
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              parsed.isPro = true;
              localStorage.setItem("user", JSON.stringify(parsed));
            }
            setShowUpgradeModal(false);
            alert("🎉 Awesome! Your account is upgraded to ResumeAI Pro.");
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#2563eb", // Royal blue
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setUpgrading(false);
    } catch (error: any) {
      console.error("Razorpay order setup error:", error);
      alert("Payment checkout failed. Please try again.");
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-500">Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Banner Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              R
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900">ResumeAI</h1>
              <p className="text-xs text-gray-400 font-semibold">SaaS Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500 font-medium">{user.email}</div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 border rounded-lg text-gray-400 hover:text-red-600 hover:border-red-100 transition shadow-sm cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Resumes</span>
            <div className="text-2xl font-black text-gray-900">{resumes.length}</div>
          </div>
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Templates Used</span>
            <div className="text-2xl font-black text-gray-900">
              {Array.from(new Set(resumes.map((r) => r.template))).length}
            </div>
          </div>
          <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shadow-inner">
            <Award className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Hits</span>
            <div className="text-2xl font-black text-gray-900">128 views</div>
          </div>
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-inner">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Member Tier Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Plan</span>
            <div className="text-xl font-black tracking-tight flex items-center gap-1.5">
              {isPro ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-yellow-400" />
                  Pro Member
                </>
              ) : (
                "Free Tier"
              )}
            </div>
          </div>
          {!isPro && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold rounded-lg text-xs transition cursor-pointer shadow-md shadow-yellow-500/20"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Main Layout sections */}
      <div className="max-w-6xl w-full mx-auto px-6 py-8 space-y-8 flex-grow">
        {/* Resumes Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-gray-900">My Saved Resumes</h2>
            <div className="flex items-center gap-2.5">
              <input
                type="file"
                ref={dashboardFileInputRef}
                onChange={handleImportDashboardResume}
                accept=".json,.pdf,application/json,application/pdf"
                className="hidden"
              />
              <button
                onClick={() => dashboardFileInputRef.current?.click()}
                disabled={uploadingPdf}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {uploadingPdf ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                    <span>Parsing PDF...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-blue-600" />
                    <span>Upload Resume (PDF/JSON)</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCreateResume}
                className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md shadow-blue-100"
              >
                <Plus className="h-4 w-4" />
                Create Resume
              </button>
            </div>
          </div>

          {resumes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center shadow-sm">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No Resumes Found</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Start by creating your first CV document. You can customize layout and contents live.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition group relative"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-md font-bold text-gray-950 truncate pr-6">
                      {resume.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Template:
                      </span>
                      <span className="text-[10px] font-semibold text-gray-600 uppercase">
                        {resume.template || "modern"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-50 flex gap-2">
                    <button
                      onClick={() => handleEditResume(resume._id)}
                      className="flex-1 py-2 border border-gray-100 hover:border-blue-500 hover:text-blue-600 bg-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateResume(resume._id)}
                      className="p-2 border border-gray-100 hover:border-gray-300 rounded-lg text-gray-400 hover:text-gray-900 transition shadow-sm cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume._id)}
                      className="p-2 border border-gray-100 hover:border-red-200 rounded-lg text-gray-400 hover:text-red-600 transition shadow-sm cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Site section */}
        <PortfolioCustomizer resumes={resumes} />
      </div>

      {/* Upgrade Modal — Razorpay checkout integration */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 border shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-gray-950">Upgrade to ResumeAI Pro</h3>
              <p className="text-xs text-gray-400">
                Unlock all premium features, templates, custom subdomains, and AI optimization tools.
              </p>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 border-b pb-2">
                <span>ResumeAI Pro Membership</span>
                <span className="text-sm font-bold text-gray-950">₹999 / year</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 pt-1 font-medium">
                <li className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-green-600" />
                  Access to all 8 Premium Templates
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-green-600" />
                  Unlimited Resume PDFs and Live Websites
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-green-600" />
                  Personalized Subdomain + Public Portfolio Hosting
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-green-600" />
                  Advanced Gemini AI Copilot Toolkit
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUpgradeToPro}
                disabled={upgrading}
                className="w-full py-3.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
              >
                {upgrading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Opening Checkout Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay via Gateway — ₹499/yr
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleUpgradeToPro}
                className="w-full py-3 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                📲 Pay via PhonePe / GPay / UPI QR Code
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-400">
              Instant activation via PhonePe, GPay, Paytm, or Cards.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-500">Loading Dashboard...</p>
        </div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}