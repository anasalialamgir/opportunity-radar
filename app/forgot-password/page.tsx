"use client";
import { useState } from "react";
import Link from "next/link";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(""), [message, setMessage] = useState(""), [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMessage("");
    try { const r = await fetch("/api/account/request-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const d = await r.json(); setMessage(d.message || d.error); }
    catch { setMessage("Could not request a reset. Please retry."); } finally { setLoading(false); }
  }
  return <div className="max-w-md mx-auto p-6 bg-white border rounded-2xl space-y-5"><h1 className="text-2xl font-bold">Reset your password</h1><p className="text-sm text-slate-600">We will email a link if the address has an account.</p><form onSubmit={submit} className="space-y-4"><label className="block text-sm">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full border rounded-lg p-3 mt-2" /></label><button disabled={loading} className="bg-indigo-600 text-white rounded-lg px-5 py-3 disabled:opacity-50">Send reset link</button></form>{message && <p role="status" className="text-sm">{message}</p>}<Link className="text-indigo-600 text-sm" href="/login">Back to login</Link></div>;
}
