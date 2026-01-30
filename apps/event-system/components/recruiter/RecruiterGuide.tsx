"use client";

import React, { useState } from "react";

type RecruiterGuideProps = {
  title?: string;
  items: React.ReactNode[];
  defaultOpen?: boolean;
};

export default function RecruiterGuide({
  title,
  items,
  defaultOpen = false,
}: RecruiterGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-gray-700 hover:bg-gray-100/50 transition-all text-left"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">
            {title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="px-4 pb-4 text-sm text-gray-600 space-y-1.5 ml-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
