"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "Discover", href: "/discover", icon: "🧭" },
    { label: "Radar", href: "/dashboard", icon: "📡" },
    { label: "Saved", href: "/saved", icon: "💾" },
    { label: "Profile", href: "/profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden py-1 px-2 flex justify-around items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
              isActive
                ? "text-indigo-600 font-bold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className={`text-[10px] mt-1 ${isActive ? "font-bold text-indigo-600" : ""}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
