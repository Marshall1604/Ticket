import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, User, Calendar } from "lucide-react";
import { mockArticles } from "@/data/mockArticles";
import { formatEventDate } from "@/lib/utils";

export const metadata = {
  title: "Tạp chí TICKETSHOW — Nghệ thuật, Hậu trường & Phong cách",
  description:
    "Những câu chuyện độc quyền về hậu trường sân khấu, phỏng vấn nghệ sĩ và góc nhìn nghệ thuật thưởng thức âm nhạc đương đại.",
};

export default function JournalPage() {
  const publishedArticles = mockArticles.filter((a) => a.isPublished);
  const featuredArticle = publishedArticles.find((a) => a.isFeatured) || publishedArticles[0];
  const regularArticles = publishedArticles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-site mx-auto px-5 sm:px-8 space-y-16">
      {/* Journal Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TICKETSHOW JOURNAL & EDITORIAL</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-luxury-ink leading-[1.08]">
          Góc nhìn nghệ thuật & <br />
          <span className="italic font-normal">những câu chuyện hậu trường.</span>
        </h1>
        <p className="text-luxury-sage text-base sm:text-lg leading-relaxed">
          Nơi lưu giữ những đối thoại độc quyền với nghệ sĩ, phân tích dàn dựng sân khấu và nghi thức thưởng lãm âm nhạc đương đại.
        </p>
      </div>

      {/* Featured Article Spotlight */}
      {featuredArticle && (
        <Link
          href={`/journal/${featuredArticle.slug}`}
          className="group relative block rounded-3xl sm:rounded-[36px] overflow-hidden bg-white border border-border-subtle shadow-md hover:shadow-2xl transition-all duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-luxury-dark/10">
              <Image
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald/10 text-emerald">
                {featuredArticle.category} • Spotlight
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-luxury-ink leading-snug group-hover:text-emerald transition-colors">
                {featuredArticle.title}
              </h2>

              <p className="text-luxury-sage text-sm sm:text-base leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              <div className="flex items-center gap-4 text-xs text-luxury-sage pt-2 border-t border-border-subtle">
                <span className="font-medium text-luxury-ink">{featuredArticle.authorName}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredArticle.readingTimeMinutes} phút đọc</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Regular Articles Grid */}
      <div className="space-y-8">
        <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
          Bài viết mới nhất
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((art) => (
            <Link
              key={art.id}
              href={`/journal/${art.slug}`}
              className="group flex flex-col bg-white rounded-3xl border border-border-subtle hover:border-emerald/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-luxury-dark/10">
                <Image
                  src={art.coverImage}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                    {art.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="font-serif text-xl font-semibold text-luxury-ink group-hover:text-emerald transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-luxury-sage line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-luxury-sage">
                  <span>{art.authorName}</span>
                  <div className="flex items-center gap-1 text-emerald font-semibold group-hover:underline">
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
