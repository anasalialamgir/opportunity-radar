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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Good morning 👋
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Here is your personal Opportunity Radar overview.
        </p>
      </div>

      {/* Radar Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">🔥 Strong Matches</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">7</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">🆕 Discovered</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">24</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">💾 Saved</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">12</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">📨 Applied</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">3</div>
        </div>
      </div>

      {/* Search & Trigger Scan Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Find remote Python or design opportunities..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-indigo-500"
        />
        <button
          onClick={handleScan}
          disabled={discovering}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition disabled:opacity-50"
        >
          {discovering ? "Scanning Sources..." : "Run Radar Scan"}
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium">
          {notification}
        </div>
      )}

      {/* Opportunity Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Your Strongest Matches</h2>
          <span className="text-xs text-slate-500">Sorted by relevance to your profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
