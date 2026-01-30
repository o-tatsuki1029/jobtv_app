"use client";

import React from "react";

interface StudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function StudioButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className = "",
  ...props
}: StudioButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-black text-white shadow-lg shadow-black/10 hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "bg-white border border-gray-200 text-gray-900 shadow-sm hover:bg-gray-50",
    danger: "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700",
    ghost: "text-gray-500 hover:text-black hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
