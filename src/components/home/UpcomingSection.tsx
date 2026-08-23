import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { EventItem } from "@/types";
import { EventCard } from "@/components/events/EventCard";

interface UpcomingSectionProps {
  events: EventItem[];
}

export function UpcomingSection({ events }: UpcomingSectionProps) {
  const upcomingEvents = events.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-white/50 border-y border-border-subtle">
      <div className="max-w-site mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest font-bold text-emerald">
              CALENDAR HIGHLIGHTS
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink">
              Sắp diễn ra
            </h2>
            <p className="text-luxury-sage text-sm sm:text-base">
              Những sân khấu đáng mong chờ tiếp theo trong lịch trình văn hóa năm nay.
            </p>
          </div>

          <Link
            href="/shows"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald/30 text-emerald text-sm font-semibold hover:bg-emerald hover:text-white transition-all duration-200 self-start sm:self-auto shadow-sm"
          >
            <span>Xem tất cả show</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
