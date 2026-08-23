import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Music, Calendar, MapPin, Sparkles, Disc } from "lucide-react";
import { mockArtists } from "@/data/mockArtists";
import { mockEvents } from "@/data/mockEvents";
import { EventCard } from "@/components/events/EventCard";

interface ArtistPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return mockArtists.map((a) => ({
    slug: a.slug,
  }));
}

export function generateMetadata({ params }: ArtistPageProps) {
  const artist = mockArtists.find((a) => a.slug === params.slug);
  if (!artist) return { title: "Không tìm thấy nghệ sĩ" };

  return {
    title: `${artist.name} — Nghệ sĩ nổi bật`,
    description: artist.bio,
    openGraph: {
      title: `${artist.name} | TICKETSHOW`,
      description: artist.bio,
      images: [{ url: artist.image, width: 800, height: 1000 }],
    },
  };
}

export default function ArtistDetailPage({ params }: ArtistPageProps) {
  const artist = mockArtists.find((a) => a.slug === params.slug);

  if (!artist) {
    notFound();
  }

  const artistEvents = mockEvents.filter((e) => e.artist.id === artist.id || e.artist.slug === artist.slug);

  return (
    <div className="pt-24 sm:pt-32 pb-24 max-w-site mx-auto px-5 sm:px-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-luxury-sage">
        <Link href="/" className="hover:text-emerald transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-luxury-muted" />
        <span className="text-luxury-sage">Nghệ sĩ</span>
        <ChevronRight className="w-3.5 h-3.5 text-luxury-muted" />
        <span className="text-luxury-ink font-medium">{artist.name}</span>
      </nav>

      {/* Artist Profile Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-border-subtle shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12">
        {/* 4:5 Portrait Rounded Rectangle (Non-circular) */}
        <div className="relative w-48 sm:w-60 aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg border border-border-subtle shrink-0">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Artist Information */}
        <div className="space-y-4 text-center md:text-left flex-grow">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{artist.genre}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-luxury-ink tracking-tight">
            {artist.name}
          </h1>

          <p className="text-luxury-sage text-sm sm:text-base leading-relaxed max-w-2xl">
            {artist.bio}
          </p>

          {artist.highlightTrack && (
            <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-luxury-ink">
              <Disc className="w-4 h-4 text-champagne animate-spin" />
              <span>Tác phẩm tiêu biểu: &quot;{artist.highlightTrack}&quot;</span>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Shows of this Artist */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald">
            PERFORMANCES
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium text-luxury-ink">
            Lịch diễn sắp tới của {artist.name}
          </h2>
        </div>

        {artistEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {artistEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-border-subtle text-center space-y-3">
            <p className="text-luxury-sage text-sm">
              Hiện tại {artist.name} chưa có lịch diễn công bố mới. Hãy đăng ký nhận bản tin để nhận thông báo presale sớm nhất!
            </p>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover"
            >
              Nhận thông báo presale
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
