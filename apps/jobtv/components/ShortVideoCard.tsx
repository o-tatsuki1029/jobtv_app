"use client";

import Image from "next/image";

interface ShortVideoCardProps {
  title: string;
  thumbnail: string;
  channel: string;
  likes?: number;
  duration?: string;
}

export default function ShortVideoCard({ title, thumbnail, channel, likes, duration }: ShortVideoCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-gray-900 mb-3 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 origin-center"
          loading="lazy"
        />
        {duration && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded backdrop-blur-sm">
              {duration}
            </span>
          </div>
        )}
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <svg
            className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="px-1">
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-red-500 transition-colors mb-1.5 leading-snug">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
          <span>{channel}</span>
          {likes && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              {likes >= 10000 ? `${(likes / 10000).toFixed(1)}万` : likes.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
