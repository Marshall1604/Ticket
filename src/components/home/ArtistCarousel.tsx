"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Artist } from "@/types";

interface ArtistCarouselProps {
  artists: Artist[];
}

export function ArtistCarousel({ artists }: ArtistCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16 max-w-site mx-auto px-5 sm:px-8 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald">
            FEATURED STARS
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-luxury-ink">
            Nghệ sĩ nổi bật
          </h2>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full border border-border-subtle hover:border-emerald bg-white text-luxury-ink hover:text-emerald hover:bg-emerald/5 transition-all active:scale-95 shadow-sm"
            aria-label="Cuộn nghệ sĩ sang trái"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full border border-border-subtle hover:border-emerald bg-white text-luxury-ink hover:text-emerald hover:bg-emerald/5 transition-all active:scale-95 shadow-sm"
            aria-label="Cuộn nghệ sĩ sang phải"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track with Touch Pan */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x snap-mandatory scroll-smooth -mx-5 px-5 sm:mx-0 sm:px-0 touch-pan-slider"
      >
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.slug}`}
            className="group flex-shrink-0 w-[150px] sm:w-[190px] lg:w-[210px] snap-start flex flex-col cursor-pointer focus:outline-none transition-transform duration-300 hover:-translate-y-1.5"
          >
            {/* 4:5 Portrait Rounded Card */}
            <div className="relative aspect-[4/5] w-full rounded-[26px] overflow-hidden bg-luxury-dark/5 border border-border-subtle transition-all duration-300 group-hover:border-emerald/40 group-hover:shadow-[0_16px_32px_rgba(14,68,55,0.14)] mb-3 hover-shimmer">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 15vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Typography */}
            <div className="space-y-0.5 px-1">
              <h3 className="font-serif text-base sm:text-lg font-medium text-luxury-ink group-hover:text-emerald transition-colors line-clamp-1 underline-offset-4 group-hover:underline">
                {artist.name}
              </h3>
              <p className="text-xs text-luxury-sage font-medium line-clamp-1">
                {artist.genre}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
