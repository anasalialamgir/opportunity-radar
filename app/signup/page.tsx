"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const [error, setError] = useState(""), [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const login = await signIn("credentials", { email, password, redirect: false });
      if (login?.error) throw new Error("Account created. Please log in to continue.");
      router.push("/profile/cv-upload"); router.refresh();
    } catch (err: any) { setError(err.message || "Please try again."); } finally { setLoading(false); }
  }
  return <div className="max-w-md mx-auto py-10 px-4"><h1 className="text-3xl font-bold">Start your job search</h1><p className="text-slate-600 mt-2 mb-8">Create an account, add your CV, then tell us what matters to you.</p>
    <form onSubmit={submit} className="space-y-5 bg-white border rounded-2xl p-6 shadow-sm">
      <label className="block text-sm font-medium">Name<input required value={name} onChange={e => setName(e.target.value)} className="block w-full mt-2 p-3 border rounded-lg" /></label>
      <label className="block text-sm font-medium">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full mt-2 p-3 border rounded-lg" /></label>
      <label className="block text-sm font-medium">Password (12+ characters)<input required minLength={12} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full mt-2 p-3 border rounded-lg" /></label>
      {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-indigo-600 p-3 text-white font-semibold disabled:opacity-50">{loading ? "Creating account..." : "Continue to CV →"}</button>
    </form><p className="mt-5 text-sm">Already registered? <Link href="/login" className="text-indigo-700 font-semibold">Log in</Link></p></div>;
}
