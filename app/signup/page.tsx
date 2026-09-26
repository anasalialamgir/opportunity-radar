"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, DollarSign, MapPin, Upload, CheckCircle2, Shield, ArrowRight, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    targetRoles: "Software Engineer, Product Designer",
    seniorityLevel: "Mid-level",
    workModel: "Remote",
    preferredLocations: "United States, Worldwide",
    openToRelocate: false,
    currency: "USD",
    minHourlyPay: "40",
    minMonthlyPay: "6000",
    skills: "React, TypeScript, Tailwind, Figma",
    cvFileName: "",
    emailAlertsEnabled: true,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        cvFileName: file.name,
      }));
    }
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && (!formData.email || !formData.password || formData.password.length < 8)) {
      setError("Please provide a valid email and a password with at least 8 characters.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Call registration API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          targetRoles: formData.targetRoles.split(",").map((s) => s.trim()),
          preferredLocations: formData.preferredLocations.split(",").map((s) => s.trim()),
          skills: formData.skills.split(",").map((s) => s.trim()),
          minHourlyPay: parseFloat(formData.minHourlyPay) || 0,
          minMonthlyPay: parseFloat(formData.minMonthlyPay) || 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create account.");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-3 border border-indigo-200">
            Smart Job Matching Intake
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Next Opportunity
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Step {step} of 3: {step === 1 ? "Account & Privacy" : step === 2 ? "Preferences & Pay Floor" : "Resume & Skills"}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. Alex Miller"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="alex@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="At least 8 characters"
                />
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" /> Passwords are encrypted with salted hashes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none"
              >
                Continue to Job Preferences <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Target Roles & Titles
                </label>
                <input
                  type="text"
                  value={formData.targetRoles}
                  onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. Frontend Engineer, Product Manager (comma separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Work Setup</label>
                  <select
                    value={formData.workModel}
                    onChange={(e) => setFormData({ ...formData, workModel: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">On-site</option>
                    <option value="Any">Flexible / Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Seniority</label>
                  <select
                    value={formData.seniorityLevel}
                    onChange={(e) => setFormData({ ...formData, seniorityLevel: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option value="Entry">Entry Level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead / Staff / Director</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Target Locations
                </label>
                <input
                  type="text"
                  value={formData.preferredLocations}
                  onChange={(e) => setFormData({ ...formData, preferredLocations: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. US, UK, Canada, Worldwide"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Compensation Floor (Minimums)
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-slate-900 text-xs bg-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="PKR">PKR (Rs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Min Hourly</label>
                    <input
                      type="number"
                      value={formData.minHourlyPay}
                      onChange={(e) => setFormData({ ...formData, minHourlyPay: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-slate-900 text-xs"
                      placeholder="e.g. 40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Min Monthly</label>
                    <input
                      type="number"
                      value={formData.minMonthlyPay}
                      onChange={(e) => setFormData({ ...formData, minMonthlyPay: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-slate-900 text-xs"
                      placeholder="e.g. 6000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 flex justify-center items-center gap-1 py-2.5 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800"
                >
                  Next: Resume & Skills <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload Resume / CV (PDF or DOCX)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-indigo-400 bg-slate-50 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                  <div className="mt-2 text-sm text-slate-600">
                    <label className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Click to upload your resume</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {formData.cvFileName && (
                    <p className="mt-2 text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {formData.cvFileName} attached
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Primary Skills & Technologies
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. Next.js, Python, Tailwind, Figma, Product Strategy"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  checked={formData.emailAlertsEnabled}
                  onChange={(e) => setFormData({ ...formData, emailAlertsEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="emailAlerts" className="text-sm text-slate-700">
                  Notify me as soon as a verified high-match job appears
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 flex justify-center items-center gap-1 py-2.5 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-2/3 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? "Matching Radar..." : "Complete & Open Radar"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:underline">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
