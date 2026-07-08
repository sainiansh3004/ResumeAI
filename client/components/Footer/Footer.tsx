import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">R</div>
              <span className="text-white font-black tracking-tight">ResumeAI</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              The AI-powered career platform to build standout resumes and portfolio websites.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/register" className="hover:text-white transition">Resume Builder</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Portfolio Sites</Link></li>
              <li><Link href="#features" className="hover:text-white transition">AI Copilot</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>

          {/* Templates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300">Templates</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-gray-500">Modern, Minimal, ATS</span></li>
              <li><span className="text-gray-500">Creative, Executive</span></li>
              <li><span className="text-yellow-500 font-semibold">✦ Tech, Academic, Sleek (Pro)</span></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300">Account</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
          <p>Built with Next.js · Powered by Google Gemini</p>
        </div>
      </div>
    </footer>
  );
}
