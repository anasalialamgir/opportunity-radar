"use client";

import { useState } from "react";
import Link from "next/link";

export default function NotificationSettingsPage() {
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState("daily");
  const [telegramAlerts, setTelegramAlerts] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = () => {
    setStatus("Notification settings saved successfully.");
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/settings" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          ← Back to Settings
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Notification Preferences</h1>
        <p className="text-sm text-slate-600">Choose how and when Opportunity Radar notifies you of new matches.</p>
      </div>

      {status && (
        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium">
          {status}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        {/* Email Digest Section */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Email Digest</h3>
            <p className="text-xs text-slate-500 mt-0.5">Receive a digest summarizing high-scoring matches.</p>
          </div>
          <button
            onClick={() => setEmailDigest(!emailDigest)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              emailDigest ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {emailDigest ? "ENABLED" : "DISABLED"}
          </button>
        </div>

        {emailDigest && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cadence
            </label>
            <select
              value={emailFrequency}
              onChange={(e) => setEmailFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
            >
              <option value="instant">Immediate (as soon as a 90%+ match is found)</option>
              <option value="daily">Daily morning digest</option>
              <option value="weekly">Weekly recap</option>
            </select>
          </div>
        )}

        {/* Telegram Alerts Section */}
        <div className="flex items-start justify-between pt-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Telegram Instant Alerts</h3>
            <p className="text-xs text-slate-500 mt-0.5">Get opportunity alerts directly inside Telegram.</p>
          </div>
          <button
            onClick={() => setTelegramAlerts(!telegramAlerts)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              telegramAlerts ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {telegramAlerts ? "ENABLED" : "DISABLED"}
          </button>
        </div>

        {telegramAlerts && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Telegram Chat ID / Username
            </label>
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="e.g. @yourusername or numeric Chat ID"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}
