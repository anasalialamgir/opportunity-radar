"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
function ResetForm() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState(""), [message, setMessage] = useState(""), [done, setDone] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); const r = await fetch("/api/account/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) }); const d = await r.json(); setDone(r.ok); setMessage(r.ok ? "Password updated. Log in with your new password." : d.error);
  }
  return <div className="max-w-md mx-auto p-6 bg-white border rounded-2xl space-y-5"><h1 className="text-2xl font-bold">Choose a new password</h1>{!done && <form onSubmit={submit} className="space-y-4"><label className="block text-sm">New password (12+ characters)<input type="password" required minLength={12} value={password} onChange={e => setPassword(e.target.value)} className="block w-full border rounded-lg p-3 mt-2" /></label><button disabled={!token} className="bg-indigo-600 text-white rounded-lg px-5 py-3 disabled:opacity-50">Update password</button></form>}{message && <p role="status" className="text-sm">{message}</p>}<Link className="text-indigo-600" href="/login">Log in</Link></div>;
}
export default function ResetPasswordPage() { return <Suspense fallback={<p>Loading...</p>}><ResetForm /></Suspense>; }
