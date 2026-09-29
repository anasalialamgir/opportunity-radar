"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Rule = { id: string; keyword: string; minimumScore: number; enabled: boolean };
export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Rule[]>([]), [keyword, setKeyword] = useState(""), [minimumScore, setMinimumScore] = useState(60), [emailVerified, setEmailVerified] = useState(false), [error, setError] = useState("");
  async function load() { const r = await fetch("/api/alerts"); const data = await r.json(); if (!r.ok) setError(data.error); else { setAlerts(data.alerts); setEmailVerified(data.emailVerified); } }
  useEffect(() => { load(); }, []);
  async function add(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const r = await fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyword, minimumScore }) });
    const data = await r.json(); if (!r.ok) setError(data.error); else { setKeyword(""); await load(); }
  }
  async function toggle(rule: Rule) {
    const r = await fetch(`/api/alerts/${rule.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !rule.enabled }) });
    if (r.ok) load(); else setError((await r.json()).error);
  }
  async function remove(rule: Rule) {
    const r = await fetch(`/api/alerts/${rule.id}`, { method: "DELETE" });
    if (r.ok) load(); else setError((await r.json()).error);
  }
  return <div className="max-w-2xl mx-auto space-y-6"><div><h1 className="text-2xl font-bold">Job alerts</h1><p className="text-sm text-slate-600 mt-2">Receive a digest when newly scanned listings match your keyword and profile fit threshold.</p></div>
    {!emailVerified && <p className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">Verify your email before alerts can be delivered. <Link href="/profile" className="text-indigo-700 underline">Open profile</Link></p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <form onSubmit={add} className="bg-white border rounded-2xl p-5 flex flex-col sm:flex-row gap-3 sm:items-end">
      <label className="text-sm flex-1">Job keyword or * for all<input required maxLength={80} value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. Regulatory Affairs" className="block w-full border rounded-lg p-3 mt-2" /></label>
      <label className="text-sm">Minimum fit<input type="number" min={0} max={99} value={minimumScore} onChange={e => setMinimumScore(Number(e.target.value))} className="block w-28 border rounded-lg p-3 mt-2" /></label>
      <button className="bg-indigo-600 text-white rounded-lg px-5 py-3">Create alert</button>
    </form>
    {alerts.length === 0 && <p className="text-sm text-slate-500">No alerts yet.</p>}
    {alerts.map(rule => <div key={rule.id} className="bg-white border rounded-xl p-5 flex flex-wrap justify-between gap-3 items-center"><div><p className="font-semibold">{rule.keyword}</p><p className="text-sm text-slate-500">{rule.minimumScore}%+ fit · {rule.enabled ? "Active" : "Paused"}</p></div><div className="flex gap-3"><button onClick={() => toggle(rule)} className="text-indigo-700 text-sm">{rule.enabled ? "Pause" : "Resume"}</button><button onClick={() => remove(rule)} className="text-red-700 text-sm">Delete</button></div></div>)}
  </div>;
}
