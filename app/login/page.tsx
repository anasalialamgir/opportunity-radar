"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Email or password is incorrect.");
      else { router.push("/dashboard"); router.refresh(); }
    } catch { setError("Unable to log in. Please retry."); } finally { setLoading(false); }
  }
  return <div className="max-w-md mx-auto py-12 px-4"><h1 className="text-3xl font-bold mb-2">Welcome back</h1><p className="text-slate-600 mb-8">Your matches and saved jobs are waiting.</p>
    <form onSubmit={submit} className="space-y-5 bg-white p-6 rounded-2xl border shadow-sm">
      <label className="block text-sm font-medium">Email<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full mt-2 p-3 border rounded-lg" /></label>
      <label className="block text-sm font-medium">Password<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full mt-2 p-3 border rounded-lg" /></label>
      {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
      <button disabled={loading} className="w-full p-3 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50">{loading ? "Logging in..." : "Log in"}</button>
    </form><p className="mt-5 text-sm">New here? <Link href="/signup" className="text-indigo-700 font-semibold">Create an account</Link></p></div>;
}
