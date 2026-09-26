"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  ArrowRight, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load user profile
        const profRes = await fetch("/api/profile");
        let profData = null;
        if (profRes.ok) {
          const resJson = await profRes.json();
          profData = resJson.profile;
          setProfile(profData);
        }

        // Fetch smart matched jobs
        const jobsRes = await fetch("/api/discover");
        if (jobsRes.ok) {
          const jJson = await jobsRes.json();
          setJobs(jJson.opportunities || []);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isAuthenticatedWithCV = Boolean(session && (profile?.cvFileName || profile?.skills?.length));

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-4 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-5">
        
        {/* HERO BANNER: Adapts dynamically based on login & CV state */}
        {!isAuthenticatedWithCV ? (
          /* Unauthenticated State */
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#020617] p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-sm text-slate-200 tracking-wider uppercase border border-white/10">
                Unlock Your Personal Radar
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Upload your CV to see exact match percentages & AI application drafts.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never browse 10,000 irrelevant jobs again. The Radar only surfaces roles that match what you can actually do.
              </p>
              <div className="space-y-2 pt-2">
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-2xl text-xs shadow-md shadow-indigo-600/30 transition-all"
                >
                  Sign Up & Upload Resume 📄
                </Link>
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-4 rounded-2xl text-xs transition-all"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated & CV Uploaded State */
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#020617] p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Personal Radar Active
                </span>
                <Link
                  href="/profile"
                  className="text-[11px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1"
                >
                  Edit Profile <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <h2 className="text-xl font-black tracking-tight">
                Matching Opportunities for {session?.user?.name || "You"}
              </h2>
              
              <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                  📄 {profile?.cvFileName || "Active CV"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                  💼 {profile?.targetRoles?.[0] || profile?.targetRoles || "Software Engineer"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                  💰 {profile?.currency || "USD"} {profile?.minMonthlyPay || "5,000"}+/mo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SMART MATCHED JOBS LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              Top Matched Opportunities ({jobs.length})
            </h3>
            <Link href="/discover" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-3 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {job.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className="flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {job.matchScore || 92}% Match
                </span>
              </div>

              {/* Matched Skill Badges */}
              {job.matchedSkills && job.matchedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold self-center">Matches CV:</span>
                  {job.matchedSkills.map((sk: string) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-900">
                  {job.compensation || "$120,000 / yr"}
                </span>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Apply <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
