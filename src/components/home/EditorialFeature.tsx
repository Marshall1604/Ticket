import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
import { EventItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";

interface EditorialFeatureProps {
  event?: EventItem;
}

export function EditorialFeature({ event }: EditorialFeatureProps) {
  if (!event) return null;

  return (
    <section className="my-16 sm:my-28 max-w-site mx-auto px-5 sm:px-8">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-luxury-dark text-white border border-white/10 shadow-2xl min-h-[520px] sm:min-h-[600px] flex flex-col justify-end p-8 sm:p-14 lg:p-16">
        {/* Full-width High Resolution Editorial Photography */}
        <Image
          src={event.heroImage}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C18] via-[#0A1C18]/60 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0A1C18]/40" />

        {/* Content Box */}
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/20 border border-champagne/40 text-champagne text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EDITORIAL SPOTLIGHT</span>
          </div>

          <div className="space-y-2">
            <div className="text-sm uppercase tracking-widest font-semibold text-champagne">
              {event.artist.name}
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]">
              {event.title}
            </h2>
          </div>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-3">
            {event.description[0]}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-white/90 pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-champagne" />
              <span>{formatEventDate(event.dateDisplay)} • {event.timeDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-champagne" />
              <span>{event.venue.name} ({event.venue.city})</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href={`/event/${event.slug}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-champagne text-luxury-ink text-sm font-semibold tracking-wide hover:bg-[#ebd3a0] hover:-translate-y-0.5 transition-all shadow-lg active:scale-95"
            >
              <span>Khám phá sự kiện</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <span className="text-xs text-white/60 sm:pl-2">
              Giá vé từ {formatVND(event.startingPrice)} • Số lượng giới hạn
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
