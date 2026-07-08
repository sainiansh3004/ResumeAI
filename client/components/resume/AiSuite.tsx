"use client";

import React, { useState, useEffect } from "react";
import { Resume } from "@/types/resume";
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Plus,
  Copy,
  Check,
  Wand2,
  FileText,
  RefreshCw,
} from "lucide-react";
import {
  generateSummary,
  optimizeExperience,
  generateCoverLetter,
  recommendSkills,
} from "@/services/aiService";

interface AiSuiteProps {
  resume: Resume;
  onUpdateResume: (updatedResume: Partial<Resume>) => void;
}

export default function AiSuite({ resume, onUpdateResume }: AiSuiteProps) {
  const [activeTab, setActiveTab] = useState<"ats" | "ai">("ats");
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // ATS Scoring Logic
  const [atsScore, setAtsScore] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // AI State
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [skillsSuggestions, setSkillsSuggestions] = useState<string[]>([]);
  const [rawExperience, setRawExperience] = useState("");
  const [optimizedExperience, setOptimizedExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // Calculate ATS Score whenever resume updates
  useEffect(() => {
    let score = 0;
    const list: string[] = [];

    // 1. Personal Info & Contacts (max 20)
    let contactScore = 0;
    if (resume.personalInfo?.fullName) contactScore += 5;
    if (resume.personalInfo?.email) contactScore += 5;
    if (resume.personalInfo?.phone) contactScore += 5;
    if (resume.personalInfo?.address) contactScore += 5;
    score += contactScore;

    if (!resume.personalInfo?.fullName) list.push("Add your full name.");
    if (!resume.personalInfo?.email) list.push("Add your email address for recruiters.");
    if (!resume.personalInfo?.phone) list.push("Add your phone number for contact.");
    if (!resume.personalInfo?.address) list.push("Include your location/city.");

    // 2. Summary (max 15)
    const summaryWordCount = resume.personalInfo?.summary?.split(/\s+/).filter(Boolean).length || 0;
    if (summaryWordCount >= 30) {
      score += 15;
    } else if (summaryWordCount > 0) {
      score += 8;
      list.push("Expand your summary to at least 30 words for ATS impact.");
    } else {
      list.push("Add a professional summary statement summarizing your value.");
    }

    // 3. Experience (max 30)
    if (resume.experience?.length > 0) {
      score += 15;
      // check descriptions
      const hasGoodDescriptions = resume.experience.every(
        (exp) => (exp.description?.split(/\s+/).filter(Boolean).length || 0) >= 20
      );
      if (hasGoodDescriptions) {
        score += 15;
      } else {
        score += 7;
        list.push("Provide detailed bullet points (20+ words) for all work experience items.");
      }
    } else {
      list.push("Add at least one professional work experience record.");
    }

    // 4. Skills (max 15)
    if (resume.skills?.length >= 8) {
      score += 15;
    } else if (resume.skills?.length >= 3) {
      score += 8;
      list.push("Add more skills (aim for 8+ tech/soft skills) for keyphrase matching.");
    } else {
      list.push("Include a strong set of industry and technical skills.");
    }

    // 5. Projects (max 10)
    if (resume.projects?.length >= 2) {
      score += 10;
    } else if (resume.projects?.length > 0) {
      score += 5;
      list.push("Add a second project to showcase practical application of your skills.");
    } else {
      list.push("Add details of key projects you built or worked on.");
    }

    // 6. Education (max 10)
    if (resume.education?.length > 0) {
      score += 10;
    } else {
      list.push("Include your college education credentials.");
    }

    setAtsScore(score);
    setRecommendations(list);
  }, [resume]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // AI Functions
  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const res = await generateSummary(resume);
      if (res.success) {
        setAiSummary(res.summary);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySummary = () => {
    if (!aiSummary) return;
    onUpdateResume({
      personalInfo: {
        ...resume.personalInfo,
        summary: aiSummary,
      },
    });
    alert("AI Summary applied to your resume!");
  };

  const handleRecommendSkills = async () => {
    if (!targetJobTitle) {
      alert("Please enter a target job title");
      return;
    }
    setLoading(true);
    try {
      const res = await recommendSkills(resume.skills || [], targetJobTitle);
      if (res.success) {
        setSkillsSuggestions(res.skills);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to suggest skills");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    const current = resume.skills || [];
    if (!current.includes(skill)) {
      const updated = [...current, skill];
      onUpdateResume({ skills: updated });
      setSkillsSuggestions((prev) => prev.filter((s) => s !== skill));
    }
  };

  const handleOptimizeExperience = async () => {
    if (!rawExperience) {
      alert("Please enter an experience description to optimize");
      return;
    }
    setLoading(true);
    try {
      const res = await optimizeExperience(rawExperience, targetJobTitle);
      if (res.success) {
        setOptimizedExperience(res.optimized);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to optimize experience");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setLoading(true);
    try {
      const res = await generateCoverLetter(resume, jobDescription);
      if (res.success) {
        setCoverLetter(res.coverLetter);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      {/* Tab Selector */}
      <div className="flex rounded-lg bg-gray-50 p-1 border border-gray-100">
        <button
          onClick={() => setActiveTab("ats")}
          className={`flex-1 flex justify-center items-center gap-1.5 py-2.5 text-sm font-semibold rounded-md transition ${
            activeTab === "ats"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Cpu className="h-4 w-4" />
          ATS Score Card
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 flex justify-center items-center gap-1.5 py-2.5 text-sm font-semibold rounded-md transition ${
            activeTab === "ai"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Gemini Copilot
        </button>
      </div>

      {/* Tab Content 1: ATS SCORE */}
      {activeTab === "ats" && (
        <div className="space-y-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              Overall ATS Score
            </h3>
            <div className="relative inline-flex items-center justify-center">
              <span className={`text-5xl font-black ${
                atsScore >= 80 ? "text-green-600" : atsScore >= 50 ? "text-yellow-600" : "text-red-500"
              }`}>
                {atsScore}%
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Based on standard Applicant Tracking System parser audits.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Action Items ({recommendations.length})
            </h4>

            {recommendations.length > 0 ? (
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-2 items-start text-xs text-gray-600 leading-normal p-2.5 bg-red-50/30 rounded-lg border border-red-50/50">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex gap-2 items-center text-xs text-green-700 bg-green-50/50 border border-green-100 p-4 rounded-xl font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                Excellent job! Your resume hits all core ATS criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: GEMINI COPILOT */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          {/* Target Role Input */}
          <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-50 space-y-3">
            <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide">
              Target Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Section A: AI Summary Generator */}
          <div className="border-t pt-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center justify-between">
              Professional Summary
              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                Generate Summary
              </button>
            </h4>

            {aiSummary && (
              <div className="space-y-2 p-3 bg-gray-50 border rounded-lg">
                <p className="text-xs text-gray-600 leading-relaxed text-justify">
                  {aiSummary}
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t text-xs">
                  <button
                    onClick={() => handleCopy(aiSummary)}
                    className="px-2.5 py-1 border rounded bg-white hover:bg-gray-50 text-gray-600 font-medium flex items-center gap-1"
                  >
                    {copiedText ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    Copy
                  </button>
                  <button
                    onClick={handleApplySummary}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1"
                  >
                    Use Summary
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Skill Recommender */}
          <div className="border-t pt-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center justify-between">
              Skill Recommendations
              <button
                onClick={handleRecommendSkills}
                disabled={loading || !targetJobTitle}
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                Find Skills
              </button>
            </h4>

            {skillsSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 border rounded-lg">
                {skillsSuggestions.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddSkill(skill)}
                    className="bg-white border text-gray-700 text-[10px] px-2 py-0.5 rounded font-semibold hover:border-blue-500 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section C: Experience Bullet Optimizer */}
          <div className="border-t pt-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-900">
              Optimize Experience Bullet
            </h4>
            <textarea
              rows={2}
              placeholder="Paste draft experience description here..."
              value={rawExperience}
              onChange={(e) => setRawExperience(e.target.value)}
              className="w-full text-xs rounded-lg border border-gray-200 bg-white p-2.5 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleOptimizeExperience}
              disabled={loading || !rawExperience}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
              Optimize Bullet Points
            </button>

            {optimizedExperience && (
              <div className="space-y-2 p-3 bg-gray-50 border rounded-lg">
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                  {optimizedExperience}
                </p>
                <div className="flex justify-end pt-2 border-t">
                  <button
                    onClick={() => handleCopy(optimizedExperience)}
                    className="px-2.5 py-1 border rounded bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section D: Cover Letter Writer */}
          <div className="border-t pt-5 space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
              <FileText className="h-4 w-4 text-blue-600" />
              Tailored Cover Letter
            </h4>
            <textarea
              rows={3}
              placeholder="Paste target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full text-xs rounded-lg border border-gray-200 bg-white p-2.5 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleGenerateCoverLetter}
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
              Write Cover Letter
            </button>

            {coverLetter && (
              <div className="space-y-2 p-3 bg-gray-50 border rounded-lg">
                <textarea
                  readOnly
                  rows={8}
                  value={coverLetter}
                  className="w-full bg-white border border-gray-100 text-xs p-2 text-gray-600 leading-relaxed font-sans focus:outline-none"
                />
                <div className="flex justify-end pt-2 border-t">
                  <button
                    onClick={() => handleCopy(coverLetter)}
                    className="px-2.5 py-1 border rounded bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
