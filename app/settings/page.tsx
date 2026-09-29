"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
export default function SettingsPage() {
  const [password, setPassword] = useState(""), [error, setError] = useState("");
  async function remove() {
    if (!window.confirm("Delete your account, CV, alerts, and application history permanently?")) return;
    const response = await fetch("/api/account/data", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { setError((await response.json()).error || "Deletion failed"); return; }
    await signOut({ callbackUrl: "/" });
  }
  return <div className="max-w-2xl mx-auto space-y-6"><h1 className="text-2xl font-bold">Settings</h1>
    <section className="bg-white border rounded-2xl p-6 space-y-3"><h2 className="font-semibold text-lg">Opportunity sources</h2><p className="text-sm text-slate-600">Scans use published Remotive and Jobicy jobs plus open GitHub issues labeled bounty. Your CV is kept in your account; only search terms derived from your goals and skills are sent to job sources.</p><Link className="text-indigo-600" href="/profile">Edit matching preferences →</Link></section>
    <section className="bg-white border rounded-2xl p-6 space-y-3"><h2 className="font-semibold text-lg">Your data</h2><p className="text-sm text-slate-600">Download your stored profile, CV text, alerts, saved listings, and application statuses.</p><a className="inline-block border rounded-lg px-4 py-2 text-sm" href="/api/account/data" download="opportunity-radar-data.json">Download my data</a></section>
    <section className="bg-white border border-red-200 rounded-2xl p-6 space-y-3"><h2 className="font-semibold text-lg">Delete account</h2><p className="text-sm text-slate-600">This permanently removes your CV, profile, alerts, and application history. Enter your password to continue.</p><input aria-label="Password to delete account" type="password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded-lg p-3 w-full" placeholder="Your password" />{error && <p role="alert" className="text-red-700 text-sm">{error}</p>}<button disabled={!password} onClick={remove} className="bg-red-700 text-white rounded-lg px-4 py-2 disabled:opacity-50">Delete my account</button></section>
  </div>;
}
