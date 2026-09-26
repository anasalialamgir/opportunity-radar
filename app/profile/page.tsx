"use client";

import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Bell, 
  Upload, 
  CheckCircle2, 
  Save, 
  Smartphone, 
  Mail, 
  ShieldCheck 
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profile, setProfile] = useState({
    targetRoles: "Full-Stack Developer, Frontend Engineer",
    seniorityLevel: "Mid-level",
    workModel: "Remote",
    preferredLocations: "Worldwide, Remote",
    openToRelocate: false,
    currency: "USD",
    minHourlyPay: 45,
    minMonthlyPay: 7000,
    skills: "React, Next.js, Node.js, TypeScript, Tailwind",
    cvFileName: "Resume_2026.pdf",
    emailAlertsEnabled: true,
    alertFrequency: "instant",
    smsAlertsEnabled: false,
    phoneNumber: "",
    carrierGatewayDomain: "txt.att.net",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile({
              targetRoles: data.profile.targetRoles?.join(", ") || "",
              seniorityLevel: data.profile.seniorityLevel || "Mid-level",
              workModel: data.profile.workModel || "Remote",
              preferredLocations: data.profile.preferredLocations?.join(", ") || "",
              openToRelocate: Boolean(data.profile.openToRelocate),
              currency: data.profile.currency || "USD",
              minHourlyPay: data.profile.minHourlyPay || 0,
              minMonthlyPay: data.profile.minMonthlyPay || 0,
              skills: data.profile.skills?.join(", ") || "",
              cvFileName: data.profile.cvFileName || "",
              emailAlertsEnabled: Boolean(data.profile.emailAlertsEnabled),
              alertFrequency: data.profile.alertFrequency || "instant",
              smsAlertsEnabled: Boolean(data.profile.smsAlertsEnabled),
              phoneNumber: data.profile.phoneNumber || "",
              carrierGatewayDomain: data.profile.carrierGatewayDomain || "txt.att.net",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          targetRoles: profile.targetRoles.split(",").map((s) => s.trim()),
          preferredLocations: profile.preferredLocations.split(",").map((s) => s.trim()),
          skills: profile.skills.split(",").map((s) => s.trim()),
          minHourlyPay: parseFloat(profile.minHourlyPay.toString()) || 0,
          minMonthlyPay: parseFloat(profile.minMonthlyPay.toString()) || 0,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            • Radar Profile Ready
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Job Seeker Profile & Alert Settings</h1>
          <p className="text-sm text-slate-600">
            Define your exact criteria to automatically filter opportunities and receive verified alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : saveSuccess ? "Saved Successfully!" : "Save Profile"}
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profile and alert preferences saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Desired Work Setup */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" /> Career Focus & Target Roles
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-700">Target Roles (comma-separated)</label>
            <input
              type="text"
              value={profile.targetRoles}
              onChange={(e) => setProfile({ ...profile, targetRoles: e.target.value })}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm"
              placeholder="e.g. Senior Frontend Engineer, React Architect"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">Work Setup</label>
              <select
                value={profile.workModel}
                onChange={(e) => setProfile({ ...profile, workModel: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm bg-white"
              >
                <option value="Remote">100% Remote (Online)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">On-site</option>
                <option value="Any">Flexible / Open to All</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">Seniority</label>
              <select
                value={profile.seniorityLevel}
                onChange={(e) => setProfile({ ...profile, seniorityLevel: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm bg-white"
              >
                <option value="Entry">Entry Level / Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Staff / Director</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Preferred Locations
            </label>
            <input
              type="text"
              value={profile.preferredLocations}
              onChange={(e) => setProfile({ ...profile, preferredLocations: e.target.value })}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm"
              placeholder="e.g. Worldwide, US, Canada"
            />
          </div>
        </div>

        {/* Section 2: Compensation Floor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Compensation Floor & Currency
          </h2>
          <p className="text-xs text-slate-500">
            Jobs below these rates will be automatically filtered out from your high-match recommendations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">Currency</label>
              <select
                value={profile.currency}
                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (Rs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">Minimum Hourly Pay</label>
              <input
                type="number"
                value={profile.minHourlyPay}
                onChange={(e) => setProfile({ ...profile, minHourlyPay: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">Minimum Monthly Pay</label>
              <input
                type="number"
                value={profile.minMonthlyPay}
                onChange={(e) => setProfile({ ...profile, minMonthlyPay: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Resume & Core Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-600" /> Attached Resume & Verified Skills
          </h2>

          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{profile.cvFileName || "No CV uploaded yet"}</p>
              <p className="text-xs text-slate-500">Parsed and indexed for instant opportunity scoring.</p>
            </div>
            <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">
              Update Resume
              <input
                type="file"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setProfile({ ...profile, cvFileName: e.target.files[0].name });
                  }
                }}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Skills & Tech Stack</label>
            <input
              type="text"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-sm"
              placeholder="e.g. Next.js, TypeScript, PostgreSQL"
            />
          </div>
        </div>

        {/* Section 4: Integrated Notification & Free SMS Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" /> Integrated Alerts & Notification Mechanism
          </h2>
          <p className="text-xs text-slate-500">
            Configure how and when Opportunity Radar alerts you when high-compatibility positions are indexed.
          </p>

          {/* Email Alerts */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              id="emailAlerts"
              checked={profile.emailAlertsEnabled}
              onChange={(e) => setProfile({ ...profile, emailAlertsEnabled: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <label htmlFor="emailAlerts" className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-600" /> Enable Email Notifications
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive summaries of verified job matches directly to your login email address.
              </p>
            </div>
            <select
              value={profile.alertFrequency}
              onChange={(e) => setProfile({ ...profile, alertFrequency: e.target.value })}
              className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 bg-white"
            >
              <option value="instant">Instant Real-Time</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Rollup</option>
            </select>
          </div>

          {/* Free Open-Source SMS via Carrier Email-to-SMS Gateway */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="smsAlerts"
                checked={profile.smsAlertsEnabled}
                onChange={(e) => setProfile({ ...profile, smsAlertsEnabled: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <label htmlFor="smsAlerts" className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-slate-600" /> Free Carrier SMS Alerts (No Paid API required)
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Uses open telecom carrier email gateways to deliver text messages directly to your mobile phone at $0 cost.
                </p>
              </div>
            </div>

            {profile.smsAlertsEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Phone Number (Numbers only)</label>
                  <input
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-xs"
                    placeholder="e.g. 5551234567"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Carrier Domain Gateway</label>
                  <select
                    value={profile.carrierGatewayDomain}
                    onChange={(e) => setProfile({ ...profile, carrierGatewayDomain: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 text-xs bg-white"
                  >
                    <option value="txt.att.net">AT&T (txt.att.net)</option>
                    <option value="vtext.com">Verizon (vtext.com)</option>
                    <option value="tmomail.net">T-Mobile (tmomail.net)</option>
                    <option value="messaging.sprintpcs.com">Sprint (messaging.sprintpcs.com)</option>
                    <option value="msg.fi.google.com">Google Fi (msg.fi.google.com)</option>
                    <option value="custom">Self-Hosted Push / NTFY Webhook</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium text-sm shadow-sm transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {loading ? "Saving Changes..." : "Save All Profile & Alert Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
