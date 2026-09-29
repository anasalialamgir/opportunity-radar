"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { OpportunityAssistance } from "@/lib/ai/assistance";
type Opp = { title: string; company?: string; description: string; sourceUrl: string; source: string; location?: string; matchScore?: number | null; reasons: string[]; concerns: string[]; publishedAt?: string };
export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const [opp, setOpp] = useState<Opp | null>(null), [assist, setAssist] = useState<OpportunityAssistance | null>(null), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  useEffect(() => { fetch(`/api/opportunities/${encodeURIComponent(params.id)}`).then(r => r.json()).then(d => d.opportunity ? setOpp(d.opportunity) : setError(d.error)).catch(() => setError("Could not load listing.")); }, [params.id]);
  async function generate() {
    setLoading(true); setError("");
    try { const res = await fetch(`/api/opportunities/${encodeURIComponent(params.id)}/assist`, { method: "POST" }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setAssist(data.assistance); }
    catch (err: any) { setError(err.message || "AI unavailable"); } finally { setLoading(false); }
  }
  return <div className="max-w-3xl mx-auto space-y-6"><Link className="text-indigo-600 text-sm" href="/dashboard">← Back to matches</Link>{error && <p role="alert" className="text-red-700">{error}</p>}
    {!opp && !error && <p>Loading job...</p>}
    {opp && <><section className="bg-white p-6 rounded-2xl border space-y-4"><div><h1 className="text-2xl font-bold">{opp.title}</h1><p className="text-slate-600 text-sm mt-2">{opp.company || "Company unstated"} · {opp.location || "Location unstated"} · {opp.source}</p></div>
      {opp.matchScore != null && <p className="font-semibold text-indigo-700">{opp.matchScore}% profile fit</p>}
      {opp.reasons.map((r, i) => <p key={i} className="text-sm text-emerald-700">{r}</p>)}{opp.concerns.map((c, i) => <p key={i} className="text-sm text-amber-700">{c}</p>)}
      <p className="text-sm whitespace-pre-line text-slate-700">{opp.description}</p><a target="_blank" rel="noopener noreferrer" className="inline-block bg-slate-900 text-white rounded-lg px-5 py-3 text-sm" href={opp.sourceUrl}>View original listing ↗</a></section>
      <section className="bg-white p-6 rounded-2xl border space-y-4"><h2 className="text-xl font-bold">Application help</h2><p className="text-sm text-slate-600">Generate a draft based on your saved profile. Check all claims before using it.</p>
        <button onClick={generate} disabled={loading} className="bg-indigo-600 text-white rounded-lg px-5 py-3 disabled:opacity-50">{loading ? "Generating..." : "Generate tailored advice"}</button>
        {assist && <><p className="text-sm">{assist.summary}</p><h3 className="font-semibold">Why it fits</h3><p className="text-sm">{assist.fitExplanation}</p><h3 className="font-semibold">Prepare</h3><ul className="list-disc pl-5 text-sm">{assist.preparationAdvice.map((s, i) => <li key={i}>{s}</li>)}</ul><h3 className="font-semibold">Draft to edit</h3><textarea className="w-full border rounded-lg p-3" rows={8} defaultValue={assist.suggestedApplicationDraft} /></>}
      </section></>}
  </div>;
}
