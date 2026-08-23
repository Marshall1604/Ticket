import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Info,
  Share2,
  Heart,
  Users,
  Building2,
} from "lucide-react";
import { mockEvents } from "@/data/mockEvents";
import { formatVND, formatEventDate } from "@/lib/utils";
import { TicketTierSelector } from "@/components/events/TicketTierSelector";
import { EventCard } from "@/components/events/EventCard";
import { Badge } from "@/components/ui/Badge";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return mockEvents.map((e) => ({
    slug: e.slug,
  }));
}

export function generateMetadata({ params }: EventPageProps) {
  const event = mockEvents.find((e) => e.slug === params.slug);
  if (!event) return { title: "Không tìm thấy sự kiện" };

  return {
    title: `${event.title} — ${event.artist.name}`,
    description: event.description[0],
    openGraph: {
      title: `${event.title} — ${event.artist.name} | TICKETSHOW`,
      description: event.description[0],
      images: [{ url: event.heroImage, width: 1200, height: 630 }],
    },
  };
}

export default function EventDetailPage({ params }: EventPageProps) {
  const event = mockEvents.find((e) => e.slug === params.slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = mockEvents
    .filter((e) => e.id !== event.id && (e.category === event.category || e.venue.city === event.venue.city))
    .slice(0, 3);

  // Schema.org Event Structured Data
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description.join(" "),
    image: [event.heroImage, event.bannerImage],
    startDate: event.startDate,
    endDate: event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue.address,
        addressLocality: event.venue.city,
        addressCountry: "VN",
      },
    },
    performer: {
      "@type": "Person",
      name: event.artist.name,
    },
    offers: event.ticketTiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.price,
      priceCurrency: "VND",
      availability:
        tier.status === "sold_out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: `https://ticketshow.vn/event/${event.slug}`,
      validFrom: "2026-01-01T00:00:00Z",
    })),
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <div className="max-w-site mx-auto px-5 sm:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-luxury-sage">
          <Link href="/" className="hover:text-emerald transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-luxury-muted" />
          <Link href="/shows" className="hover:text-emerald transition-colors">
            Sự kiện
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-luxury-muted" />
          <span className="text-luxury-ink font-medium truncate max-w-xs sm:max-w-md">
            {event.title}
          </span>
        </nav>

        {/* Hero Visual & Key Info Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Hero Image with Editorial Framing */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl border border-border-subtle bg-luxury-dark">
              <Image
                src={event.heroImage}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <div className="absolute top-6 left-6">
                <Badge variant="dark">{event.category}</Badge>
              </div>
            </div>
          </div>

          {/* Right Column: Title & Metadata Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <Link
                href={`/artist/${event.artist.slug}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{event.artist.name}</span>
              </Link>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-luxury-ink leading-[1.1]">
                {event.title}
              </h1>

              {event.subtitle && (
                <p className="text-luxury-sage text-base sm:text-lg">
                  {event.subtitle}
                </p>
              )}
            </div>

            {/* Event Key Spec Boxes */}
            <div className="p-6 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-4">
              <div className="flex items-start gap-3.5 pb-4 border-b border-border-subtle/80">
                <div className="w-10 h-10 rounded-xl bg-emerald/8 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-emerald" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs uppercase tracking-wider text-luxury-sage block font-medium">
                    Thời gian biểu diễn
                  </span>
                  <span className="font-semibold text-sm sm:text-base text-luxury-ink">
                    {formatEventDate(event.dateDisplay)} ({event.timeDisplay})
                  </span>
                  <span className="text-xs text-luxury-muted block">
                    Mở cửa đón khách từ {event.doorTimeDisplay}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald/8 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs uppercase tracking-wider text-luxury-sage block font-medium">
                    Địa điểm tổ chức
                  </span>
                  <span className="font-semibold text-sm sm:text-base text-luxury-ink">
                    {event.venue.name}
                  </span>
                  <span className="text-xs text-luxury-muted block">
                    {event.venue.address}, {event.venue.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Price Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-luxury-ivory border border-border-subtle">
              <div>
                <span className="text-xs uppercase tracking-wider text-luxury-sage block">
                  Giá vé chính thức
                </span>
                <span className="font-bold text-xl text-emerald">
                  Từ {formatVND(event.startingPrice)}
                </span>
              </div>
              <div className="text-xs text-luxury-sage flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald" />
                <span>Vé điện tử QR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
          {/* Left Main Content: Description, Seat Map, Notices */}
          <div className="lg:col-span-7 space-y-12">
            {/* 1. About the Show */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-luxury-ink">
                Giới thiệu sự kiện
              </h2>
              <div className="space-y-4 text-luxury-sage text-[15px] sm:text-base leading-relaxed">
                {event.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 2. Artist Highlight Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-border-subtle">
                <Image
                  src={event.artist.image}
                  alt={event.artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left flex-grow">
                <div className="text-xs uppercase font-bold text-emerald tracking-widest">
                  Nghệ sĩ biểu diễn
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-luxury-ink">
                  {event.artist.name}
                </h3>
                <p className="text-xs sm:text-sm text-luxury-sage">
                  {event.artist.bio}
                </p>
                <Link
                  href={`/artist/${event.artist.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald hover:underline pt-1"
                >
                  <span>Xem các show khác của {event.artist.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Seat Map & Zone Information */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-luxury-ink">
                Sơ đồ khán phòng & vị trí ghế
              </h2>
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-4">
                <div className="aspect-[16/9] w-full rounded-2xl bg-luxury-dark/95 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden border border-white/10">
                  <Building2 className="w-10 h-10 text-champagne mb-2" />
                  <div className="font-serif text-lg font-semibold text-champagne">
                    SÂN KHẤU CHÍNH (STAGE)
                  </div>
                  <div className="w-48 h-1 bg-champagne/60 rounded-full my-4" />
                  <div className="grid grid-cols-3 gap-3 w-full max-w-md text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald/40 border border-emerald/50">
                      VIP LOUNGE
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald/60 border border-emerald/70">
                      PLATINUM
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald/40 border border-emerald/50">
                      VIP LOUNGE
                    </div>
                  </div>
                  <div className="mt-3 p-2 rounded-xl bg-white/10 border border-white/15 w-full max-w-md text-xs text-white/80">
                    STANDARD SEATED / GENERAL ADMISSION
                  </div>
                </div>
                <p className="text-xs text-luxury-sage leading-relaxed">
                  {event.seatMapInfo ||
                    "Khán phòng được thiết kế cách âm và tối ưu hóa tầm nhìn từ mọi góc độ. Chỗ ngồi sẽ được phân bổ theo thứ tự đặt vé."}
                </p>
              </div>
            </div>

            {/* 4. Important Notices */}
            {event.importantNotices && event.importantNotices.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-luxury-ink">
                  Lưu ý quan trọng khi tham gia
                </h2>
                <div className="p-6 rounded-3xl bg-white border border-border-subtle space-y-3 text-xs sm:text-sm text-luxury-sage">
                  {event.importantNotices.map((notice, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                      <span>{notice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Ticket Tier Selector & Booking Module */}
          <div className="lg:col-span-5 sticky top-24">
            <TicketTierSelector event={event} />
          </div>
        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="pt-16 border-t border-border-subtle space-y-8">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest font-bold text-emerald">
                DISCOVER MORE
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-medium text-luxury-ink">
                Sự kiện tương tự có thể bạn quan tâm
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedEvents.map((relEvent) => (
                <EventCard key={relEvent.id} event={relEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
