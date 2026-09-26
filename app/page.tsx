import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-4xl py-6 sm:py-14 text-center flex flex-col items-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>Open-Source &bull; Privacy-First Radar</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-3xl">
          Discover opportunities that match what you{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
            actually do
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed px-2">
          Tell the radar your skills, experience, and interests. AI cuts through the noise to find high-signal grants, jobs, hackathons, and bounties tailored specifically to you.
        </p>

        {/* Action Buttons (Stacked on mobile, row on tablet/desktop) */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-sm sm:max-w-none">
          <Link
            href="/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition"
          >
            Create Your Profile &rarr;
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] transition"
          >
            View Demo Radar
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500 text-sm">✓</span> 100% Free &amp; Open Source
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500 text-sm">✓</span> Zero Data Tracking
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500 text-sm">✓</span> Verified Sources Only
          </div>
        </div>
      </section>

      {/* Live Preview Card */}
      <section className="w-full max-w-3xl my-6">
        <div className="p-1 rounded-2xl bg-gradient-to-b from-indigo-100 to-slate-100 border border-slate-200 shadow-sm">
          <div className="bg-white p-5 sm:p-7 rounded-[14px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                RADAR MATCH SAMPLE
              </span>
              <span>Matched 10 mins ago</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                  96% Profile Match
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Autonomous AI Agent Fellowship &amp; Grant
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Global Open Source Foundation &bull; Remote &bull; $10,000 Equity-Free
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  Source: GitHub
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 line-clamp-2">
              Seeking builders to research prompt systems, autonomous agents, and tool protocols. Matched based on your profile skills in AI agent workflows.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">Prompt Engineering</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">Autonomous Agents</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">Remote</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Cards */}
      <section className="w-full max-w-5xl my-10 sm:my-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Built to protect your focus and privacy</h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">Everything you need without the spam of traditional job boards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-4 text-indigo-600">
              🛡️
            </div>
            <h3 className="font-bold text-lg text-slate-900">Privacy First</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Your resume, credentials, and profile remain completely private. Nothing is ever indexed publicly or sold to third parties.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-4 text-indigo-600">
              ⚡
            </div>
            <h3 className="font-bold text-lg text-slate-900">Smart AI Matching</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Intelligent evaluation matches opportunities with your exact verified capabilities, ignoring fluff and deceptive job titles.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-4 text-indigo-600">
              🔔
            </div>
            <h3 className="font-bold text-lg text-slate-900">Instant Digests</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Receive automated notifications and curated periodic updates straight to your Telegram or personal dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Flow */}
      <section className="w-full max-w-4xl my-8 sm:my-12 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 mb-8">How It Works in 3 Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-3 text-sm">
              1
            </div>
            <h4 className="font-semibold text-slate-900">Set Up Your Profile</h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">List your real skills, preferred roles, and availability.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-3 text-sm">
              2
            </div>
            <h4 className="font-semibold text-slate-900">Radar Monitors Sources</h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">AI scans GitHub, grants, job boards, and RSS feeds in the background.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-3 text-sm">
              3
            </div>
            <h4 className="font-semibold text-slate-900">Review &amp; Apply</h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Get high-signal matches delivered to you ready for direct action.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="w-full max-w-4xl my-8 sm:my-14">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 sm:p-12 text-center text-white shadow-xl shadow-indigo-500/10">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Ready to activate your opportunity radar?</h2>
          <p className="mt-3 text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
            Take 2 minutes to fill your skill profile and let the AI find what matters.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow-md transition"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
