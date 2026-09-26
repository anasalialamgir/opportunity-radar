"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, CheckCircle2, ChevronRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", country: "",
    cvText: "", extractedSkills: [] as string[],
    capabilities: "", targetMonthlyIncome: "1000",
  });

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleAccountNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // Note: For MVP, we simulate parsing binary files on the frontend. 
    // In production, this file is sent to the backend API.
    setFormData((prev) => ({ ...prev, cvText: `[Extracted from ${file.name}]` }));
  };

  const handleParseCV = () => {
    setLoading(true);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, extractedSkills: ["Communication", "Project Management", "Digital Tools"] }));
      setLoading(false);
    }, 1500);
  };

  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("opportunity_radar_user_email", formData.email.toLowerCase());
      localStorage.setItem("opportunity_radar_user_name", formData.name);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
        <p className="text-sm text-slate-500 mt-1">Join the privacy-first opportunity network.</p>
        
        {/* Minimal Progress Bar */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? "bg-indigo-600" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleAccountNext} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <button type="submit" className="w-full mt-4 flex justify-between items-center px-4 py-2.5 bg-slate-900 text-white font-medium rounded-lg text-sm transition hover:bg-slate-800">
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 stroke-[1.5]" />
            <label className="cursor-pointer block">
              <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Upload CV Document</span>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX up to 5MB</p>
            {fileName && <p className="text-xs font-semibold text-slate-700 mt-3 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> {fileName}</p>}
          </div>

          <button onClick={handleParseCV} disabled={!fileName || loading} className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg text-sm transition disabled:opacity-50">
            {loading ? "Extracting Skills..." : "Process Resume"}
          </button>

          {formData.extractedSkills.length > 0 && (
            <div className="pt-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">Extracted Match Data:</p>
              <div className="flex flex-wrap gap-2">
                {formData.extractedSkills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200">{skill}</span>
                ))}
              </div>
              <button onClick={() => setStep(3)} className="w-full mt-6 flex justify-between items-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg text-sm transition hover:bg-indigo-700">
                Final Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleCompleteSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">What else can you do? (Not on CV)</label>
            <textarea rows={3} placeholder="E.g., Speak fluent Urdu, handle customer support..." value={formData.capabilities} onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Target Monthly Income (USD)</label>
            <input type="number" required value={formData.targetMonthlyIncome} onChange={(e) => setFormData({ ...formData, targetMonthlyIncome: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <button type="submit" disabled={loading} className="w-full mt-4 flex justify-center items-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg text-sm transition hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Setting up Radar..." : "Launch Dashboard"}
          </button>
        </form>
      )}
    </div>
  );
}
