import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opportunity Radar | Personalized Opportunity Discovery",
  description: "AI-powered, privacy-first opportunity discovery tailored to your real skills and interests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        
        {/* Desktop & Tablet Top Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-slate-900 hover:opacity-90 transition"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 text-base">
                📡
              </span>
              <span>
                Opportunity <span className="text-indigo-600">Radar</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 text-sm font-medium">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/saved"
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition"
              >
                Saved
              </Link>
              <Link
                href="/profile"
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition"
              >
                Settings
              </Link>
            </nav>

            {/* Desktop Quick Action */}
            <div className="hidden md:flex items-center">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 md:pb-12">
          {children}
        </main>

        {/* Desktop Footer */}
        <footer className="hidden md:block border-t border-slate-200/80 bg-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Opportunity Radar</span>
              <span>&copy; {new Date().getFullYear()}</span>
              <span>&bull;</span>
              <span>Open-Source &amp; Privacy-First</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="hover:text-slate-800 transition">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:text-slate-800 transition">
                Profile
              </Link>
              <a
                href="https://github.com/anasalialamgir/opportunity-radar"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-800 transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>

        {/* Mobile Native-Style Bottom Navigation Bar (Visible only on mobile devices) */}
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around"
        >
          <Link
            href="/"
            className="flex flex-col items-center justify-center w-14 py-1 text-slate-600 hover:text-indigo-600 active:scale-95 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium mt-1">Home</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center w-14 py-1 text-slate-600 hover:text-indigo-600 active:scale-95 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-medium mt-1">Radar</span>
          </Link>

          <Link
            href="/saved"
            className="flex flex-col items-center justify-center w-14 py-1 text-slate-600 hover:text-indigo-600 active:scale-95 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-[10px] font-medium mt-1">Saved</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center justify-center w-14 py-1 text-slate-600 hover:text-indigo-600 active:scale-95 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </Link>

          <Link
            href="/settings"
            className="flex flex-col items-center justify-center w-14 py-1 text-slate-600 hover:text-indigo-600 active:scale-95 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium mt-1">Settings</span>
          </Link>
        </nav>

      </body>
    </html>
  );
}
