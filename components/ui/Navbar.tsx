"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("opportunity_radar_user_email");
    setUserEmail(email);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("opportunity_radar_user_email");
    setUserEmail(null);
    window.location.href = "/";
  };

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Discover", href: "/discover" },
    { label: "Saved", href: "/saved" },
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-base sm:text-lg text-indigo-600 hover:text-indigo-700">
          <span>Opportunity Radar 🚀</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-indigo-600 transition ${
                pathname === link.href ? "text-indigo-600 font-bold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action & Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/profile/cv-upload"
            className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>📄</span>
            <span>Upload Resume</span>
          </Link>

          {userEmail ? (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 truncate max-w-[160px]">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Log In
            </Link>
          )}
        </div>

        {/* Mobile Header Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/profile/cv-upload"
            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold border border-indigo-200"
          >
            📄 Resume
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md text-lg focus:outline-none"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/profile/cv-upload"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold"
            >
              📄 Upload Resume / CV
            </Link>
            {userEmail ? (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 truncate">{userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-bold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
