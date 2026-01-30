"use client";

import React from "react";

type RefreshButtonProps = {
  onClick: () => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export default function RefreshButton({
  onClick,
  isLoading = false,
  disabled = false,
  className = "",
  label = "表示を更新",
}: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={async () => {
        await onClick();
      }}
      disabled={isLoading || disabled}
      className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm min-h-[40px] ${className}`}
    >
      <svg
        className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}





