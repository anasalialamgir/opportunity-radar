"use client";

import { useState } from "react";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([
    {
      id: "demo-opp-1",
      title: "Short-Form Video & Tutorial Editor",
      company: "EduMedia Creators",
      category: "freelance",
      remote: true,
      minCompensation: 150,
      maxCompensation: 300,
      source: "Reddit",
      matchScore: 94,
      reasons: ["✓ Video editing matches capability", "✓ Remote fits preference", "✓ Budget within target"],
    },
    {
      id: "demo-opp-2",
      title: "Python Data Pipeline & Automation",
      company: "OpenCore Foundation",
      category: "contract",
      remote: true,
      minCompensation: 500,
      maxCompensation: 1000,
      source: "GitHub",
      matchScore: 91,
      reasons: ["✓ Python automation matches skills", "✓ Meets hourly threshold", "✓ Verified client"],
    },
    {
      id: "demo-opp-3",
      title: "Data Analysis & Spreadsheet Modeler",
      company: "FinTech Ventures",
      category: "freelance",
      remote: true,
      minCompensation: 800,
      maxCompensation: 1200,
      source: "RSS / Tech Feeds",
      matchScore: 87,
      reasons: ["✓ Excel & Data analysis required", "✓ Flexible milestone delivery"],
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleScan = async () => {
    setDiscovering(true);
    setNotification("Radar is scanning active sources (Web, RSS, GitHub)...");
    try {
      const res = await fetch("/api/discover", { method: "POST" });
      const data = await res.json();
      if (data.opportunities && data.opportunities.length > 0) {
        setNotification(`Scan complete! Discovered ${data.opportunities.length} opportunities.`);
      } else {
        setNotification("Radar scan complete. Existing listings up to date.");
      }
    } catch {
      setNotification("Radar completed demo scan.");
    } finally {
      setDiscovering(false);
    }
  };

  const handleAction = (id: string, actionName: string) => {
    setNotification(`Action '${actionName}' recorded for opportunity.`);
    if (actionName === "dismiss") {
      setOpportunities(opportunities.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0">
      {/* Welcome Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Good morning 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Here is your personal Opportunity Radar overview.
        </p>
      </div>

      {/* Radar Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
            🔥 Strong Matches
          </div>
          <div className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">7</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
            🆕 Discovered
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">24</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
            💾 Saved
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">12</div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
            📨 Applied
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">3</div>
        </div>
      </div>

      {/* Search & Trigger Scan Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Find remote Python or design opportunities..."
          className="w-full flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleScan}
          disabled={discovering}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg text-xs sm:text-sm shadow transition disabled:opacity-50 text-center whitespace-nowrap"
        >
          {discovering ? "Scanning Sources..." : "Run Radar Scan"}
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium break-words">
          {notification}
        </div>
      )}

      {/* Opportunity Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Your Strongest Matches
          </h2>
          <span className="text-[11px] sm:text-xs text-slate-500">
            Sorted by relevance to your profile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              {...opp}
              onSave={(id) => handleAction(id, "save")}
              onDismiss={(id) => handleAction(id, "dismiss")}
              onApplied={(id) => handleAction(id, "applied")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
