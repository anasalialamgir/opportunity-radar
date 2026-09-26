import "./globals.css";
import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";

export const metadata = {
  title: "Opportunity Radar 🚀 — AI Opportunity Discovery",
  description: "Privacy-first AI opportunity discovery platform. Matches what you can actually do with real opportunities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        {/* pb-20 on mobile ensures bottom navigation never covers your content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-6">
          {children}
        </main>
        <footer className="hidden md:block border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>Opportunity Radar — Privacy-first, open-source AI discovery platform.</p>
        </footer>
        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
