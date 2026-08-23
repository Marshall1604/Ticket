import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { EventItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface HeroSectionProps {
  heroEvents: EventItem[];
}

export function HeroSection({ heroEvents }: HeroSectionProps) {
  const primaryEvent = heroEvents[0];
  const secondaryEvent = heroEvents[1] || heroEvents[0];

  if (!primaryEvent) return null;

  return (
    <section className="pt-28 sm:pt-36 pb-12 sm:pb-20 max-w-site mx-auto px-5 sm:px-8">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span>SHOW ĐANG DIỄN RA</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-luxury-ink leading-[1.08]">
            Khoảnh khắc sân khấu <br className="hidden sm:inline" />
            <span className="italic font-normal">đích thực & độc bản.</span>
          </h1>
        </div>
        <p className="text-luxury-sage text-sm sm:text-base max-w-md">
          Tuyển tập các đêm nhạc, hòa nhạc giao hưởng và liveshow nghệ thuật chọn lọc hàng đầu mùa này.
        </p>
      </div>

      {/* Asymmetrical 2-Banner Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Primary Event Banner (Col 7 on Desktop - 16:9 Ratio, Dominant Visual) */}
        <div className="lg:col-span-7">
          <Link
            href={`/event/${primaryEvent.slug}`}
            className="group relative block w-full h-[460px] sm:h-[540px] lg:h-[580px] rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(16,35,30,0.08)] transition-all duration-300 border border-border-subtle"
          >
            <Image
              src={primaryEvent.heroImage}
              alt={primaryEvent.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Elegant Double Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C18]/95 via-[#0A1C18]/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20">
                {primaryEvent.category} • Featured
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne text-luxury-ink shadow-sm">
                Giá từ {formatVND(primaryEvent.startingPrice)}
              </span>
            </div>

            {/* Bottom Content Card */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-3 sm:space-y-4">
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-champagne">
                {primaryEvent.artist.name}
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
                {primaryEvent.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/80 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-champagne" />
                  <span>{formatEventDate(primaryEvent.dateDisplay)} • {primaryEvent.timeDisplay}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-champagne" />
                  <span>{primaryEvent.venue.name} ({primaryEvent.venue.city})</span>
                </div>
              </div>

              <div className="pt-2 sm:pt-4 flex items-center justify-between border-t border-white/15">
                <span className="text-xs sm:text-sm text-white/70">
                  {primaryEvent.subtitle || "Sự kiện được mong đợi nhất"}
                </span>
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-luxury-ink text-sm font-semibold tracking-wide shadow-md group-hover:bg-champagne transition-all duration-200">
                  <span>Xem show</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary Event Banner (Col 5 on Desktop - 3:2 Ratio) */}
        {secondaryEvent && (
          <div className="lg:col-span-5">
            <Link
              href={`/event/${secondaryEvent.slug}`}
              className="group relative block w-full h-[420px] sm:h-[540px] lg:h-[580px] rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(16,35,30,0.08)] transition-all duration-300 border border-border-subtle"
            >
              <Image
                src={secondaryEvent.heroImage}
                alt={secondaryEvent.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C18]/95 via-[#0A1C18]/45 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {secondaryEvent.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-black/40 backdrop-blur-md border border-white/10">
                  Từ {formatVND(secondaryEvent.startingPrice)}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-3">
                <div className="text-xs uppercase font-semibold tracking-widest text-champagne">
                  {secondaryEvent.artist.name}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white leading-snug">
                  {secondaryEvent.title}
                </h3>

                <div className="space-y-1.5 text-xs sm:text-sm text-white/80 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-champagne" />
                    <span>{formatEventDate(secondaryEvent.dateDisplay)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-champagne" />
                    <span>{secondaryEvent.venue.name} • {secondaryEvent.venue.city}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-white/15">
                  <span className="text-xs text-white/60">
                    Chỉ còn số lượng ít vé
                  </span>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold tracking-wide group-hover:bg-emerald-hover transition-all duration-200">
                    <span>Mua vé</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
