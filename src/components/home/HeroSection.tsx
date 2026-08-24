"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { EventItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";

interface HeroSectionProps {
  heroEvents: EventItem[];
}

export function HeroSection({ heroEvents }: HeroSectionProps) {
  const events = heroEvents && heroEvents.length > 0 ? heroEvents : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = events.length;
  const currentEvent = events[currentIndex] || events[0];
  const nextEvent = events[(currentIndex + 1) % (total || 1)];

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || total <= 1) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlay, total, nextSlide]);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!currentEvent) return null;

  return (
    <section
      className="pt-24 sm:pt-36 pb-12 sm:pb-20 max-w-site mx-auto px-4 sm:px-8 overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-10">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span>SHOW ĐANG DIỄN RA • MỞ BÁN VÉ CHÍNH THỨC</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-luxury-ink leading-[1.08]">
            Khoảnh khắc sân khấu <br className="hidden sm:inline" />
            <span className="italic font-normal">đích thực & độc bản.</span>
          </h1>
        </div>

        {/* Carousel Navigation on Desktop */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Slide trước"
              className="w-11 h-11 rounded-full border border-border-subtle bg-white hover:border-emerald text-luxury-ink hover:text-emerald hover:bg-emerald/5 transition-all flex items-center justify-center shadow-sm active:scale-95 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Slide tiếp theo"
              className="w-11 h-11 rounded-full border border-border-subtle bg-white hover:border-emerald text-luxury-ink hover:text-emerald hover:bg-emerald/5 transition-all flex items-center justify-center shadow-sm active:scale-95 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Carousel Banner */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch"
      >
        {/* Primary Event Banner with Slide Animation */}
        <div className="lg:col-span-8 relative">
          <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[580px] rounded-3xl sm:rounded-[36px] overflow-hidden shadow-[0_16px_48px_rgba(16,35,30,0.08)] border border-border-subtle bg-luxury-dark group hover-card-luxury">
            <Image
              key={currentEvent.id + "-img"}
              src={currentEvent.heroImage}
              alt={currentEvent.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay with subtle ambient lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C18]/95 via-[#0A1C18]/45 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

            {/* Top Badges */}
            <div className="absolute top-5 left-5 right-5 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-none z-10">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-sm">
                {currentEvent.category} • Nổi bật
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-champagne text-luxury-ink shadow-sm">
                Từ {formatVND(currentEvent.startingPrice)}
              </span>
            </div>

            {/* Mobile Slide Swipe Hint Indicator */}
            <div className="absolute top-5 right-5 sm:hidden z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/50 text-white/90 backdrop-blur-md border border-white/20">
                {currentIndex + 1} / {total}
              </span>
            </div>

            {/* Mobile Floating Arrow Buttons */}
            <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none sm:hidden z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Content Info Box */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-2.5 sm:space-y-4 z-10">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-champagne flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentEvent.artist?.name}</span>
              </div>

              <Link href={`/event/${currentEvent.slug || currentEvent.id}`}>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-snug hover:text-champagne transition-colors line-clamp-2">
                  {currentEvent.title}
                </h2>
              </Link>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/85 pt-0.5">
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-champagne shrink-0" />
                  <span>{formatEventDate(currentEvent.dateDisplay)} • {currentEvent.timeDisplay}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-champagne shrink-0" />
                  <span className="line-clamp-1">{currentEvent.venue?.name} ({currentEvent.venue?.city})</span>
                </div>
              </div>

              <div className="pt-2 sm:pt-4 flex items-center justify-between border-t border-white/15">
                <span className="text-xs sm:text-sm text-white/70 hidden sm:inline line-clamp-1 max-w-sm">
                  {currentEvent.subtitle || "Sự kiện được mong đợi nhất mùa này"}
                </span>

                <Link
                  href={`/event/${currentEvent.slug || currentEvent.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-emerald text-white hover:bg-emerald-hover text-xs sm:text-sm font-bold tracking-wide shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group/btn"
                >
                  <span>Đặt vé ngay</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Slide Indicator Bar on Mobile & Tablet */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {events.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Chuyển đến show ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  currentIndex === idx
                    ? "w-8 bg-emerald shadow-sm"
                    : "w-2 bg-border-subtle hover:bg-emerald/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Secondary Featured Preview Banner (Desktop Col 4) */}
        {nextEvent && (
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-between space-y-4">
            <div className="text-xs uppercase tracking-widest font-bold text-luxury-sage">
              SỰ KIỆN KẾ TIẾP (TIẾP THEO)
            </div>

            <div
              onClick={nextSlide}
              className="group relative block w-full h-[510px] rounded-[32px] overflow-hidden shadow-md border border-border-subtle cursor-pointer hover-card-luxury bg-luxury-dark"
            >
              <Image
                src={nextEvent.heroImage}
                alt={nextEvent.title}
                fill
                priority
                sizes="35vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C18]/95 via-[#0A1C18]/50 to-transparent" />

              <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {nextEvent.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-champagne bg-black/40 backdrop-blur-md border border-white/10">
                  Từ {formatVND(nextEvent.startingPrice)}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2.5">
                <div className="text-xs uppercase font-bold tracking-widest text-champagne">
                  {nextEvent.artist?.name}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-white leading-snug group-hover:text-champagne transition-colors line-clamp-2">
                  {nextEvent.title}
                </h3>

                <div className="space-y-1 text-xs text-white/80 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-champagne" />
                    <span>{formatEventDate(nextEvent.dateDisplay)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-champagne" />
                    <span className="line-clamp-1">{nextEvent.venue?.name} • {nextEvent.venue?.city}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-white/15 text-xs text-champagne font-bold">
                  <span>Nhấn để xem show này →</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Quick Slide Dots Pill */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-luxury-ivory border border-border-subtle text-xs text-luxury-sage font-medium">
              <span>Đang phát: Show {currentIndex + 1} / {total}</span>
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="inline-flex items-center gap-1 text-emerald hover:underline font-bold"
              >
                {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isAutoPlay ? "Tạm dừng" : "Tự động trượt"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}