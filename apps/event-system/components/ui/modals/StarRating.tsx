"use client";

import { useState } from "react";

type StarRatingProps = {
  rating: number | null;
  onRatingChange?: (rating: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  maxRating?: number;
};

export default function StarRating({
  rating,
  onRatingChange,
  disabled = false,
  readOnly = false,
  size = "md",
  maxRating = 5,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10 md:w-12 md:h-12",
  };

  const handleClick = (value: number) => {
    if (!disabled && !readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!disabled && !readOnly) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && !readOnly) {
      setHoveredRating(null);
    }
  };

  const displayRating = hoveredRating ?? rating ?? 0;

  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1 md:gap-1.5 relative">
      <div className="flex items-center gap-1 md:gap-1.5">
        {stars.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled || readOnly}
            className={`${
              sizeClasses[size]
            } transition-all touch-manipulation ${
              disabled || readOnly
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            <svg
              className={`${sizeClasses[size]} ${
                value <= displayRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 fill-gray-300"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      <div className="absolute left-full flex items-center h-full">
        {rating && (
          <span className="ml-2 text-xs md:text-sm text-gray-600 whitespace-nowrap">
            {rating}/{maxRating}
          </span>
        )}
      </div>
    </div>
  );
}
