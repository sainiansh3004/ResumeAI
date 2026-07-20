"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPortfolioBySubdomain } from "@/services/portfolioService";
import { Mail, Phone, MapPin, Globe, RefreshCw, Cpu, Award, GraduationCap } from "lucide-react";

export default function PublicPortfolioPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (subdomain) {
      loadPortfolio();
    }
  }, [subdomain]);

  const loadPortfolio = async () => {
    try {
      const res = await getPortfolioBySubdomain(subdomain);
      if (res.success && res.portfolio) {
        setPortfolio(res.portfolio);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading Portfolio Website...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Globe className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-black text-gray-900">404 - Portfolio Not Found</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
          The subdomain "{subdomain}" has not been claimed yet, or this website is temporarily offline.
        </p>
      </div>
    );
  }

  const { personalInfo = {}, skills = [], experience = [], education = [], projects = [] } = portfolio;
  const themeColor = portfolio.themeColor || "blue";

  // Color mapping
  const colorMap: Record<string, { bg: string; text: string; border: string; accentBg: string; button: string }> = {
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-600",
      accentBg: "bg-blue-50 text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-600",
      border: "border-purple-600",
      accentBg: "bg-purple-50 text-purple-700",
      button: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    green: {
      bg: "bg-green-600",
      text: "text-green-600",
      border: "border-green-600",
      accentBg: "bg-green-50 text-green-700",
      button: "bg-green-600 hover:bg-green-700 text-white",
    },
    black: {
      bg: "bg-gray-900",
      text: "text-gray-900",
      border: "border-gray-900",
      accentBg: "bg-gray-100 text-gray-800",
      button: "bg-gray-900 hover:bg-gray-800 text-white",
    },
    red: {
      bg: "bg-red-600",
      text: "text-red-600",
      border: "border-red-600",
      accentBg: "bg-red-50 text-red-700",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
  };

  const colors = colorMap[themeColor] || colorMap.blue;

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-blue-100 selection:text-blue-900">
      {/* Portfolio Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-lg font-black tracking-tight text-gray-900 flex items-center gap-1.5">
          <Globe className={`h-5 w-5 ${colors.text}`} />
          {personalInfo.fullName || "My Portfolio"}
        </span>

        <div className="flex gap-4 items-center">
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${colors.button}`}
            >
              Contact Me
            </a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 border-b border-gray-50">
        <div className="flex-1 space-y-6 text-center md:text-left">
          {personalInfo.headline && (
            <span className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${colors.accentBg}`}>
              {personalInfo.headline}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight">
            Hi, I'm {personalInfo.fullName || "a Professional"}
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-justify max-w-2xl whitespace-pre-line">
            {personalInfo.summary || "No professional summary added yet."}
          </p>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start gap-4">
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hover:border-gray-900 text-gray-500 hover:text-gray-900 transition flex items-center justify-center">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hover:border-blue-600 text-gray-500 hover:text-blue-600 transition flex items-center justify-center">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Profile Image */}
        {personalInfo.photo && (
          <div className="shrink-0 flex justify-center">
            <img
              src={personalInfo.photo}
              alt="Profile"
              className={`h-60 w-60 md:h-72 md:w-72 rounded-3xl object-cover border-4 border-white shadow-xl shadow-gray-200/50 ${colors.border}`}
            />
          </div>
        )}
      </section>

      {/* Skills Matrix */}
      {skills.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto border-b border-gray-50 space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <Cpu className={`h-5 w-5 ${colors.text}`} />
            Expertise & Skills
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill: string, index: number) => (
              <span key={index} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${colors.accentBg} border-gray-100 shadow-sm`}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Work History */}
      {experience.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto border-b border-gray-50 space-y-10">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <Award className={`h-5 w-5 ${colors.text}`} />
            Work Experience
          </h2>

          <div className="relative border-l border-gray-100 pl-8 space-y-10">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="relative space-y-2">
                {/* Node bubble */}
                <div className={`absolute -left-[37px] top-1.5 h-4.5 w-4.5 rounded-full border-4 border-white shadow-sm ${colors.bg}`} />

                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-md ${colors.accentBg}`}>
                    {exp.startDate} {exp.startDate && exp.endDate && "–"} {exp.endDate}
                  </span>
                </div>

                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{exp.company}</div>

                {exp.description && (
                  <p className="text-gray-600 text-xs leading-relaxed text-justify whitespace-pre-line max-w-3xl">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto border-b border-gray-50 space-y-10">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <GraduationCap className={`h-5 w-5 ${colors.text}`} />
            Education
          </h2>

          <div className="relative border-l border-gray-100 pl-8 space-y-10">
            {education.map((edu: any, index: number) => (
              <div key={index} className="relative space-y-1">
                {/* Node bubble */}
                <div className={`absolute -left-[37px] top-1.5 h-4.5 w-4.5 rounded-full border-4 border-white shadow-sm ${colors.bg}`} />

                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{edu.college || "University / College"}</h3>
                  <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-md ${colors.accentBg}`}>
                    {edu.startYear} {edu.startYear && edu.endYear && "–"} {edu.endYear}
                  </span>
                </div>

                <div className="text-xs text-gray-600 font-semibold">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                </div>

                {edu.cgpa && (
                  <div className="text-xs text-gray-400 font-medium">
                    GPA / CGPA: {edu.cgpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {projects.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto border-b border-gray-50 space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <Globe className={`h-5 w-5 ${colors.text}`} />
            Key Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj: any, index: number) => (
              <div key={index} className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-md font-bold text-gray-950">{proj.title}</h3>
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((t: string, idx: number) => (
                        <span key={idx} className="bg-gray-50 border border-gray-100 text-gray-500 text-[10px] px-2 py-0.2 rounded font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-xs text-gray-600 leading-normal text-justify max-w-xl">
                      {proj.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 text-xs font-bold">
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className={`${colors.text} hover:underline`}>
                      Source Code
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a href={proj.liveDemo} target="_blank" rel="noopener noreferrer" className={`${colors.text} hover:underline`}>
                      Live Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Info */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100 px-6 text-center text-xs text-gray-400 space-y-3">
        <div className="flex justify-center gap-4 text-gray-500 font-medium">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {personalInfo.address}</span>}
        </div>
        <p>© {new Date().getFullYear()} {personalInfo.fullName}. Powered by ResumeAI Portfolio Builder.</p>
      </footer>
    </div>
  );
}
