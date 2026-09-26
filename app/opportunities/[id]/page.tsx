"use client";

import { useState } from "react";
import Link from "next/link";

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false);

  // Mock detail data matching the specification
  const opp = {
    id: params.id,
    title: "Short-Form Video & Educational Content Editor",
    company: "EduMedia Creators",
    category: "freelance",
    remote: true,
    location: "Worldwide (Remote)",
    compensation: "$150 – $300 per deliverable",
    source: "Reddit (r/forhire)",
    sourceUrl: "https://reddit.com/r/forhire",
    matchScore: 94,
    publishedAt: "2 hours ago",
    description:
      "We produce weekly educational videos on tech and programming. Looking for a dependable editor who can cut raw recordings, add clean pacing, subtitles, and motion graphics. 10-15 hours per week.",
    reasons: [
      "✓ Video editing capability matches your profile entry",
      "✓ Remote work fulfills your location preference",
      "✓ Fits within your 20 hours/week availability",
    ],
    concerns: [
      "△ Requires familiarity with Premiere Pro or DaVinci Resolve",
    ],
    aiSummary: "The client seeks a regular freelance video editor to produce weekly educational clips with tight pacing and subtitles.",
    fitExplanation: "Your profile indicates practical video editing and content capabilities. The flexible schedule aligns directly with your target earnings.",
    prepAdvice: [
      "Have 2-3 short clips (30-60 seconds) ready to demonstrate your cutting and subtitle styling.",
      "State your weekly turnaround time in your initial note.",
    ],
    suggestedDraft: `Hi EduMedia team,\n\nI noticed your listing for an educational content editor. I specialize in clean, tightly paced video editing with accurate subtitles and clear audio. \n\nI have availability for 10-15 hours weekly and would be happy to review a test clip or share a couple of short samples of my recent work.\n\nLooking forward to hearing from you!\n\nBest regards,`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(opp.suggestedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main Listing Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{opp.title}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {opp.company} • {opp.location} • Discovered {opp.publishedAt}
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-full">
            {opp.matchScore}% Match
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded font-medium">
            {opp.remote ? "🌐 100% Remote" : "📍 On-Site"}
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
            💵 {opp.compensation}
          </span>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded font-medium capitalize">
            📌 {opp.category}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Opportunity Overview</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{opp.description}</p>
        </div>

        {/* Why it matches */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Why It Matches Your Profile</h4>
          {opp.reasons.map((r, i) => (
            <p key={i} className="text-xs text-slate-600">{r}</p>
          ))}
          {opp.concerns.map((c, i) => (
            <p key={i} className="text-xs text-amber-700">{c}</p>
          ))}
        </div>

        {/* Source Link */}
        <div className="pt-2">
          <a
            href={opp.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow transition"
          >
            <span>🔗 View Original Opportunity on {opp.source}</span>
          </a>
        </div>
      </div>

      {/* AI Assistant Section (Section 19) */}
      <div className="bg-white rounded-xl border border-indigo-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h2 className="text-lg font-bold text-slate-900">AI Application Assistant</h2>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">What to prepare</h3>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
            {opp.prepAdvice.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Suggested Application Draft (Edit before sending)
            </h3>
            <button
              onClick={handleCopy}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
            </button>
          </div>

          <textarea
            readOnly
            rows={7}
            value={opp.suggestedDraft}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none"
          />

          <p className="text-[11px] text-slate-500 mt-2">
            <strong>Rule:</strong> The AI will never submit applications automatically. You make the final decision and send your own messages.
          </p>
        </div>
      </div>
    </div>
  );
}
