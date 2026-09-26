"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";

interface OpportunityItem {
  id: string;
  title: string;
  description?: string;
  company: string;
  category: string;
  remote: boolean;
  minCompensation?: number;
  maxCompensation?: number;
  source: string;
  sourceUrl?: string;
  matchScore: number;
  reasons: string[];
}

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "high_match" | "remote" | "freelance" | "contract">("all");
  const [sortBy, setSortBy] = useState<"match" | "compensation" | "title">("match");
  const [discovering, setDiscovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);

  // Load saved user email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("opportunity_radar_user_email") || "";
    setUserEmail(savedEmail);
    fetchLiveOpportunities(savedEmail);
  }, []);

  const fetchLiveOpportunities = async (email?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/opportunities${email ? `?email=${encodeURIComponent(email)}` : ""}`);
      const data = await res.json();
      if (data.opportunities && data.opportunities.length > 0) {
        setOpportunities(data.opportunities);
      } else {
        setOpportunities([]);
      }
    } catch (err) {
      console.error("Failed to load opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setDiscovering(true);
    setNotification({
      message: "Radar is scanning live sources (Web Search, RSS, GitHub)...",
      type: "info",
    });

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });
      const data = await res.json();

      if (data.opportunities && data.opportunities.length > 0) {
        // If user has a profile, calculate match scores
        if (userEmail) {
          await fetch("/api/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail }),
          });
        }

        await fetchLiveOpportunities(userEmail);

        setNotification({
          message: `Scan complete! Discovered ${data.totalDiscovered || data.opportunities.length} opportunities.`,
          type: "success",
        });
      } else {
        setNotification({
          message: "Scan complete. All active feeds are currently up to date.",
          type: "success",
        });
      }
    } catch {
      setNotification({
        message: "Scan completed with existing cached listings.",
        type: "info",
      });
    } finally {
      setDiscovering(false);
    }
  };

  const handleAction = async (id: string, actionName: string) => {
    if (!userEmail) {
      setNotification({
        message: "Please create your profile first so your actions can be saved.",
        type: "info",
      });
      return;
    }

    try {
      await fetch("/api/opportunities/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: id, userEmail, action: actionName }),
      });

      if (actionName === "dismiss") {
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
        setNotification({ message: "Opportunity dismissed.", type: "info" });
      } else if (actionName === "save") {
        setNotification({ message: "Saved to your pipeline.", type: "success" });
      } else if (actionName === "applied") {
        setNotification({ message: "Marked as Applied.", type: "success" });
      }
    } catch (err: any) {
      setNotification({ message: `Error: ${err.message}`, type: "info" });
    }
  };

  // Instant filter and sorting
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
        if (selectedFilter === "freelance") return opp.category?.toLowerCase() === "freelance";
        if (selectedFilter === "contract") return opp.category?.toLowerCase() === "contract";

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
            {userEmail ? `Connected as ${userEmail}` : "Radar Engine Ready"}
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
            {userEmail ? "Edit Profile" : "Create Profile"}
          </Link>
          <Link
            href="/profile/cv-upload"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50/70 border border-indigo-200/70 rounded-lg hover:bg-indigo-100 transition"
          >
            Upload CV
          </Link>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col justify-between">
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

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Total in DB
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Live
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              {opportunities.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">listings</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Pipeline
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <Link href="/saved" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight hover:text-indigo-600">
              View →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Radar Scan
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Action
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <button
              onClick={handleScan}
              disabled={discovering}
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
            >
              {discovering ? "Scanning..." : "Trigger Scan ↻"}
            </button>
          </div>
        </div>
      </div>

      {/* Search & Scan Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 sm:p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search live database by skill, title, keyword (e.g. Python, Video, Remote, Support)..."
              className="w-full px-3.5 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
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
            {discovering ? "Scanning Feeds..." : "🚀 Run Live Radar Scan"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter:
            </span>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "all" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("high_match")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "high_match" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🔥 90%+ Match
            </button>
            <button
              onClick={() => setSelectedFilter("remote")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFilter === "remote" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🌐 Remote
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="match">Highest Match</option>
              <option value="compensation">Highest Pay</option>
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
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 font-bold text-base">
            ×
          </button>
        </div>
      )}

      {/* Opportunities Section */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Live Database Opportunities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {loading
                ? "Connecting to database..."
                : `Showing ${filteredOpportunities.length} opportunities from your database`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading opportunities from database...
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-4">
            <div className="text-4xl">📡</div>
            <h3 className="text-base font-bold text-slate-800">No opportunities in database yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your database is connected! Tap the button below to run your first live scan across connected sources.
            </p>
            <button
              onClick={handleScan}
              disabled={discovering}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs sm:text-sm shadow transition"
            >
              {discovering ? "Scanning Sources..." : "Run First Radar Scan 🚀"}
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
