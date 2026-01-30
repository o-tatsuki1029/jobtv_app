"use client";

import React from "react";

interface StudioTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export default function StudioTextarea({ error = false, className = "", ...props }: StudioTextareaProps) {
  const baseStyles =
    "w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm leading-relaxed transition-all";
  const borderStyles = error ? "border-red-500" : "border-gray-200 focus:border-black/10";

  return <textarea className={`${baseStyles} ${borderStyles} ${className}`} {...props} />;
}
