"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, QrCode, Download, Share2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { OrderItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";

interface TicketPassCardProps {
  order: OrderItem;
}

export function TicketPassCard({ order }: TicketPassCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Vé TICKETSHOW: ${order.eventTitle} (${order.ticketTierName}) - Mã đơn: ${order.orderNumber}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-[0_8px_32px_rgba(16,35,30,0.06)] overflow-hidden transition-all hover:shadow-[0_16px_40px_rgba(16,35,30,0.09)]">
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
            {order.orderNumber}
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
              Hạng vé
            </span>
            <span className="font-semibold text-sm sm:text-[15px] text-emerald block">
              {order.ticketTierName}
            </span>
            <span className="text-xs text-luxury-sage block">Số lượng: {order.quantity} vé</span>
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

        {/* Realistic Digital QR Pass Section with Cutout Styling */}
        <div className="p-6 rounded-2xl bg-luxury-ivory border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* QR Visual */}
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white rounded-2xl border border-border-subtle shadow-sm shrink-0">
              {/* Dynamic Clean QR Code Representation */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-luxury-dark p-2 rounded-lg flex items-center justify-center relative">
                <div className="w-full h-full border-4 border-dashed border-white/80 rounded flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>MÃ CHECK-IN TẠI CỔNG</span>
              </div>
              <div className="font-mono text-sm font-bold text-luxury-ink">
                {order.orderNumber}
              </div>
              <p className="text-xs text-luxury-sage max-w-xs">
                Xuất trình mã QR này trên điện thoại hoặc bản in khi tới cổng check-in của sự kiện.
              </p>
            </div>
          </div>

          {/* Seat Numbers Tag */}
          {order.seatNumbers && order.seatNumbers.length > 0 && (
            <div className="text-right shrink-0 bg-white p-3.5 rounded-xl border border-border-subtle">
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
            Tổng thanh toán: <strong className="text-luxury-ink">{formatVND(order.totalPrice)}</strong> (Đã xác nhận)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-luxury-ink bg-white border border-border-subtle hover:border-emerald/40 hover:text-emerald transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Đã sao chép!" : "Chia sẻ"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-emerald hover:bg-emerald-hover transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải / In vé</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
