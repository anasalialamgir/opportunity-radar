"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Compass, Bookmark, User, LogOut, Upload } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string | null; email?: string | null } | null>(null);

  useEffect(() => {
    // Check user session safely without requiring external context providers
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const links = [
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Radar", href: "/dashboard", icon: Target },
    { label: "Saved", href: "/saved", icon: Bookmark },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">
            Opportunity <span className="text-indigo-600">Radar</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth State Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>{user.name || user.email?.split("@")[0]}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" /> Upload CV
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
