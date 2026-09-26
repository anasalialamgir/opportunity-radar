"use client";

import React, { useState, useEffect } from "react";
import { 
  Target, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Upload, 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Smartphone, 
  RotateCcw,
  Sliders,
  Check
} from "lucide-react";

export default function ProfilePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<"carousel" | "overview">("carousel");

  const [profile, setProfile] = useState({
    targetRoles: "Full-Stack Developer, Frontend Engineer",
    seniorityLevel: "Mid-level",
    workModel: "Remote",
    preferredLocations: "Worldwide, Remote",
    openToRelocate: false,
    currency: "USD",
    minHourlyPay: 45,
    minMonthlyPay: 7000,
    skills: "React, Next.js, Node.js, TypeScript, Tailwind CSS",
    cvFileName: "Resume_2026.pdf",
    emailAlertsEnabled: true,
    alertFrequency: "instant",
    smsAlertsEnabled: false,
    phoneNumber: "",
    carrierGatewayDomain: "txt.att.net",
  });

  const popularRoles = [
    "Full-Stack Developer",
    "Frontend Engineer",
    "Backend Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Data Analyst",
    "DevOps Engineer"
  ];

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

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          targetRoles: profile.targetRoles.split(",").map((s) => s.trim()).filter(Boolean),
          preferredLocations: profile.preferredLocations.split(",").map((s) => s.trim()).filter(Boolean),
          skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
          minHourlyPay: parseFloat(profile.minHourlyPay.toString()) || 0,
          minMonthlyPay: parseFloat(profile.minMonthlyPay.toString()) || 0,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    const rolesArray = profile.targetRoles
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    if (rolesArray.includes(role)) {
      setProfile({
        ...profile,
        targetRoles: rolesArray.filter((r) => r !== role).join(", "),
      });
    } else {
      setProfile({
        ...profile,
        targetRoles: [...rolesArray, role].join(", "),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-4 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-5">
        
        {/* Top Header Card matching Screenshot 2 Dark Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#020617] p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/40">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> ApplyBlast Radar Intake
              </span>
              <button
                onClick={() => setViewMode(viewMode === "carousel" ? "overview" : "carousel")}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700"
              >
                <Sliders className="w-3 h-3 text-indigo-400" />
                {viewMode === "carousel" ? "Full Overview" : "Question Carousel"}
              </button>
            </div>

            <h1 className="text-2xl font-black tracking-tight">Your Radar Profile</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              We personalize your job radar based on your target titles, salary floor, and CV skills.
            </p>

            {/* Progress Indicator for Carousel */}
            {viewMode === "carousel" && (
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-semibold text-indigo-300 mb-1">
                  <span>Question {currentStep} of {totalSteps}</span>
                  <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Radar preferences & alert parameters updated successfully!
          </div>
        )}

        {/* CAROUSEL MODE */}
        {viewMode === "carousel" ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
            
            {/* Step 1: Target Roles */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  What roles are you targeting?
                </div>
                <p className="text-xs text-slate-500">
                  Select the titles you want the radar to search for, or add your own.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {popularRoles.map((role) => {
                    const isSelected = profile.targetRoles
                      .toLowerCase()
                      .includes(role.toLowerCase());
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {role}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Custom Titles (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profile.targetRoles}
                    onChange={(e) => setProfile({ ...profile, targetRoles: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. AI Prompt Engineer, Growth Strategist"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Work Model & Seniority */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Target className="w-5 h-5 text-indigo-600" />
                  What is your preferred work setup?
                </div>
                <p className="text-xs text-slate-500">
                  Select how you want to work. The radar strictly excludes mismatched models.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[
                    { key: "Remote", label: "100% Remote", desc: "Work from anywhere online" },
                    { key: "Hybrid", label: "Hybrid", desc: "Mix of home & office" },
                    { key: "Onsite", label: "On-site", desc: "Physical workplace only" },
                    { key: "Any", label: "Open to All", desc: "No restrictions" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setProfile({ ...profile, workModel: m.key })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        profile.workModel === m.key
                          ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-900">{m.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Seniority Level
                  </label>
                  <select
                    value={profile.seniorityLevel}
                    onChange={(e) => setProfile({ ...profile, seniorityLevel: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Entry">Entry Level / Junior</option>
                    <option value="Mid-level">Mid-level (2-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                    <option value="Lead">Lead / Principal / Executive</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Where are you looking for opportunities?
                </div>
                <p className="text-xs text-slate-500">
                  Target countries, regions, or cities for remote timezone or physical matching.
                </p>

                <input
                  type="text"
                  value={profile.preferredLocations}
                  onChange={(e) => setProfile({ ...profile, preferredLocations: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Worldwide, US, Canada, UK, Pakistan"
                />

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="relocate"
                    checked={profile.openToRelocate}
                    onChange={(e) => setProfile({ ...profile, openToRelocate: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="relocate" className="text-xs text-slate-700 font-medium">
                    I am willing to relocate for the right role
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Pay Requirements */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  What is your compensation floor?
                </div>
                <p className="text-xs text-slate-500">
                  Set the minimum compensation. Any job offering less will be filtered out.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Currency
                    </label>
                    <select
                      value={profile.currency}
                      onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="PKR">PKR (Rs)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        Min Hourly Rate
                      </label>
                      <input
                        type="number"
                        value={profile.minHourlyPay}
                        onChange={(e) => setProfile({ ...profile, minHourlyPay: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        Min Monthly Salary
                      </label>
                      <input
                        type="number"
                        value={profile.minMonthlyPay}
                        onChange={(e) => setProfile({ ...profile, minMonthlyPay: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Resume & Skills */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Upload className="w-5 h-5 text-indigo-600" />
                  Your Resume & Skills
                </div>
                <p className="text-xs text-slate-500">
                  Your CV is parsed to generate match percentages and auto-tailor recommendations.
                </p>

                <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-3xl p-5 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {profile.cvFileName || "Resume_Active.pdf"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">CV Active on Radar Engine</p>
                  
                  <label className="mt-3 inline-block cursor-pointer bg-white border border-slate-200 shadow-sm text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-xl hover:bg-slate-50">
                    Replace CV
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
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Key Technical & Professional Skills
                  </label>
                  <input
                    type="text"
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900"
                    placeholder="e.g. Next.js, Python, PostgreSQL, Strategy"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Integrated Alerts */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  How would you like to receive alerts?
                </div>
                <p className="text-xs text-slate-500">
                  Opportunity Radar notifies you when a verified job meets all your criteria.
                </p>

                {/* Email Alert Toggle */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">Email Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.emailAlertsEnabled}
                      onChange={(e) => setProfile({ ...profile, emailAlertsEnabled: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                  </div>
                  {profile.emailAlertsEnabled && (
                    <select
                      value={profile.alertFrequency}
                      onChange={(e) => setProfile({ ...profile, alertFrequency: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                    >
                      <option value="instant">Instant Real-Time Alert</option>
                      <option value="daily">Daily Morning Digest</option>
                      <option value="weekly">Weekly Rollup</option>
                    </select>
                  )}
                </div>

                {/* Free SMS via Carrier */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">Free Carrier SMS Alerts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.smsAlertsEnabled}
                      onChange={(e) => setProfile({ ...profile, smsAlertsEnabled: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                  </div>
                  {profile.smsAlertsEnabled && (
                    <div className="space-y-2 pt-1">
                      <input
                        type="tel"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                        placeholder="Mobile Number (e.g. 5551234567)"
                      />
                      <select
                        value={profile.carrierGatewayDomain}
                        onChange={(e) => setProfile({ ...profile, carrierGatewayDomain: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                      >
                        <option value="txt.att.net">AT&T (txt.att.net)</option>
                        <option value="vtext.com">Verizon (vtext.com)</option>
                        <option value="tmomail.net">T-Mobile (tmomail.net)</option>
                        <option value="msg.fi.google.com">Google Fi</option>
                        <option value="custom">Self-Hosted Push / Webhook</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons for Carousel */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-xl hover:bg-slate-100"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-2.5 px-5 rounded-2xl shadow-sm"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSave}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 py-2.5 px-6 rounded-2xl shadow-md shadow-indigo-600/30"
                >
                  {loading ? "Activating..." : "Save & Activate Radar"}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* OVERVIEW MODE (Quick access to view all saved settings) */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Profile Summary</span>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setViewMode("carousel");
                }}
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Re-run Carousel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block">Target Roles:</span>
                <span className="font-bold text-slate-900">{profile.targetRoles || "None"}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-slate-500 block">Work Setup:</span>
                  <span className="font-bold text-slate-900">{profile.workModel}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Seniority:</span>
                  <span className="font-bold text-slate-900">{profile.seniorityLevel}</span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Pay Floor:</span>
                <span className="font-bold text-emerald-600">
                  {profile.currency} {profile.minMonthlyPay}/mo (or {profile.currency} {profile.minHourlyPay}/hr)
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Active Resume:</span>
                <span className="font-bold text-slate-900">{profile.cvFileName || "Uploaded"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Alert Delivery:</span>
                <span className="font-bold text-slate-900">
                  {profile.emailAlertsEnabled ? "Email (Active)" : "None"} •{" "}
                  {profile.smsAlertsEnabled ? "Carrier SMS (Active)" : "SMS (Off)"}
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-semibold shadow-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
