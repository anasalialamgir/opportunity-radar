"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("opportunity_radar_user_email");
    setUserEmail(email);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("opportunity_radar_user_email");
    localStorage.removeItem("opportunity_radar_user_name");
    setUserEmail(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-base sm:text-lg text-indigo-600 hover:text-indigo-700">
          <span>Opportunity Radar 🚀</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link
            href="/discover"
            className={`hover:text-indigo-600 transition ${
              pathname === "/discover" ? "text-indigo-600 font-bold" : ""
            }`}
          >
            Discover
          </Link>
          <Link
            href="/dashboard"
            className={`hover:text-indigo-600 transition ${
              pathname === "/dashboard" ? "text-indigo-600 font-bold" : ""
            }`}
          >
            Radar Dashboard
          </Link>
          <Link
            href="/saved"
            className={`hover:text-indigo-600 transition ${
              pathname === "/saved" ? "text-indigo-600 font-bold" : ""
            }`}
          >
            Saved
          </Link>
        </nav>

        {/* Action Buttons & Auth */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/signup"
            className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>📄</span>
            <span className="hidden sm:inline">Upload Resume / CV</span>
            <span className="sm:hidden">Resume</span>
          </Link>

          {userEmail ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 truncate max-w-[120px] sm:max-w-[160px]"
                title={userEmail}
              >
                {userEmail}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-700 font-bold px-1.5 py-1"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-block px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
