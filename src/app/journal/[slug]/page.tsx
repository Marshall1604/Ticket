import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, ArrowLeft, Share2, Sparkles } from "lucide-react";
import { mockArticles } from "@/data/mockArticles";
import { formatEventDate } from "@/lib/utils";

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return mockArticles.map((a) => ({
    slug: a.slug,
  }));
}

export function generateMetadata({ params }: ArticleDetailPageProps) {
  const article = mockArticles.find((a) => a.slug === params.slug);
  if (!article) return { title: "Không tìm thấy bài viết" };

  return {
    title: `${article.title} — Tạp chí TICKETSHOW`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage, width: 1200, height: 630 }],
    },
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = mockArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = mockArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-4xl mx-auto px-5 sm:px-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-luxury-sage">
        <Link href="/" className="hover:text-emerald transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-luxury-muted" />
        <Link href="/journal" className="hover:text-emerald transition-colors">
          Tạp chí
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-luxury-muted" />
        <span className="text-luxury-ink font-medium truncate max-w-xs sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Article Header */}
      <div className="space-y-6">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald/10 text-emerald">
          {article.category}
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink leading-[1.12]">
          {article.title}
        </h1>

        <p className="text-luxury-sage text-base sm:text-lg leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author Strip */}
        <div className="flex items-center justify-between py-4 border-y border-border-subtle text-xs text-luxury-sage">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              {article.authorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-luxury-ink block text-sm">
                {article.authorName}
              </span>
              <span>Ban Biên Tập TICKETSHOW</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readingTimeMinutes} phút đọc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Cover Photography */}
      <div className="relative aspect-[16/9] w-full rounded-3xl sm:rounded-[36px] overflow-hidden shadow-xl border border-border-subtle bg-luxury-dark/10">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Article Markdown Body */}
      <div className="prose prose-lg max-w-none text-luxury-ink leading-relaxed space-y-6 text-[16px] sm:text-[17px]">
        {article.content.split("\n\n").map((paragraph, idx) => {
          if (paragraph.startsWith("### ")) {
            return (
              <h3
                key={idx}
                className="font-serif text-2xl sm:text-3xl font-semibold text-luxury-ink pt-6"
              >
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          return <p key={idx} className="leading-relaxed text-luxury-ink/90">{paragraph}</p>;
        })}
      </div>

      {/* Related Articles Strip */}
      {relatedArticles.length > 0 && (
        <div className="pt-12 border-t border-border-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
              Bài viết liên quan
            </h3>
            <Link
              href="/journal"
              className="text-xs font-semibold text-emerald hover:underline"
            >
              Xem tất cả bài viết →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/journal/${rel.slug}`}
                className="group p-6 rounded-3xl bg-white border border-border-subtle hover:border-emerald/30 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald uppercase tracking-wider">
                    {rel.category}
                  </span>
                  <h4 className="font-serif text-lg font-semibold text-luxury-ink group-hover:text-emerald transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <span className="text-xs text-luxury-sage pt-4 block">
                  {rel.authorName} • {rel.readingTimeMinutes} phút đọc
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
