import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-6">
        <span>🚀 Open-source & Privacy-First</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl">
        Find opportunities that fit what you can <span className="text-indigo-600">actually do</span>.
      </h1>

      <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl">
        Tell the radar what skills, experience, and interests you have. AI discovers legitimate opportunities from multiple sources and explains why they match you.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/profile"
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
        >
          Create Your Profile
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
        >
          View Demo Dashboard
        </Link>
      </div>

      {/* Core Principles Cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl text-left w-full">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900">🛡️ Privacy First</h3>
          <p className="mt-2 text-sm text-slate-600">
            Your CV and personal profile stay private. Never sent or exposed to sources without explicit approval.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900">🔍 Source Agnostic</h3>
          <p className="mt-2 text-sm text-slate-600">
            Searches jobs, freelance gigs, research grants, bounties, and community connectors in one place.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900">🤝 Human Controlled</h3>
          <p className="mt-2 text-sm text-slate-600">
            AI assists and explains match rationale. You decide what to pursue—no automated spam applications.
          </p>
        </div>
      </div>
    </div>
  );
}
