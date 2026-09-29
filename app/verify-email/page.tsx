"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
function Verify() {
  const token = useSearchParams().get("token") || "";
  const [message, setMessage] = useState("Checking link...");
  useEffect(() => {
    if (!token) { setMessage("Missing verification token."); return; }
    fetch("/api/account/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }).then(r => r.json().then(d => ({ ok: r.ok, data: d }))).then(({ ok, data }) => setMessage(ok ? "Email verified. You can now receive job alerts." : data.error)).catch(() => setMessage("Verification failed. Please retry."));
  }, [token]);
  return <div className="max-w-md mx-auto p-6 bg-white border rounded-2xl space-y-4"><h1 className="text-2xl font-bold">Email verification</h1><p role="status">{message}</p><Link href="/dashboard" className="text-indigo-600">Go to dashboard →</Link></div>;
}
export default function VerifyEmailPage() { return <Suspense fallback={<p>Loading...</p>}><Verify /></Suspense>; }
