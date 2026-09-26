"use client";

import Link from "next/link";
import React from "react";

export interface CardOpportunityProps {
  id: string;
  title: string;
  company?: string;
  category: string;
  remote: boolean;
  minCompensation?: number;
  maxCompensation?: number;
  currency?: string;
  source: string;
  matchScore?: number;
  reasons?: string[];
  onSave?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onApplied?: (id: string) => void;
}

export function OpportunityCard({
  id,
  title,
  company,
  category,
  remote,
  minCompensation,
  maxCompensation,
  currency = "USD",
  source,
  matchScore = 85,
  reasons = [],
  onSave,
  onDismiss,
  onApplied,
}: CardOpportunityProps) {
  const compDisplay =
    minCompensation && maxCompensation
      ? `$${minCompensation} – $${maxCompensation}`
      : minCompensation
      ? `From $${minCompensation}`
      : "Flexible / Unstated";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Header row: title, category, match score */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-snug">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {company || "Direct Client"} • <span className="capitalize">{category}</span>
            </p>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              matchScore >= 90
                ? "bg-emerald-100 text-emerald-800"
                : matchScore >= 75
                ? "bg-indigo-100 text-indigo-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {matchScore}% match
          </span>
        </div>

        {/* Badges: Remote & Compensation */}
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
            {remote ? "🌐 Remote" : "📍 Local / On-site"}
          </span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
            💵 {compDisplay}
          </span>
        </div>

        {/* Match Rationale / Reasons */}
        <div className="mt-4 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600">
          {reasons.length > 0 ? (
            reasons.slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span>{r}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500">✓ Found via {source}</div>
          )}
        </div>
      </div>

      {/* Footer: Source info & Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Found on {source}</span>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Link
            href={`/opportunities/${id}`}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition"
          >
            View
          </Link>
          <button
            onClick={() => onSave && onSave(id)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
            title="Save for later"
          >
            💾 Save
          </button>
          <button
            onClick={() => onApplied && onApplied(id)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
            title="Mark as applied"
          >
            📨 Applied
          </button>
          <button
            onClick={() => onDismiss && onDismiss(id)}
            className="px-2 py-1.5 text-slate-400 hover:text-slate-600 rounded-md transition"
            title="Dismiss opportunity"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
