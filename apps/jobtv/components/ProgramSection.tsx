"use client";

import { useRef, useState, useEffect } from "react";
import ProgramCard from "./ProgramCard";

interface Program {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  time?: string;
  viewers?: number;
  isLive?: boolean;
  likes?: number;
}

interface ProgramSectionProps {
  title: string;
  programs: Program[];
  showMore?: boolean;
  largeCards?: boolean;
  vertical?: boolean;
}

export default function ProgramSection({
  title,
  programs,
  showMore = true,
  largeCards = false,
  vertical = false
}: ProgramSectionProps) {
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

    const scrollAmount = 400;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  if (vertical) {
    return (
      <section className="mb-2 py-0">
        <div className="container mx-auto px-4">
          {title && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
                {showMore && (
                  <a
                    href="#"
                    className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors flex items-center gap-1 group"
                  >
                    もっと見る
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
              {!vertical && <div className="border-b border-gray-700"></div>}
            </div>
          )}
          <div className="relative -mx-4 px-4">
            {/* Left fade gradient */}
            {canScrollLeft && (
              <div className="absolute left-4 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
            )}

            {/* Right fade gradient */}
            {canScrollRight && (
              <div className="absolute right-4 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
            )}

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pb-6 hide-scrollbar scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
            >
              <div className="flex gap-4 min-w-max px-4">
                {programs.map((program) => (
                  <div key={program.id} className="w-[120px] sm:w-[140px] md:w-[160px] flex-shrink-0">
                    <ProgramCard
                      title={program.title}
                      thumbnail={program.thumbnail}
                      channel={program.channel}
                      time={program.time}
                      viewers={program.viewers}
                      isLive={program.isLive}
                      likes={program.likes}
                      vertical={vertical}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll buttons */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 hover:bg-black/95 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 hover:bg-black/95 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
                aria-label="右にスクロール"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        {title && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
              {showMore && (
                <a
                  href="#"
                  className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors flex items-center gap-1 group"
                >
                  もっと見る
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
            <div className="border-b border-gray-700"></div>
          </div>
        )}
        <div
          className={`grid gap-5 ${
            largeCards
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          }`}
        >
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              title={program.title}
              thumbnail={program.thumbnail}
              channel={program.channel}
              time={program.time}
              viewers={program.viewers}
              isLive={program.isLive}
              likes={program.likes}
              vertical={vertical}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
