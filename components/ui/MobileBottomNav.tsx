"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Radar, Bookmark, User, Bell } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Radar", href: "/dashboard", icon: Radar },
    { label: "Alerts", href: "/alerts", icon: Bell },
    { label: "Saved", href: "/saved", icon: Bookmark },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 md:hidden pb-safe">
      <div className="flex justify-around items-center px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-12 py-1 transition-colors ${
                isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
              <span className={`text-[9px] mt-1 tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
