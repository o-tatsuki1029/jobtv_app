"use client";

import React from "react";

interface StudioInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function StudioInput({ error = false, className = "", ...props }: StudioInputProps) {
  const baseStyles =
    "w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm transition-all";
  const borderStyles = error ? "border-red-500" : "border-gray-200 focus:border-black/10";

  return <input className={`${baseStyles} ${borderStyles} ${className}`} {...props} />;
}
