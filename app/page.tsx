"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/discover");
    }
  };

  const sampleOpportunities = [
    {
      title: "Short-Form Video & Tutorial Editor",
      company: "EduMedia Creators",
      category: "Freelance",
      compensation: "$150 – $300 / project",
      remote: true,
      source: "Reddit",
      tags: ["Video Editing", "Subtitles", "Motion Graphics"],
    },
    {
      title: "Python Data Pipeline & Automation Engineer",
      company: "OpenCore Foundation",
      category: "Contract",
      compensation: "$500 – $1,000 / milestone",
      remote: true,
      source: "GitHub Bounties",
      tags: ["Python", "Automation", "PostgreSQL"],
    },
    {
      title: "Bilingual English/Urdu Content Specialist",
      company: "Localization Global",
      category: "Freelance",
      compensation: "$400 – $700 / month",
      remote: true,
      source: "AI Web Search",
      tags: ["Translation", "Writing", "Research"],
    },
  ];

  return (
    <div className="w-full space-y-12 sm:space-y-16 py-4 sm:py-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span>🚀 Open-Source • Privacy-First Opportunity Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Find opportunities that fit what you can{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            actually do
          </span>
          .
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto">
          Jobs, freelance contracts, grants, and paid bounties matched directly to your CV, real skills, and income goals.
        </p>

        {/* Public Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row gap-2.5 p-2 bg-white rounded-2xl border border-slate-300 shadow-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try searching 'Python', 'Video Editor', 'Urdu translation'..."
            className="flex-1 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow transition whitespace-nowrap"
          >
            Search Opportunities 🔍
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2">
          <span>Popular searches:</span>
          <button onClick={() => router.push("/discover?q=Python")} className="text-indigo-600 hover:underline font-medium">Python</button>
          <span>•</span>
          <button onClick={() => router.push("/discover?q=Video")} className="text-indigo-600 hover:underline font-medium">Video Editing</button>
          <span>•</span>
          <button onClick={() => router.push("/discover?q=Remote")} className="text-indigo-600 hover:underline font-medium">100% Remote</button>
          <span>•</span>
          <button onClick={() => router.push("/discover?q=Data")} className="text-indigo-600 hover:underline font-medium">Data Analysis</button>
        </div>
      </div>

      {/* Live Preview Section */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recently Discovered Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live sample of listings discovered across public boards, Reddit, and GitHub.
            </p>
          </div>
          <Link href="/discover" className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700">
            Browse All in Discover →
          </Link>
        </div>

        {/* Opportunity Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleOpportunities.map((opp, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {opp.category}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                    🔒 Sign in for Match Score
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-2.5 leading-snug">
                  {opp.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {opp.company} • {opp.remote ? "🌐 Remote" : "📍 On-site"}
                </p>

                <div className="mt-3 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block">
                  💵 {opp.compensation}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {opp.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Via {opp.source}</span>
                <Link
                  href="/signup"
                  className="font-bold text-indigo-600 hover:text-indigo-700 text-xs"
                >
                  Match with CV →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition CTA Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="px-3 py-1 bg-white/10 text-indigo-200 rounded-full text-xs font-bold uppercase tracking-wider">
              Unlock Your Personal Radar
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Upload your CV to see exact match percentages & AI application drafts.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Never browse 10,000 irrelevant jobs again. The Radar only shows what fits what you can actually do.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/signup"
              className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-center text-sm shadow transition"
            >
              Sign Up & Upload Resume 📄
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-center text-sm border border-white/20 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Trust & Transparency Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-2xl">🛡️</div>
          <h4 className="font-bold text-slate-900 text-sm">Privacy-First Architecture</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your CV and private profile stay strictly inside your instance. We never leak your resume, email, or identity to external employers or scraping boards.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-2xl">🔗</div>
          <h4 className="font-bold text-slate-900 text-sm">Direct, Verified Sources</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every opportunity contains a direct, verifiable link back to the original source. No middlemen, no paywalls, and no fabricated listings.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-2xl">🤝</div>
          <h4 className="font-bold text-slate-900 text-sm">Human in Control</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            AI assists and explains match reasoning. It will never automatically spam applications or send messages without your direct review.
          </p>
        </div>
      </div>
    </div>
  );
}
