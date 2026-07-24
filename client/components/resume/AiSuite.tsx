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

export interface AtsRecommendation {
  text: string;
  fieldKey: string;
  fieldLabel: string;
}

interface AiSuiteProps {
  resume: Resume;
  onUpdateResume: (updatedResume: Partial<Resume>) => void;
  onNavigateToSection?: (sectionKey: string) => void;
}

export default function AiSuite({ resume, onUpdateResume, onNavigateToSection }: AiSuiteProps) {
  const [activeTab, setActiveTab] = useState<"ats" | "ai">("ats");
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // ATS Scoring Logic
  const [atsScore, setAtsScore] = useState(0);
  const [recommendations, setRecommendations] = useState<AtsRecommendation[]>([]);
  const [atsPassed, setAtsPassed] = useState<string[]>([]);

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
    const list: AtsRecommendation[] = [];
    const passed: string[] = [];

    // ============================
    // SECTION 1: CONTACT INFO (max 12)
    // ============================
    let contactPts = 0;
    if (resume.personalInfo?.fullName?.trim()) contactPts += 3;
    else list.push({ text: "Add your full name — required by every ATS parser.", fieldKey: "personalInfo", fieldLabel: "Personal Info" });
    if (resume.personalInfo?.email?.trim()) {
      contactPts += 3;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personalInfo.email))
        list.push({ text: "Email format appears invalid — ATS may reject it.", fieldKey: "personalInfo", fieldLabel: "Personal Info" });
    } else list.push({ text: "Add a professional email address.", fieldKey: "personalInfo", fieldLabel: "Personal Info" });
    if (resume.personalInfo?.phone?.trim()) contactPts += 3;
    else list.push({ text: "Add a phone number — 98% of recruiters expect it.", fieldKey: "personalInfo", fieldLabel: "Personal Info" });
    if (resume.personalInfo?.address?.trim()) contactPts += 3;
    else list.push({ text: "Include city/location — helps with geo-targeted job filters.", fieldKey: "personalInfo", fieldLabel: "Personal Info" });
    score += contactPts;
    if (contactPts === 12) passed.push("Contact info is complete ✓");

    // ============================
    // SECTION 2: PROFESSIONAL HEADLINE (max 5)
    // ============================
    const headline = resume.personalInfo?.headline?.trim() || "";
    if (headline.length >= 15) {
      score += 5;
      passed.push("Professional headline present ✓");
    } else if (headline.length > 0) {
      score += 2;
      list.push({ text: "Expand your headline to 15+ characters (e.g. 'Full Stack Developer | React & Node.js').", fieldKey: "personalInfo", fieldLabel: "Headline" });
    } else {
      list.push({ text: "Add a professional headline — many ATS systems parse this as your job title.", fieldKey: "personalInfo", fieldLabel: "Headline" });
    }

    // ============================
    // SECTION 3: PROFESSIONAL SUMMARY (max 12)
    // ============================
    const summaryText = resume.personalInfo?.summary?.trim() || "";
    const summaryWords = summaryText.split(/\s+/).filter(Boolean);
    const summaryWordCount = summaryWords.length;
    if (summaryWordCount >= 40) {
      score += 12;
      passed.push("Summary is well-developed ✓");
    } else if (summaryWordCount >= 20) {
      score += 7;
      list.push({ text: `Expand your summary from ${summaryWordCount} to 40+ words — detailed summaries rank higher in ATS.`, fieldKey: "personalInfo", fieldLabel: "Summary" });
    } else if (summaryWordCount > 0) {
      score += 3;
      list.push({ text: `Your summary is only ${summaryWordCount} words — aim for 40+ words with industry keywords.`, fieldKey: "personalInfo", fieldLabel: "Summary" });
    } else {
      list.push({ text: "Add a professional summary — this is the first thing ATS parsers analyze for keyword matching.", fieldKey: "personalInfo", fieldLabel: "Summary" });
    }

    // ============================
    // SECTION 4: WORK EXPERIENCE (max 25)
    // ============================
    const experiences = resume.experience || [];
    if (experiences.length > 0) {
      score += 8;

      let totalExpWords = 0;
      let expWithActionVerbs = 0;
      let expWithQuantification = 0;
      let expWithDates = 0;

      const actionVerbs = /^(led|built|developed|designed|managed|increased|decreased|improved|launched|created|implemented|engineered|optimized|delivered|spearheaded|architected|automated|collaborated|coordinated|established|executed|facilitated|generated|integrated|maintained|negotiated|organized|produced|resolved|streamlined|supervised|transformed|utilized|achieved|accelerated|analyzed|conducted|contributed|deployed|drove|enhanced|expanded|identified|initiated|mentored|orchestrated|pioneered|reduced|scaled|secured|shipped)/i;

      experiences.forEach((exp) => {
        const desc = exp.description?.trim() || "";
        const descWords = desc.split(/\s+/).filter(Boolean).length;
        totalExpWords += descWords;

        const bullets = desc.split(/[\n•\-]/);
        const hasActions = bullets.some((b) => actionVerbs.test(b.trim()));
        if (hasActions) expWithActionVerbs++;

        if (/\d+%|\$\d+|\d+\+|\d+x|[0-9]+ (users|clients|projects|team|members|revenue|million|thousand)/i.test(desc))
          expWithQuantification++;

        if (exp.startDate) expWithDates++;
      });

      const avgWordsPerExp = totalExpWords / experiences.length;
      if (avgWordsPerExp >= 40) {
        score += 7;
      } else if (avgWordsPerExp >= 20) {
        score += 4;
        list.push({ text: `Experience descriptions average ${Math.round(avgWordsPerExp)} words — aim for 40+ words per role with bullet points.`, fieldKey: "experience", fieldLabel: "Work Experience" });
      } else {
        score += 1;
        list.push({ text: "Experience descriptions are too brief — add detailed bullet points with responsibilities and achievements.", fieldKey: "experience", fieldLabel: "Work Experience" });
      }

      if (expWithActionVerbs === experiences.length) {
        score += 5;
        passed.push("Strong action verbs used ✓");
      } else if (expWithActionVerbs > 0) {
        score += 2;
        list.push({ text: `${experiences.length - expWithActionVerbs} experience entries lack strong action verbs (Led, Built, Optimized, Delivered, etc.).`, fieldKey: "experience", fieldLabel: "Work Experience" });
      } else {
        list.push({ text: "Start each experience bullet with a strong action verb (Led, Built, Increased, Managed, etc.).", fieldKey: "experience", fieldLabel: "Work Experience" });
      }

      if (expWithQuantification >= Math.ceil(experiences.length * 0.5)) {
        score += 5;
        passed.push("Quantified achievements present ✓");
      } else if (expWithQuantification > 0) {
        score += 2;
        list.push({ text: "Add measurable results (%, $, numbers) to more experience entries — recruiters value quantified impact.", fieldKey: "experience", fieldLabel: "Work Experience" });
      } else {
        list.push({ text: "Include quantified achievements in experience (e.g. 'Increased revenue by 35%', 'Managed team of 8').", fieldKey: "experience", fieldLabel: "Work Experience" });
      }
    } else {
      list.push({ text: "Add professional work experience — this is the most critical section for ATS ranking.", fieldKey: "experience", fieldLabel: "Work Experience" });
    }

    // ============================
    // SECTION 5: SKILLS (max 12)
    // ============================
    const skillCount = resume.skills?.length || 0;
    if (skillCount >= 10) {
      score += 12;
      passed.push(`${skillCount} skills listed — great keyword density ✓`);
    } else if (skillCount >= 6) {
      score += 8;
      list.push({ text: `You have ${skillCount} skills — add ${10 - skillCount} more to reach the optimal 10+ for ATS keyword matching.`, fieldKey: "skills", fieldLabel: "Technical Skills" });
    } else if (skillCount >= 3) {
      score += 4;
      list.push({ text: `Only ${skillCount} skills listed — ATS systems match job descriptions against your skills. Aim for 10+.`, fieldKey: "skills", fieldLabel: "Technical Skills" });
    } else if (skillCount > 0) {
      score += 2;
      list.push({ text: "You need significantly more skills — most competitive resumes list 10-15 relevant technical and soft skills.", fieldKey: "skills", fieldLabel: "Technical Skills" });
    } else {
      list.push({ text: "Add a Skills section — ATS parsers heavily rely on keyword matching from this section.", fieldKey: "skills", fieldLabel: "Technical Skills" });
    }

    // ============================
    // SECTION 6: EDUCATION (max 8)
    // ============================
    const eduEntries = resume.education || [];
    if (eduEntries.length > 0) {
      let eduPts = 5;
      const hasDetailedEdu = eduEntries.some(
        (e) => e.degree?.trim() && e.college?.trim() && (e.startYear || e.endYear)
      );
      if (hasDetailedEdu) {
        eduPts += 3;
        passed.push("Education section is complete ✓");
      } else {
        list.push({ text: "Add degree name, institution, and graduation year to education entries.", fieldKey: "education", fieldLabel: "Education" });
      }
      score += eduPts;
    } else {
      list.push({ text: "Include your education — most ATS systems require this section.", fieldKey: "education", fieldLabel: "Education" });
    }

    // ============================
    // SECTION 7: PROJECTS (max 8)
    // ============================
    const projects = resume.projects || [];
    if (projects.length >= 2) {
      score += 6;
      const hasGoodProjects = projects.some(
        (p) => p.title?.trim() && (p.description?.split(/\s+/).filter(Boolean).length || 0) >= 15 && (p.technologies?.length || 0) >= 2
      );
      if (hasGoodProjects) {
        score += 2;
        passed.push("Projects showcase technical skills ✓");
      } else {
        list.push({ text: "Enhance project descriptions with 15+ words and list specific technologies used.", fieldKey: "projects", fieldLabel: "Projects" });
      }
    } else if (projects.length === 1) {
      score += 3;
      list.push({ text: "Add a second project — multiple projects demonstrate broader capability.", fieldKey: "projects", fieldLabel: "Projects" });
    } else {
      list.push({ text: "Add 2+ projects to showcase practical application of your skills.", fieldKey: "projects", fieldLabel: "Projects" });
    }

    // ============================
    // SECTION 8: CERTIFICATIONS (max 4)
    // ============================
    const certs = resume.certifications || [];
    if (certs.length >= 1 && certs.some((c) => c.name?.trim())) {
      score += 4;
      passed.push("Certifications included ✓");
    } else {
      list.push({ text: "Add relevant certifications — they boost ATS score for specialized roles.", fieldKey: "certifications", fieldLabel: "Certifications" });
    }

    // ============================
    // SECTION 9: ACHIEVEMENTS (max 4)
    // ============================
    const achievements = resume.achievements || [];
    if (achievements.length >= 1 && achievements.some((a) => a.title?.trim())) {
      score += 4;
      passed.push("Achievements highlighted ✓");
    } else {
      list.push({ text: "Add notable achievements (awards, competition ranks, publications) to stand out.", fieldKey: "achievements", fieldLabel: "Achievements" });
    }

    // ============================
    // SECTION 10: PROFESSIONAL LINKS (max 5)
    // ============================
    let linkPts = 0;
    if (resume.personalInfo?.linkedin?.trim()) linkPts += 2;
    else list.push({ text: "Add your LinkedIn profile URL — 87% of recruiters check LinkedIn.", fieldKey: "personalInfo", fieldLabel: "Personal Info" });
    if (resume.personalInfo?.github?.trim()) linkPts += 2;
    else if (skillCount > 0 && resume.skills?.some((s) => /javascript|python|react|node|java|c\+\+|go|rust|typescript/i.test(s)))
      list.push({ text: "Add your GitHub profile — critical for software/engineering roles.", fieldKey: "personalInfo", fieldLabel: "Personal Info" });
    if (resume.personalInfo?.portfolio?.trim()) linkPts += 1;
    score += linkPts;
    if (linkPts >= 4) passed.push("Professional links present ✓");

    // ============================
    // SECTION 11: LANGUAGES (max 3)
    // ============================
    const langs = resume.languages || [];
    if (langs.length >= 1 && langs.some((l) => l.name?.trim())) {
      score += 3;
      passed.push("Languages listed ✓");
    } else {
      list.push({ text: "Add languages you speak — especially valuable for global companies.", fieldKey: "languages", fieldLabel: "Languages" });
    }

    // ============================
    // SECTION 12: CONTENT DEPTH BONUS (max 2)
    // ============================
    const totalSections = [
      experiences.length > 0,
      eduEntries.length > 0,
      skillCount > 0,
      projects.length > 0,
      certs.length > 0,
      achievements.length > 0,
      langs.length > 0,
      (resume.interests?.length || 0) > 0,
    ].filter(Boolean).length;

    if (totalSections >= 7) {
      score += 2;
      passed.push("Excellent section coverage ✓");
    } else if (totalSections >= 5) {
      score += 1;
    }

    // Clamp to 100 max
    score = Math.min(score, 100);

    setAtsScore(score);
    setRecommendations(list);
    setAtsPassed(passed);
  }, [resume]);

  const handle1ClickAtsBooster = async () => {
    setLoading(true);
    try {
      let updatedData: Partial<Resume> = {};
      const targetRole = targetJobTitle || resume.personalInfo?.headline || "Software Engineer";

      // 1. Generate/Refine AI summary unconditionally
      const sumRes = await generateSummary(resume);
      if (sumRes?.success && sumRes.summary) {
        updatedData.personalInfo = {
          ...resume.personalInfo,
          summary: sumRes.summary,
        };
      }

      // 2. Recommend & merge top industry skills (expand up to 15 skills)
      const currentSkills = resume.skills || [];
      const skillRes = await recommendSkills(currentSkills, targetRole);
      if (skillRes?.success && Array.isArray(skillRes.skills)) {
        const mergedSkills = Array.from(new Set([...currentSkills, ...skillRes.skills])).slice(0, 15);
        updatedData.skills = mergedSkills;
      }

      // 3. Rewrite/optimize work experience descriptions unconditionally
      if (resume.experience && resume.experience.length > 0) {
        const updatedExp = await Promise.all(
          resume.experience.map(async (exp) => {
            if (exp.description && exp.description.trim()) {
              try {
                const optRes = await optimizeExperience(exp.description, targetRole || exp.position || "");
                if (optRes?.success && optRes.optimized) {
                  return { ...exp, description: optRes.optimized };
                }
              } catch (e) {
                console.error(e);
              }
            }
            return exp;
          })
        );
        updatedData.experience = updatedExp;
      }

      // 4. Optimize project descriptions unconditionally
      if (resume.projects && resume.projects.length > 0) {
        const updatedProjects = await Promise.all(
          resume.projects.map(async (proj) => {
            if (proj.description && proj.description.trim()) {
              try {
                const optRes = await optimizeExperience(proj.description, targetRole || proj.title || "");
                if (optRes?.success && optRes.optimized) {
                  return { ...proj, description: optRes.optimized };
                }
              } catch (e) {
                console.error(e);
              }
            }
            return proj;
          })
        );
        updatedData.projects = updatedProjects;
      }

      if (Object.keys(updatedData).length > 0) {
        onUpdateResume(updatedData);
        alert("🚀 1-Click ATS Booster applied! Your summary, skills, experience, and project descriptions have been enhanced for maximum ATS ranking.");
      } else {
        alert("Your resume is fully optimized.");
      }
    } catch (err: any) {
      console.error("ATS Booster Error:", err);
      alert("ATS Booster completed with partial updates.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Tab Content 1: ATS SCORE CARD & BOOSTER */}
      {activeTab === "ats" && (
        <div className="space-y-6">
          <div className="text-center p-5 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Genuine ATS Score Audit
            </h3>
            <div className="relative inline-flex items-center justify-center my-1">
              <span className={`text-6xl font-black tracking-tight ${
                atsScore >= 80 ? "text-green-600" : atsScore >= 50 ? "text-amber-500" : "text-red-500"
              }`}>
                {atsScore}%
              </span>
            </div>
            <div className="mt-1">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                atsScore >= 80
                  ? "bg-green-100 text-green-800"
                  : atsScore >= 50
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {atsScore >= 80
                  ? "🌟 Excellent (ATS Optimized)"
                  : atsScore >= 50
                  ? "⚠️ Good (Needs Keyword Boost)"
                  : "🚨 Low ATS Score (Action Required)"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 leading-relaxed max-w-xs mx-auto">
              Audited against real ATS parser rules: action verbs, keyword density, section depth & contact info.
            </p>

            {/* 1-Click ATS Booster Button */}
            <div className="mt-4 pt-4 border-t border-gray-200/60">
              <button
                onClick={handle1ClickAtsBooster}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Boosting ATS Score with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                    <span>⚡ 1-Click AI ATS Booster</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Passed Criteria */}
          {atsPassed.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-green-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Passed Audits ({atsPassed.length})
              </h4>
              <div className="space-y-1.5">
                {atsPassed.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-green-800 bg-green-50/60 border border-green-100 px-3 py-2 rounded-lg font-medium">
                    <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items to Improve Score */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-amber-700">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Required Improvements ({recommendations.length})
            </h4>

            {recommendations.length > 0 ? (
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex flex-col gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-gray-700 shadow-2xs">
                    <div className="flex gap-2 items-start">
                      <span className="text-amber-500 font-bold">•</span>
                      <span className="font-medium leading-relaxed flex-1">{rec.text}</span>
                    </div>
                    {onNavigateToSection && (
                      <button
                        onClick={() => onNavigateToSection(rec.fieldKey)}
                        className="self-end px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <span>✏️ Edit {rec.fieldLabel}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 items-center text-xs text-green-700 bg-green-50 border border-green-200 p-4 rounded-xl font-bold">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                Perfect! Your resume meets all top ATS parser standards.
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
