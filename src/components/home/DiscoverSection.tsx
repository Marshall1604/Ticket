"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, RotateCcw, MapPin, Calendar, Sparkles } from "lucide-react";
import { EventCategory, EventCity, EventDateFilter, EventItem } from "@/types";
import { EventCard } from "@/components/events/EventCard";
import { trackEvent } from "@/lib/analytics";

interface DiscoverSectionProps {
  events: EventItem[];
}

const CATEGORIES: EventCategory[] = [
  "Tất cả",
  "Liveshow",
  "Âm nhạc",
  "Festival",
  "Theater",
  "Comedy",
  "Conference",
];

const CITIES: EventCity[] = [
  "Tất cả",
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Đà Lạt",
];

const DATES: { label: string; value: EventDateFilter }[] = [
  { label: "Tất cả ngày", value: "all" },
  { label: "Hôm nay", value: "today" },
  { label: "Cuối tuần này", value: "weekend" },
  { label: "Tháng này", value: "this_month" },
];

export function DiscoverSection({ events: initialEvents }: DiscoverSectionProps) {
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEvents);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("Tất cả");
  const [selectedCity, setSelectedCity] = useState<EventCity>("Tất cả");
  const [selectedDate, setSelectedDate] = useState<EventDateFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ticketshow_admin_events");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEventsList(parsed);
          }
        } catch {
          // Fallback
        }
      }
    }
  }, []);

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      // Category check
      if (selectedCategory !== "Tất cả" && evt.category !== selectedCategory) {
        return false;
      }
      // City check
      if (selectedCity !== "Tất cả" && evt.venue.city !== selectedCity) {
        return false;
      }
      // Date filter check (mock filter logic)
      if (selectedDate === "weekend") {
        // demo condition
      }
      // Search query check
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchArtist = evt.artist.name.toLowerCase().includes(q);
        const matchVenue = evt.venue.name.toLowerCase().includes(q);
        const matchCity = evt.venue.city.toLowerCase().includes(q);
        if (!matchTitle && !matchArtist && !matchVenue && !matchCity) {
          return false;
        }
      }
      return true;
    });
  }, [eventsList, selectedCategory, selectedCity, selectedDate, searchQuery]);

  const handleCategoryChange = (cat: EventCategory) => {
    setSelectedCategory(cat);
    trackEvent({ name: "filter_event", properties: { category: cat } });
  };

  const handleCityChange = (city: EventCity) => {
    setSelectedCity(city);
    trackEvent({ name: "filter_event", properties: { city: city } });
  };

  const handleReset = () => {
    setSelectedCategory("Tất cả");
    setSelectedCity("Tất cả");
    setSelectedDate("all");
    setSearchQuery("");
  };

  const hasActiveFilter =
    selectedCategory !== "Tất cả" ||
    selectedCity !== "Tất cả" ||
    selectedDate !== "all" ||
    searchQuery.trim() !== "";

  return (
    <section id="discover" className="py-16 sm:py-24 max-w-site mx-auto px-5 sm:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald">
            EXPLORE EVENTS
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink">
            Khám phá sự kiện
          </h2>
          <p className="text-luxury-sage text-sm sm:text-base">
            Tìm kiếm sân khấu tiếp theo theo thể loại, địa điểm và nghệ sĩ bạn yêu thích.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Tìm nghệ sĩ hoặc sự kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-border-subtle hover:border-emerald/40 focus:border-emerald focus:ring-2 focus:ring-emerald/10 text-sm text-luxury-ink placeholder:text-luxury-muted transition-all outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-luxury-muted absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Filter Row: Categories */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex-shrink-0 h-10 px-5 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200 select-none cursor-pointer ${
                  isSelected
                    ? "bg-emerald text-white shadow-sm"
                    : "bg-white text-luxury-ink/80 border border-border-subtle hover:border-emerald/40 hover:text-emerald"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Bar: Cities, Dates & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* City Selector */}
            <div className="flex items-center gap-1 bg-white border border-border-subtle rounded-full px-3 py-1.5 text-xs text-luxury-ink shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald" />
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value as EventCity)}
                className="bg-transparent border-none outline-none font-medium cursor-pointer pr-2"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city === "Tất cả" ? "Tất cả thành phố" : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Quick Selector */}
            <div className="flex items-center gap-1 bg-white border border-border-subtle rounded-full px-3 py-1.5 text-xs text-luxury-ink shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-emerald" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value as EventDateFilter)}
                className="bg-transparent border-none outline-none font-medium cursor-pointer pr-2"
              >
                {DATES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Action */}
          {hasActiveFilter && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-luxury-sage hover:text-emerald transition-colors py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-border-subtle p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-semibold text-luxury-ink">
              Không tìm thấy sự kiện phù hợp
            </h3>
            <p className="text-sm text-luxury-sage max-w-sm mx-auto">
              Vui lòng thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc địa điểm / thể loại.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors"
          >
            Xem tất cả sự kiện
          </button>
        </div>
      )}
    </section>
  );
}
