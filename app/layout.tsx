import "./globals.css";
import React from "react";
import { Navbar } from "@/components/ui/Navbar";

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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>Opportunity Radar — Privacy-first, open-source AI discovery platform.</p>
        </footer>
      </body>
    </html>
  );
}
