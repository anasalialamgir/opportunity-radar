"use client";

import { useState } from "react";
import Link from "next/link";

interface SavedItem {
  id: string;
  title: string;
  company: string;
  compensation: string;
  status: "Saved" | "Preparing" | "Applied" | "Interview" | "Offer";
  source: string;
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([
    {
      id: "demo-opp-1",
      title: "Short-Form Video & Educational Content Editor",
      company: "EduMedia Creators",
      compensation: "$150 – $300",
      status: "Preparing",
      source: "Reddit",
    },
    {
      id: "demo-opp-2",
      title: "Python Data Pipeline & Automation",
      company: "OpenCore Foundation",
      compensation: "$500 – $1,000",
      status: "Applied",
      source: "GitHub",
    },
  ]);

  const updateStatus = (id: string, newStatus: SavedItem["status"]) => {
    setItems(items.map((it) => (it.id === id ? { ...it, status: newStatus } : it)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Application Tracking & Saved</h1>
        <p className="text-sm text-slate-600 mt-1">
          Keep track of opportunities you are reviewing, preparing, or have applied for.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-200">
        {items.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link href={`/opportunities/${item.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 text-sm">
                {item.title}
              </Link>
              <div className="text-xs text-slate-500 mt-0.5">
                {item.company} • 💵 {item.compensation} • Via {item.source}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-500 font-medium">Status:</label>
              <select
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value as any)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-semibold focus:outline-indigo-500 bg-white"
              >
                <option value="Saved">Saved</option>
                <option value="Preparing">Preparing</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
              </select>

              <Link
                href={`/opportunities/${item.id}`}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-xs font-medium"
              >
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
