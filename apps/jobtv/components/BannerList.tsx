"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
}

interface BannerListProps {
  banners: Banner[];
}

export default function BannerList({ banners }: BannerListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollability();
    container.addEventListener("scroll", checkScrollability);
    window.addEventListener("resize", checkScrollability);

    return () => {
      container.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 500;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className="w-full py-6 relative">
      {/* Left fade gradient */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
      )}

      {/* Right fade gradient */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
      )}

      {/* Scroll buttons - Hide when at edges */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 hover:bg-black/95 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          aria-label="左にスクロール"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 hover:bg-black/95 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          aria-label="右にスクロール"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-6 hide-scrollbar scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        <div className="flex gap-5 px-4">
          {banners.map((banner) => (
            <a key={banner.id} href={banner.link || "#"} className="flex-shrink-0 group">
              <div className="relative aspect-[16/9] w-[250px] sm:w-[300px] md:w-[350px] overflow-hidden rounded-xl bg-gray-800 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 640px) 250px, (max-width: 768px) 300px, 350px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 origin-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 drop-shadow-lg">
                    {banner.title}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
