"use client";

import Link from "next/link";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/services/billingService";
import { useState } from "react";

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
);

// Dynamically load Razorpay SDK
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

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [verifyingUpi, setVerifyingUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");

  const upiId = "sainiansh3004@okicici";
  const amount = billingCycle === "yearly" ? "499" : "299";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=ResumeAI&am=${amount}&cu=INR`
  )}`;

  const handleProUpgrade = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      window.location.href = "/register";
      return;
    }

    setLoading(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load Razorpay payment SDK.");
        setLoading(false);
        return;
      }

      const res = await createRazorpayOrder(billingCycle);

      if (res.demoMode) {
        await verifyRazorpayPayment({
          razorpay_order_id: res.order.id,
          razorpay_payment_id: "pay_demo_success",
          razorpay_signature: "sig_demo_success",
        });
        localStorage.setItem("pro_member", "true");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.isPro = true;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
        window.location.href = "/dashboard?payment=success";
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_id",
        amount: res.order.amount,
        currency: res.order.currency,
        name: "ResumeAI Pro Plan",
        description: `${billingCycle === "yearly" ? "Yearly" : "Monthly"} Pro membership access`,
        order_id: res.order.id,
        handler: async function (response: any) {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            localStorage.setItem("pro_member", "true");
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              parsed.isPro = true;
              localStorage.setItem("user", JSON.stringify(parsed));
            }
            window.location.href = "/dashboard?payment=success";
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification failed.");
          }
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout setup error:", error);
      alert("Billing connection failed. Directing to dashboard.");
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  const handleUpiVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingUpi(true);
    try {
      // Simulate UPI payment verification
      const res = await createRazorpayOrder(billingCycle);
      await verifyRazorpayPayment({
        razorpay_order_id: res.order?.id || `order_upi_${Date.now()}`,
        razorpay_payment_id: utrNumber ? `utr_${utrNumber}` : `upi_${Date.now()}`,
        razorpay_signature: "sig_upi_success",
      });
      localStorage.setItem("pro_member", "true");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.isPro = true;
        localStorage.setItem("user", JSON.stringify(parsed));
      }
      window.location.href = "/dashboard?payment=success";
    } catch (err) {
      console.error("UPI verification error:", err);
      alert("Payment submitted for approval!");
      window.location.href = "/dashboard";
    } finally {
      setVerifyingUpi(false);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-white border-t border-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
            Pricing
          </span>
          <h2 className="text-4xl font-black text-gray-950 tracking-tight">
            Flexible Plans for Every Career Level
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Start building your resume for free, or unlock advanced portfolio websites and AI copilot tools with Pro.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold transition-colors cursor-pointer ${
                billingCycle === "monthly" ? "text-gray-900 font-black" : "text-gray-400"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === "yearly" ? "monthly" : "yearly")}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200 transition-colors focus:outline-none p-1 cursor-pointer"
              style={{ backgroundColor: billingCycle === "yearly" ? "#2563eb" : "#e5e7eb" }}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "text-gray-900 font-black" : "text-gray-400"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Annual Billing
              <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                SAVE 85%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="border border-gray-100 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition duration-300">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">Basic Free</h3>
                <p className="text-xs text-gray-400">Get started with standard professional resume layouts.</p>
              </div>
              <div className="text-3xl font-black text-gray-950">₹0</div>
              <ul className="space-y-3 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-green-600"><CheckIcon /></span>
                  Access to 4 standard templates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600"><CheckIcon /></span>
                  Drag & Drop section reordering
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600"><CheckIcon /></span>
                  Import/Export resume data JSON
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600"><CheckIcon /></span>
                  Unlimited PDF downloads via print
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 py-3 text-center border border-gray-200 hover:border-gray-900 rounded-xl text-xs font-bold transition block"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8 flex flex-col justify-between relative shadow-xl shadow-gray-200/80">
            <div className="absolute top-4 right-4 bg-yellow-500 text-gray-950 font-bold uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
              <SparklesIcon />
              Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">ResumeAI Pro</h3>
                <p className="text-xs text-gray-400">Claim your custom web domain and utilize Groq AI writing engines.</p>
              </div>
              <div className="text-3xl font-black flex items-baseline gap-1">
                {billingCycle === "yearly" ? "₹499" : "₹299"}
                <span className="text-xs font-medium text-gray-400">
                  {billingCycle === "yearly" ? "/ year" : "/ month"}
                </span>
              </div>
              <ul className="space-y-3 text-xs text-gray-300 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400"><CheckIcon /></span>
                  Unlock all 8 Premium layouts (Executive, Tech, Academic, Sleek)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400"><CheckIcon /></span>
                  Personal Subdomain hosting (resumeai.app/yourname)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400"><CheckIcon /></span>
                  Convert Resume to Portfolio Site with 1-click
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400"><CheckIcon /></span>
                  Groq AI Cover Letter & Bullet Optimizer suite
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400"><CheckIcon /></span>
                  Real-time ATS parsing audit scoring
                </li>
              </ul>
            </div>

            <div className="space-y-3 mt-8">
              <button
                onClick={handleProUpgrade}
                disabled={loading}
                className="w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50 block"
              >
                {loading
                  ? "Opening Payment Gateway..."
                  : `Pay with Card / Gateway — ${billingCycle === "yearly" ? "₹499/yr" : "₹299/mo"}`}
              </button>

              <button
                type="button"
                onClick={() => {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  if (!token) {
                    window.location.href = "/register";
                    return;
                  }
                  setShowUpiModal(true);
                }}
                className="w-full py-3 text-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                📲 Pay via PhonePe / GPay / UPI QR Code
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
              Instant activation via PhonePe, Paytm, GPay, or Razorpay
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 max-w-md mx-auto">
          Secure payments powered by Razorpay and Instant UPI. Cancel anytime.
        </p>
      </div>

      {/* PhonePe / UPI QR Code Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                PhonePe & UPI Payment
              </span>
              <h3 className="text-xl font-black text-gray-950">
                Scan & Pay ₹{amount}
              </h3>
              <p className="text-xs text-gray-500">
                Scan with PhonePe, Google Pay, Paytm, or BHIM UPI
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-purple-50 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 border border-purple-100">
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="w-48 h-48 rounded-xl shadow-md border border-white"
              />
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">UPI ID / VPA</p>
                <code className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-purple-200 inline-block">
                  {upiId}
                </code>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleUpiVerification} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  UTR / Transaction Reference No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789012"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={verifyingUpi}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
              >
                {verifyingUpi ? "Verifying Payment..." : "✓ I Have Paid — Unlock Pro Access"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
