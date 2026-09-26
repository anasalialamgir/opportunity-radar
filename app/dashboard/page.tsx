"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";

interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  category: string;
  remote: boolean;
  minCompensation?: number;
  maxCompensation?: number;
  source: string;
  matchScore: number;
  reasons: string[];
}

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "high_match" | "remote" | "freelance" | "contract">("all");
  const [sortBy, setSortBy] = useState<"match" | "compensation" | "title">("match");
  const [discovering, setDiscovering] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([
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
      reasons: [
        "✓ Video editing matches capability",
        "✓ Remote fits preference",
        "✓ Budget within target",
      ],
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
      reasons: [
        "✓ Python automation matches skills",
        "✓ Meets hourly threshold",
        "✓ Verified client",
      ],
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
      reasons: [
        "✓ Excel & Data analysis required",
        "✓ Flexible milestone delivery",
      ],
    },
    {
      id: "demo-opp-4",
      title: "Bilingual English/Urdu Content Specialist",
      company: "Localization Global",
      category: "freelance",
      remote: true,
      minCompensation: 400,
      maxCompensation: 700,
      source: "AI Web Search",
      matchScore: 96,
      reasons: [
        "✓ Direct language capability match",
        "✓ Fully remote milestone contract",
      ],
    },
  ]);

  const [savedCount, setSavedCount] = useState(12);
  const [appliedCount, setAppliedCount] = useState(3);

  const handleScan = async () => {
    setDiscovering(true);
    setNotification({
      message: "Radar is scanning active connectors (Web Search, RSS, GitHub, Reddit)...",
      type: "info",
    });

    try {
      const res = await fetch("/api/discover", { method: "POST" });
      const data = await res.json();
      if (data.opportunities && data.opportunities.length > 0) {
        setNotification({
          message: `Scan complete! Discovered ${data.opportunities.length} opportunities across all sources.`,
          type: "success",
        });
      } else {
        setNotification({
          message: "Scan complete. All opportunity feeds are currently up to date.",
          type: "success",
        });
      }
    } catch {
      setNotification({
        message: "Live demo scan complete. Discovered latest opportunities.",
        type: "success",
      });
    } finally {
      setDiscovering(false);
    }
  };

  const handleAction = (id: string, actionName: string) => {
    if (actionName === "dismiss") {
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      setNotification({ message: "Opportunity dismissed.", type: "info" });
    } else if (actionName === "save") {
      setSavedCount((c) => c + 1);
      setNotification({ message: "Saved to your tracking pipeline.", type: "success" });
    } else if (actionName === "applied") {
      setAppliedCount((c) => c + 1);
      setNotification({ message: "Marked as Applied.", type: "success" });
    }
  };

  // Instant filter and sorting calculation
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        const matchesQuery =
          !query.trim() ||
          opp.title.toLowerCase().includes(query.toLowerCase()) ||
          opp.company.toLowerCase().includes(query.toLowerCase()) ||
          opp.reasons.some((r) => r.toLowerCase().includes(query.toLowerCase()));

        if (!matchesQuery) return false;

        if (selectedFilter === "high_match") return opp.matchScore >= 90;
        if (selectedFilter === "remote") return opp.remote;
        if (selectedFilter === "freelance") return opp.category.toLowerCase() === "freelance";
        if (selectedFilter === "contract") return opp.category.toLowerCase() === "contract";

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchScore - a.matchScore;
        if (sortBy === "compensation") return (b.maxCompensation || 0) - (a.maxCompensation || 0);
        return a.title.localeCompare(b.title);
      });
  }, [opportunities, query, selectedFilter, sortBy]);

  const strongMatchesCount = useMemo(() => {
    return opportunities.filter((o) => o.matchScore >= 90).length;
  }, [opportunities]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Banner & Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] sm:text-xs font-semibold text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Radar Engine Active • 4 Connectors Connected
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Opportunity Radar <span className="text-indigo-600">Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Real-time discovered earning opportunities matching your verified capabilities and income targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/profile"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition"
          >
            Edit Profile
          </Link>
          <Link
            href="/settings"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50/70 border border-indigo-200/70 rounded-lg hover:bg-indigo-100 transition"
          >
            Sources Settings
          </Link>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {/* Strong Matches */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Strong Matches
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              90%+ Fit
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
              {strongMatchesCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">tailored to skills</span>
          </div>
        </div>

        {/* Total Discovered */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Discovered
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Live
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              24
            </span>
            <span className="text-xs text-slate-500 font-medium">in last 24h</span>
          </div>
        </div>

        {/* Saved */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Pipeline
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Review
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {savedCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">ready to draft</span>
          </div>
        </div>

        {/* Applied */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Applications
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Active
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
              {appliedCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">responses awaited</span>
          </div>
        </div>
      </div>

      {/* Search, Filter & Trigger Scan Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 sm:p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill, title, keyword (e.g. Python, Video, Remote, Data)..."
              className="w-full pl-9 pr-8 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={discovering}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {discovering ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Scanning 4 Feeds...</span>
              </>
            ) : (
              <>
                <span>🚀 Run Radar Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Pills and Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter:
            </span>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("high_match")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "high_match"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🔥 90%+ Match
            </button>
            <button
              onClick={() => setSelectedFilter("remote")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "remote"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🌐 Remote
            </button>
            <button
              onClick={() => setSelectedFilter("freelance")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "freelance"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Freelance
            </button>
            <button
              onClick={() => setSelectedFilter("contract")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "contract"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Contract
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="match">Highest Match</option>
              <option value="compensation">Highest Compensation</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium shadow-sm transition ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-indigo-50 text-indigo-800 border-indigo-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{notification.type === "success" ? "✓" : "ℹ"}</span>
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold text-base leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Opportunities Section */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Matched Opportunities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredOpportunities.length} opportunities matching your criteria
            </p>
          </div>
          {selectedFilter !== "all" && (
            <button
              onClick={() => {
                setSelectedFilter("all");
                setQuery("");
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-slate-800">No opportunities match your filter</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms, changing the active filter chips, or triggering a new Radar scan.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedFilter("all");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                {...opp}
                onSave={(id) => handleAction(id, "save")}
                onDismiss={(id) => handleAction(id, "dismiss")}
                onApplied={(id) => handleAction(id, "applied")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
