"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, FileText, LogOut, Bell } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setUserEmail(localStorage.getItem("opportunity_radar_user_email"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("opportunity_radar_user_email");
    localStorage.removeItem("opportunity_radar_user_name");
    setUserEmail(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 tracking-tight hover:opacity-80 transition">
          <Radar className="w-5 h-5 text-indigo-600 stroke-[2]" />
          <span>Opportunity Radar</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <Link href="/discover" className={`hover:text-slate-900 transition ${pathname === "/discover" ? "text-slate-900 font-semibold" : ""}`}>Discover</Link>
          <Link href="/dashboard" className={`hover:text-slate-900 transition ${pathname === "/dashboard" ? "text-slate-900 font-semibold" : ""}`}>Dashboard</Link>
          <Link href="/alerts" className={`hover:text-slate-900 transition ${pathname === "/alerts" ? "text-slate-900 font-semibold" : ""}`}>Alerts</Link>
          <Link href="/saved" className={`hover:text-slate-900 transition ${pathname === "/saved" ? "text-slate-900 font-semibold" : ""}`}>Saved</Link>
        </nav>

        {/* Action Buttons & Auth */}
        <div className="flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="hidden sm:block text-xs text-slate-500 font-medium px-2 py-1 rounded-md border border-transparent hover:border-slate-200 truncate max-w-[150px] transition"
              >
                {userEmail}
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition flex items-center gap-1"
                title="Log Out"
              >
                <LogOut className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition">
                Log In
              </Link>
              <Link href="/signup" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-sm transition">
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload CV</span>
                <span className="sm:hidden">Start</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
