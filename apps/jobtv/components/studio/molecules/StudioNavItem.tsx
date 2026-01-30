"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

interface StudioNavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}

export default function StudioNavItem({
  name,
  href,
  icon: Icon,
  isActive,
  onClick,
  variant = "desktop"
}: StudioNavItemProps) {
  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-4 rounded-lg font-medium transition-colors ${
          isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"
        }`}
      >
        <Icon className="w-6 h-6" />
        {name}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive ? "bg-white text-black shadow-md shadow-black/5" : "text-gray-400 hover:text-white hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        {name}
      </div>
      {isActive && <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
    </Link>
  );
}
