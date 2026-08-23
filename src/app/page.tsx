import React from "react";
import { mockEvents } from "@/data/mockEvents";
import { mockArtists } from "@/data/mockArtists";
import { HeroSection } from "@/components/home/HeroSection";
import { ArtistCarousel } from "@/components/home/ArtistCarousel";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import { UpcomingSection } from "@/components/home/UpcomingSection";
import { EditorialFeature } from "@/components/home/EditorialFeature";
import { TrustSection } from "@/components/home/TrustSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata = {
  title: "TICKETSHOW — Nền tảng bán vé sự kiện & hòa nhạc cao cấp",
  description:
    "Khám phá các liveshow, hòa nhạc giao hưởng và sự kiện văn hóa nghệ thuật chọn lọc hàng đầu. Đặt vé chính thức nhanh chóng, bảo mật và tiện lợi.",
  openGraph: {
    title: "TICKETSHOW — Your access to unforgettable moments",
    description: "Nền tảng phân phối vé hòa nhạc & liveshow cao cấp hàng đầu Việt Nam.",
    type: "website",
  },
};

export default function HomePage() {
  // Hero shows
  const heroEvents = mockEvents.filter((e) => e.isHero);
  // Featured editorial show
  const featuredEditorial = mockEvents.find((e) => e.id === "evt-01") || mockEvents[0];
  // Featured artists
  const featuredArtists = mockArtists;

  return (
    <div className="min-h-screen">
      {/* 1. Live / Current Events (Hero) */}
      <HeroSection heroEvents={heroEvents} />

      {/* 2. Featured Artists */}
      <ArtistCarousel artists={featuredArtists} />

      {/* 3. Discover Events with Realtime Filters */}
      <DiscoverSection events={mockEvents} />

      {/* 4. Upcoming Shows Highlights */}
      <UpcomingSection events={mockEvents} />

      {/* 5. Full-width Editorial Showcase */}
      <EditorialFeature event={featuredEditorial} />

      {/* 6. Why Ticketshow Trust Pillars */}
      <TrustSection />

      {/* 7. How It Works 3-Step Flow */}
      <HowItWorks />

      {/* 8. Newsletter & Presale Sign-up */}
      <NewsletterSection />
    </div>
  );
}
