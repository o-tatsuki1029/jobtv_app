"use client";

import React from "react";

type ButtonVariant =
  | "primary" // 青
  | "danger" // 赤（濃い）
  | "success" // 緑
  | "secondary" // グレー
  | "light"; // 薄いグレー

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) => {
  const baseClass =
    "rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    danger: "bg-red-700 hover:bg-red-800 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    light: "bg-gray-200 hover:bg-gray-300 text-gray-700",
  };

  // iPad向けにタッチしやすさを保ちつつ、一覧性を優先
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm min-h-[40px] touch-manipulation",
    md: "px-5 py-2.5 text-sm min-h-[40px] touch-manipulation",
    lg: "px-6 py-3 text-base min-h-[44px] touch-manipulation",
  };

  const classes = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;
