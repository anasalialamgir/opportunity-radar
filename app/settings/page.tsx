"use client";

import { useState } from "react";

interface SourceItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

export default function SettingsPage() {
  const [sources, setSources] = useState<SourceItem[]>([
    { id: "web-search", name: "AI Web Search Discovery", description: "Discovers unlisted contracts, gigs, and grants across verified public pages.", enabled: true, category: "Core" },
    { id: "rss", name: "RSS & Public Feeds", description: "Monitors public RSS feeds from remote job hubs and forums.", enabled: true, category: "Core" },
    { id: "reddit", name: "Reddit (Bounties & Freelance)", description: "Scans open freelance, forhire, and opportunity subreddits.", enabled: true, category: "Community" },
    { id: "github", name: "GitHub Opportunities", description: "Discovers sponsored issues, grants, and open-source bounties.", enabled: true, category: "Developer" },
    { id: "career-pages", name: "Company Career Pages", description: "Crawls direct career and consulting request pages.", enabled: false, category: "Direct" },
    { id: "custom", name: "Custom Connectors", description: "User-defined and community-submitted plugin adapters.", enabled: false, category: "Community" },
  ]);

  const toggleSource = (id: string) => {
    setSources(
      sources.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings → Opportunity Sources</h2>
        <p className="text-sm text-slate-600 mt-1">
          Control which sources the discovery engine scans. You can enable or disable adapters at any time.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-200">
        {sources.map((source) => (
          <div key={source.id} className="p-4 sm:p-5 flex items-center justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-sm">{source.name}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {source.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{source.description}</p>
            </div>

            <button
              onClick={() => toggleSource(source.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                source.enabled
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {source.enabled ? "ON" : "OFF"}
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
        <strong>Privacy Reminder:</strong> Enabling or disabling sources only affects where the engine looks for public listings. Your personal profile, CV, and contact details are never sent to external source providers.
      </div>
    </div>
  );
}
