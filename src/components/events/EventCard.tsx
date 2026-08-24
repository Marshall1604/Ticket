import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { EventItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface EventCardProps {
  event: EventItem;
  layout?: "grid" | "horizontal";
  priority?: boolean;
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const isSoldOut = event.status === "sold_out";
  const eventSlug = event.slug || event.id || "event";
  const artistName = event.artist?.name || "Nghệ sĩ";
  const venueName = event.venue?.name || "Địa điểm";
  const venueCity = event.venue?.city || "Toàn quốc";
  const heroImg = event.heroImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="group flex flex-col bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle hover:border-emerald/40 transition-all duration-300 shadow-[0_4px_20px_rgba(16,35,30,0.03)] hover:shadow-[0_20px_48px_rgba(14,68,55,0.12)] hover:-translate-y-2 overflow-hidden h-full">
      {/* Card Image Container */}
      <Link
        href={`/event/${eventSlug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-luxury-dark/5 block cursor-pointer hover-shimmer"
        tabIndex={-1}
      >
        <Image
          src={heroImg}
          alt={event.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <Badge variant="dark">{event.category || "Liveshow"}</Badge>
          {isSoldOut ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-900/90 text-rose-100 border border-rose-500/30 backdrop-blur-md">
              Hết vé
            </span>
          ) : event.isSellingFast ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-900/80 text-amber-100 border border-amber-500/30 backdrop-blur-md">
              Sắp hết vé
            </span>
          ) : null}
        </div>

        {/* Bottom Date Badge in Image */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/95 text-xs font-semibold tracking-wide backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full border border-white/15">
          <Calendar className="w-3.5 h-3.5 text-champagne" />
          <span>{formatEventDate(event.dateDisplay || "31.12.2026")}</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {/* Artist & Show Name */}
          <div className="text-xs uppercase font-bold tracking-widest text-emerald">
            {artistName}
          </div>
          <Link
            href={`/event/${eventSlug}`}
            className="block group-hover:text-emerald transition-colors"
          >
            <h3 className="font-serif text-xl sm:text-[22px] font-semibold text-luxury-ink leading-snug line-clamp-2">
              {event.title}
            </h3>
          </Link>
          <div className="flex items-start gap-1.5 text-xs text-luxury-sage pt-1">
            <MapPin className="w-3.5 h-3.5 text-luxury-muted shrink-0 mt-0.5" />
            <span className="line-clamp-1">{venueName} • {venueCity}</span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-luxury-sage block font-medium">
              Giá vé từ
            </span>
            <span className="font-semibold text-[17px] text-luxury-ink">
              {formatVND(event.startingPrice || 650000)}
            </span>
          </div>

          <Link
            href={`/event/${eventSlug}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 ${
              isSoldOut
                ? "bg-gray-100 text-luxury-muted cursor-not-allowed pointer-events-none"
                : "bg-emerald/10 text-emerald hover:bg-emerald hover:text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            }`}
          >
            <span>{isSoldOut ? "Hết vé" : "Xem vé"}</span>
            {!isSoldOut && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
