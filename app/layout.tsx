import "./globals.css";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Opportunity Radar 🚀",
  description: "Privacy-first AI opportunity discovery platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 font-bold text-lg text-indigo-600 hover:text-indigo-700">
              <span>Opportunity Radar 🚀</span>
            </Link>

            <nav className="flex items-center space-x-4 sm:space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 transition">
                Dashboard
              </Link>
              <Link href="/discover" className="text-slate-600 hover:text-indigo-600 transition">
                Discover
              </Link>
              <Link href="/saved" className="text-slate-600 hover:text-indigo-600 transition">
                Saved
              </Link>
              <Link href="/profile" className="text-slate-600 hover:text-indigo-600 transition">
                Profile
              </Link>
              <Link href="/settings" className="text-slate-600 hover:text-indigo-600 transition">
                Settings
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>Opportunity Radar — Privacy-first, open-source AI discovery platform.</p>
        </footer>
      </body>
    </html>
  );
}
