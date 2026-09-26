"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Radar } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("opportunity_radar_user_email", email.trim().toLowerCase());
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-[60vh] flex flex-col justify-center px-4">
      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-8">
          <Radar className="w-8 h-8 text-indigo-600 mx-auto mb-3 stroke-[2]" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Log in to check your opportunity radar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg text-sm transition hover:bg-slate-800 disabled:opacity-50">
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
