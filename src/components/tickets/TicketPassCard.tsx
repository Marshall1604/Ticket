"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Download, Share2, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";
import { OrderItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";
import * as htmlToImage from "html-to-image";

interface TicketPassCardProps {
  order: OrderItem;
}

export function TicketPassCard({ order }: TicketPassCardProps) {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/${order.orderNumber}`
    : `https://ticketshow.vn/verify/${order.orderNumber}`;

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setIsSaving(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Ve-Vao-Cong-TICKETSHOW-${order.orderNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Lỗi khi tải ảnh vé:", err);
      window.print();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-[0_8px_32px_rgba(16,35,30,0.06)] overflow-hidden transition-all hover:shadow-[0_16px_40px_rgba(16,35,30,0.09)]"
    >
      {/* Top Banner with Event Visual */}
      <div className="relative h-40 sm:h-48 w-full bg-luxury-dark overflow-hidden">
        <Image
          src={order.eventImage}
          alt={order.eventTitle}
          fill
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald text-white shadow-sm">
            {order.paymentStatus === "paid" ? "Vé chính thức • Đã kích hoạt" : "Chờ xác nhận"}
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/50 text-white/90 backdrop-blur-md border border-white/20">
            #{order.orderNumber}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <Link
            href={`/event/${order.eventSlug}`}
            className="font-serif text-xl sm:text-2xl font-semibold hover:text-champagne transition-colors line-clamp-1"
          >
            {order.eventTitle}
          </Link>
        </div>
      </div>

      {/* Main Boarding Pass Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Key Event Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-border-subtle">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-luxury-sage font-medium block">
              Thời gian
            </span>
            <span className="font-semibold text-sm sm:text-[15px] text-luxury-ink block">
              {formatEventDate(order.eventDate)}
            </span>
            <span className="text-xs text-luxury-sage block">{order.eventTime}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-luxury-sage font-medium block">
              Địa điểm
            </span>
            <span className="font-semibold text-sm sm:text-[15px] text-luxury-ink block line-clamp-1">
              {order.venueName}
            </span>
            <span className="text-xs text-luxury-sage block">{order.venueCity}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-luxury-sage font-medium block">
              Hạng vé & Giá
            </span>
            <span className="font-semibold text-sm sm:text-[15px] text-emerald block">
              {order.ticketTierName}
            </span>
            <span className="text-xs text-luxury-sage block">{order.quantity} vé ({formatVND(order.totalPrice)})</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-luxury-sage font-medium block">
              Người sở hữu
            </span>
            <span className="font-semibold text-sm sm:text-[15px] text-luxury-ink block truncate">
              {order.customerName}
            </span>
            <span className="text-xs text-luxury-sage block truncate">{order.customerEmail}</span>
          </div>
        </div>

        {/* Digital Boarding Pass Entry Section (No QR Code) */}
        <div className="p-5 rounded-2xl bg-luxury-ivory border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>THẺ VÉ VÀO CỔNG CHÍNH THỨC</span>
            </div>
            <div className="font-mono text-base font-bold text-luxury-ink">
              MÃ VÉ: #{order.orderNumber}
            </div>
            <p className="text-xs text-luxury-sage max-w-sm">
              Lưu hình ảnh thẻ vé về điện thoại để xuất trình trực tiếp tại cổng soát vé khi đến sự kiện.
            </p>
          </div>

          {/* Seat Numbers Tag */}
          {order.seatNumbers && order.seatNumbers.length > 0 && (
            <div className="text-center sm:text-right shrink-0 bg-white p-3.5 rounded-xl border border-border-subtle shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-luxury-sage block">
                Số ghế phân bổ
              </span>
              <span className="font-mono font-semibold text-xs sm:text-sm text-luxury-ink block">
                {order.seatNumbers.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-luxury-sage">
            Tổng tiền: <strong className="text-luxury-ink font-serif text-sm">{formatVND(order.totalPrice)}</strong> (Đã thanh toán)
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/verify/${order.orderNumber}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-semibold text-luxury-ink bg-luxury-ivory border border-border-subtle hover:border-emerald hover:text-emerald transition-colors"
            >
              <span>Xem thẻ vé</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-luxury-ink bg-white border border-border-subtle hover:border-emerald/40 hover:text-emerald transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Đã chép!" : "Chia sẻ"}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveImage}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald hover:bg-emerald-hover transition-colors shadow-sm disabled:opacity-50 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isSaving ? "Đang lưu..." : "Lưu ảnh vé vào cổng"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
