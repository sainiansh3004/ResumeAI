"use client";

const features = [
  {
    icon: "✦",
    title: "AI Resume Builder",
    description: "Gemini-powered summaries, bullet rewrites, and ATS-tuned language — written in seconds, not hours.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: "◈",
    title: "Portfolio Website",
    description: "Claim your custom subdomain and publish a live personal website built directly from your resume data.",
    accent: "bg-purple-50 text-purple-600",
  },
  {
    icon: "◉",
    title: "ATS Score Audit",
    description: "Real-time scoring against ATS parser rules with specific action items to maximize your callback rate.",
    accent: "bg-green-50 text-green-600",
  },
  {
    icon: "◎",
    title: "Cover Letter AI",
    description: "Generate tailored, recruiter-grade cover letters for any job description in under 10 seconds.",
    accent: "bg-amber-50 text-amber-600",
  },
  {
    icon: "⊕",
    title: "8 Premium Templates",
    description: "Modern, Executive, Tech, Academic, Sleek, ATS, Creative, Minimal — print-perfect on every layout.",
    accent: "bg-pink-50 text-pink-600",
  },
  {
    icon: "⊞",
    title: "Drag & Drop Sections",
    description: "Fully customizable section order, hidden sections, and custom titles — with one-click undo/redo.",
    accent: "bg-indigo-50 text-indigo-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white border-t border-gray-50">
      <div className="max-w-6xl mx-auto px-8 space-y-16">
        <div className="text-center space-y-4">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
            Why ResumeAI
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            Everything You Need to<br />
            <span className="text-blue-600">Land Your Dream Job</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            From ATS-optimized resumes to stunning portfolio websites — ResumeAI is your complete career platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-7 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 bg-white flex flex-col gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black ${feature.accent}`}>
                {feature.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-gray-950">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}