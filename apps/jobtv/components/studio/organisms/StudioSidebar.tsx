"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { STUDIO_NAVIGATION } from "../constants";
import StudioNavItem from "../molecules/StudioNavItem";

export default function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-black text-white">
      <div className="p-6">
        <Link href="/studio" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="text-black font-black text-xl">J</span>
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">JobTV Studio</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {STUDIO_NAVIGATION.map((item) => (
          <StudioNavItem
            key={item.name}
            name={item.name}
            href={item.href}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors group">
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
