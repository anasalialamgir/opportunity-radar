"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    timeZone: "",
    locationPreference: "remote",
    hoursPerWeek: "20",
    targetMonthlyIncome: "",
    minimumCompensation: "",
    currency: "USD",
    employmentPreferences: ["Full-time"],
    languages: "",
    skills: "",
    targetRoles: "",
    capabilities: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(({ user, profile }) => {
      if (!user) return;
      setFormData(prev => ({ ...prev, name: user.name || "", email: user.email || "",
        country: profile?.country || "", timeZone: profile?.timeZone || "",
        locationPreference: profile?.locationPreference || "remote",
        hoursPerWeek: String(profile?.hoursPerWeek ?? 20), targetMonthlyIncome: String(profile?.targetMonthlyIncome ?? ""),
        minimumCompensation: String(profile?.minimumCompensation ?? ""), currency: profile?.currency || "USD",
        employmentPreferences: profile?.employmentPreferences || ["Full-time"],
        languages: (profile?.languages || []).join(", "), skills: (profile?.skills || []).map((s: any) => s.name).join(", "),
        targetRoles: (profile?.targetRoles || []).join(", "),
        capabilities: (profile?.userCapabilities || []).map((c: any) => c.description).join(", "),
      }));
    }).catch(() => setStatus("Error: Please log in to edit your profile."));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const payload = {
        ...formData,
        languages: formData.languages.split(",").map((s) => s.trim()),
        skills: formData.skills.split(",").map((s) => s.trim()),
        targetRoles: formData.targetRoles.split(",").map((s) => s.trim()),
        capabilities: formData.capabilities.split(",").map((s) => s.trim()),
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Profile saved successfully! Ready for discovery.");
      } else {
        setStatus(`Error: ${data.error || "Failed to save"}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Upload Resume Shortcut Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>📄</span>
            <span>Have a Resume or CV?</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm">
            Save time! Upload your resume or paste its text to have AI extract your skills and experience automatically.
          </p>
        </div>
        <Link
          href="/profile/cv-upload"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition whitespace-nowrap"
        >
          Upload Resume Now →
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Your Opportunity Profile</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">
          Tell the radar about your background, preferences, and goals.
        </p>

        {status && (
          <div className={`p-4 rounded-lg text-sm mb-6 ${status.startsWith("Error") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Pakistan, United States"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Location Preference</label>
              <select
                name="locationPreference"
                value={formData.locationPreference}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="local">Local</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Hours / Week</label>
              <input
                type="number"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Monthly ($)</label>
              <input
                type="number"
                name="targetMonthlyIncome"
                value={formData.targetMonthlyIncome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Min Acceptable ($)</label>
              <input
                type="number"
                name="minimumCompensation"
                value={formData.minimumCompensation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Languages (comma-separated)</label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="e.g. English, Urdu"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Primary Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. Python, Excel, Research, Design"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Which roles do you want next? (comma-separated)</label>
            <input type="text" name="targetRoles" value={formData.targetRoles} onChange={handleChange}
              placeholder="e.g. Data Analyst, Product Manager, Regulatory Affairs Specialist"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-indigo-500" />
            <p className="text-xs text-slate-500 mt-1">These goals help prioritize jobs beyond your past job titles.</p>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
            <label className="block text-sm font-semibold text-indigo-950 mb-1">
              What else can you do that isn&apos;t on your CV?
            </label>
            <p className="text-xs text-indigo-700 mb-2">
              Add real practical capabilities (e.g. &quot;I can translate Urdu/English, I can edit short videos, I understand cars&quot;).
            </p>
            <textarea
              name="capabilities"
              value={formData.capabilities}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-indigo-200 bg-white rounded-md text-sm focus:outline-indigo-500"
              placeholder="Type your skills and capabilities separated by commas..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
