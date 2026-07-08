"use client";

import React, { useState, useEffect } from "react";
import { getMyPortfolio, createOrUpdatePortfolio, convertResumeToPortfolio } from "@/services/portfolioService";
import { Globe, RefreshCw, Eye, Sparkles, Check, CheckCircle } from "lucide-react";

interface ResumeOption {
  _id: string;
  title: string;
}

interface PortfolioCustomizerProps {
  resumes: ResumeOption[];
}

export default function PortfolioCustomizer({ resumes }: PortfolioCustomizerProps) {
  const [loading, setLoading] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("modern");
  const [themeColor, setThemeColor] = useState("blue");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [portfolio, setPortfolio] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const res = await getMyPortfolio();
      if (res.success && res.portfolio) {
        setPortfolio(res.portfolio);
        setSubdomain(res.portfolio.subdomain || "");
        setTitle(res.portfolio.title || "");
        setTheme(res.portfolio.theme || "modern");
        setThemeColor(res.portfolio.themeColor || "blue");
      }
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain) {
      alert("Subdomain is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await createOrUpdatePortfolio({
        subdomain,
        title,
        theme,
        themeColor,
      });

      if (res.success) {
        setPortfolio(res.portfolio);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save portfolio settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncResume = async () => {
    if (!selectedResumeId) {
      alert("Please select a resume to sync from.");
      return;
    }
    if (!subdomain) {
      alert("Please claim a subdomain first.");
      return;
    }

    setLoading(true);
    try {
      const res = await convertResumeToPortfolio(selectedResumeId, subdomain);
      if (res.success) {
        setPortfolio(res.portfolio);
        alert("Resume synced into portfolio website successfully!");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to sync resume.");
    } finally {
      setLoading(false);
    }
  };

  const portfolioUrl = subdomain
    ? `${window.location.protocol}//${window.location.host}/portfolio/${subdomain}`
    : "";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
      <div>
        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          Personal Portfolio Builder
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Turn your resume into a gorgeous personal website with custom subdomains and dynamic themes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Claim Subdomain
            </label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden shadow-sm focus-within:border-blue-500 transition">
              <span className="bg-gray-50 text-gray-500 text-sm px-3 py-2 border-r select-none">
                resumeai.app/
              </span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase())}
                placeholder="john-doe"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                required
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Only alphanumeric characters and hyphens allowed.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Website Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. John Doe | Senior Developer"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Website Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none shadow-sm"
              >
                <option value="modern">Modern Professional</option>
                <option value="sleek">Sleek Grid</option>
                <option value="minimal">Minimal Elegant</option>
                <option value="creative">Creative Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Accent Color
              </label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none shadow-sm"
              >
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition flex items-center gap-1.5 shadow-md shadow-blue-100 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : saveSuccess ? <Check className="h-4 w-4" /> : null}
            {saveSuccess ? "Settings Saved" : "Save & Update Subdomain"}
          </button>
        </form>

        {/* Sync/Conversion Card */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
              Convert Resume to Website
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Instantly sync your resume profile (experiences, projects, skills, education) into your website template content.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Select Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none shadow-sm"
              >
                <option value="">-- Choose Resume --</option>
                {resumes.map((res) => (
                  <option key={res._id} value={res._id}>
                    {res.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSyncResume}
            disabled={loading || !selectedResumeId || !subdomain}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-md shadow-blue-100"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync Resume Content to Site
          </button>
        </div>
      </div>

      {/* Portfolio Status and Live Links */}
      {portfolio && (
        <div className="border-t pt-6 grid md:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100 shadow-inner">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Website Views</div>
              <div className="text-lg font-black text-gray-900">{portfolio.views || 0} hits</div>
            </div>
          </div>

          <div className="flex md:justify-end">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-gray-200 hover:border-blue-500 hover:text-blue-600 bg-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Globe className="h-3.5 w-3.5" />
              Visit Live Website
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
