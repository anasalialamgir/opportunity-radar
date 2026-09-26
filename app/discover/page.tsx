"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true);
      try {
        const res = await fetch("/api/opportunities");
        const data = await res.json();
        if (data.opportunities && data.opportunities.length > 0) {
          setOpportunities(data.opportunities);
        } else {
          setOpportunities([
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
              reasons: ["✓ Video editing matches capability", "✓ Remote fits preference"],
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
              reasons: ["✓ Python automation matches skills", "✓ Meets hourly threshold"],
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
              reasons: ["✓ Excel & Data analysis required"],
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load opportunities", err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
  };

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch =
        !query.trim() ||
        opp.title.toLowerCase().includes(query.toLowerCase()) ||
        opp.company?.toLowerCase().includes(query.toLowerCase()) ||
        opp.description?.toLowerCase().includes(query.toLowerCase()) ||
        opp.reasons?.some((r: string) => r.toLowerCase().includes(query.toLowerCase()));

      const matchesCat =
        selectedCategory === "all" ||
        opp.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesRemote = !remoteOnly || opp.remote === true;

      return matchesSearch && matchesCat && matchesRemote;
    });
  }, [opportunities, query, selectedCategory, remoteOnly]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Opportunities 🧭
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Explore verified opportunities across RSS feeds, Reddit, and GitHub.
          </p>
        </div>
        <Link href="/dashboard" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Search & Filter Form */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, job titles, or skills (e.g. Python, Video, Writing, Support)..."
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow transition"
          >
            Search
          </button>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                router.push("/discover");
              }}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="freelance">Freelance</option>
              <option value="contract">Contract</option>
              <option value="job">Full-time Job</option>
              <option value="grant">Grant / Research</option>
              <option value="open_source">Open-Source Bounty</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span className="font-semibold text-slate-700">🌐 Remote Only</span>
          </label>
        </div>
      </form>

      {/* Results Header and Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Found {filtered.length} matching opportunities</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading opportunities...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="font-bold text-slate-800">No matching opportunities found</h3>
            <p className="text-xs text-slate-500">Try changing your search terms or unchecking filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((opp) => (
              <OpportunityCard key={opp.id} {...opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading discovery...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
