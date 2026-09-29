"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Item = { id: string; title: string; company?: string; status: string; source: string };
export default function SavedPage() {
  const [items, setItems] = useState<Item[]>([]), [error, setError] = useState("");
  useEffect(() => { fetch("/api/opportunities/status").then(r => r.json()).then(d => d.items ? setItems(d.items) : setError(d.error)).catch(() => setError("Unable to load saved jobs.")); }, []);
  async function update(id: string, status: string) {
    const res = await fetch("/api/opportunities/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ opportunityId: id, action: "status", status }) });
    if (res.ok) setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    else setError((await res.json()).error || "Could not update status.");
  }
  return <div className="max-w-4xl mx-auto space-y-5"><h1 className="text-2xl font-bold">Saved jobs and applications</h1><p className="text-sm text-slate-600">Track the applications you submit yourself.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!items.length && !error && <p className="bg-white border rounded-xl p-8">No saved jobs yet. <Link className="text-indigo-600" href="/discover">Explore listings</Link>.</p>}
    {items.map(item => <div key={item.id} className="bg-white border rounded-xl p-5 flex flex-wrap justify-between gap-4"><div><Link className="font-semibold hover:text-indigo-600" href={`/opportunities/${item.id}`}>{item.title}</Link><p className="text-sm text-slate-500">{item.company || "Company unstated"} · {item.source}</p></div><label className="text-sm">Status <select className="ml-2 border rounded-lg p-2" value={item.status} onChange={e => update(item.id, e.target.value)}>{["Saved", "Preparing", "Applied", "Interview", "Offer", "Rejected", "Closed"].map(x => <option key={x}>{x}</option>)}</select></label></div>)}
  </div>;
}
