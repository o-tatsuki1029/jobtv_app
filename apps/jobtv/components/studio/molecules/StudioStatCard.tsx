"use client";

import React from "react";
import { ArrowUpRight, LucideIcon } from "lucide-react";

interface StudioStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
}

export default function StudioStatCard({
  label,
  value,
  icon: Icon,
  change,
  changeType = "neutral"
}: StudioStatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        {change && (
          <span
            className={`flex items-center text-xs font-bold px-2 py-1 rounded ${
              changeType === "increase"
                ? "text-green-600 bg-green-50"
                : changeType === "decrease"
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600 bg-gray-50"
            }`}
          >
            {changeType === "increase" && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-black mt-1 text-gray-900">{value}</p>
    </div>
  );
}
