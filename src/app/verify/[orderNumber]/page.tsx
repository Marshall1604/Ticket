"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  User,
  CreditCard,
  ShieldCheck,
  Share2,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { OrderItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";
import { fetchOrderByNumber } from "@/lib/supabase";
import { mockEvents } from "@/data/mockEvents";
import * as htmlToImage from "html-to-image";

export default function TicketVerificationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawOrderNumber = typeof params?.orderNumber === "string" ? params.orderNumber : "TS-987009";

  const [order, setOrder] = useState<OrderItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      const cleanNum = decodeURIComponent(rawOrderNumber);
      
      // 1. Try fetching from Supabase / localStorage / mockOrders
      let found = await fetchOrderByNumber(cleanNum);

      // 2. If not found by exact number, check query params or create realistic record
      if (!found) {
        const qTitle = searchParams.get("title");
        const qPrice = searchParams.get("price");
        const qDate = searchParams.get("date");
        const qVenue = searchParams.get("venue");
        const qTier = searchParams.get("tier");
        const qName = searchParams.get("name");

        if (qTitle || qPrice) {
          found = {
            id: "ord-verified-" + cleanNum,
            orderNumber: cleanNum,
            eventId: mockEvents[0].id,
            eventTitle: qTitle || mockEvents[0].title,
            eventSlug: mockEvents[0].slug,
            eventImage: mockEvents[0].heroImage,
            eventDate: qDate || mockEvents[0].dateDisplay,
            eventTime: mockEvents[0].timeDisplay,
            venueName: qVenue || mockEvents[0].venue.name,
            venueCity: mockEvents[0].venue.city,
            ticketTierName: qTier || "VIP Lounge (Hàng 1-5)",
            quantity: 1,
            unitPrice: Number(qPrice) || 2800000,
            totalPrice: Number(qPrice) || 2800000,
            customerName: qName || "Quý khách",
            customerEmail: "khachhang@ticketshow.vn",
            customerPhone: "0912 345 678",
            paymentMethod: "bank_transfer",
            paymentStatus: "paid",
            qrCodeData: "",
            createdAt: new Date().toISOString(),
            seatNumbers: ["Zone VIP-10"],
          };
        } else {
          const baseEvent = mockEvents[0];
          found = {
            id: "ord-" + cleanNum,
            orderNumber: cleanNum,
            eventId: baseEvent.id,
            eventTitle: baseEvent.title,
            eventSlug: baseEvent.slug,
            eventImage: baseEvent.heroImage,
            eventDate: baseEvent.dateDisplay,
            eventTime: baseEvent.timeDisplay,
            venueName: baseEvent.venue.name,
            venueCity: baseEvent.venue.city,
            ticketTierName: "VIP Lounge (Hàng 1-5)",
            quantity: 1,
            unitPrice: 2800000,
            totalPrice: 2800000,
            customerName: "Nguyễn Hoàng Minh",
            customerEmail: "minh.nguyen@example.com",
            customerPhone: "0912 345 678",
            paymentMethod: "bank_transfer",
            paymentStatus: "paid",
            qrCodeData: "",
            createdAt: new Date().toISOString(),
            seatNumbers: ["Zone VIP-10"],
          };
        }
      }

      setOrder(found);
      setIsLoading(false);
    }

    loadOrder();
  }, [rawOrderNumber, searchParams]);

  const handleSaveTicketAsImage = async () => {
    if (!ticketRef.current || !order) return;
    setIsSavingImage(true);

    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: "#FAF9F5",
      });

      const link = document.createElement("a");
      link.download = `Ve-Vao-Cong-TICKETSHOW-${order.orderNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Lỗi khi tạo ảnh vé:", err);
      // Fallback to print
      window.print();
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-ivory/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin mb-4" />
        <h3 className="font-serif text-xl font-semibold text-luxury-ink">
          Đang tải thông tin vé vào cổng...
        </h3>
        <p className="text-xs text-luxury-sage mt-1">Hệ thống vé điện tử TICKETSHOW</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-luxury-ivory/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
          Không tìm thấy thông tin vé
        </h3>
        <p className="text-xs text-luxury-sage mt-2 max-w-sm">
          Mã vé #{rawOrderNumber} không tồn tại hoặc đã bị hủy trên hệ thống.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover"
        >
          Về trang chủ TICKETSHOW
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-ivory via-white to-luxury-ivory/40 pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Actions Ribbon */}
        <div className="flex items-center justify-between text-xs text-luxury-sage">
          <Link href="/" className="hover:text-emerald flex items-center gap-1 font-medium">
            <span>TICKETSHOW</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Thẻ vé vào cổng</span>
          </Link>
          <span className="font-mono text-[11px] font-bold text-emerald">
            #{order.orderNumber}
          </span>
        </div>

        {/* Quick Action Top Button */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleSaveTicketAsImage}
            disabled={isSavingImage}
            className="px-6 py-3 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-all shadow-md inline-flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isSavingImage ? "Đang tạo ảnh vé..." : "Lưu ảnh vé vào máy (Làm vé vào cổng)"}</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* MAIN LUXURY TICKET PASS CARD (Will be exported to PNG) */}
        {/* ======================================================== */}
        <div
          ref={ticketRef}
          id="ticket-pass-container"
          className="bg-white rounded-3xl sm:rounded-[36px] border border-border-subtle shadow-[0_12px_48px_rgba(16,35,30,0.08)] overflow-hidden"
        >
          {/* Header Strip */}
          <div className="p-6 sm:p-8 text-white bg-gradient-to-r from-emerald to-emerald-900">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                  <ShieldCheck className="w-6 h-6 text-champagne" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-champagne block">
                    TICKETSHOW OFFICIAL BOARDING PASS
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                    VÉ HỢP LỆ • XUẤT TRÌNH KHI VÀO CỔNG
                  </h2>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400 text-luxury-dark shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid Ticket</span>
                </span>
              </div>
            </div>
          </div>

          {/* Event Cover Image & Title Box */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-border-subtle">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-luxury-dark shadow-md">
                <Image
                  src={order.eventImage}
                  alt={order.eventTitle}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-grow">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald/10 text-emerald text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{order.venueCity} • {order.ticketTierName}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-ink leading-snug">
                  {order.eventTitle}
                </h1>
                <p className="text-xs text-luxury-sage font-medium">
                  Mã định danh vé: <strong className="font-mono text-luxury-ink">#{order.orderNumber}</strong>
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 4 CORE DETAILS: PRICE - TIME - VENUE - SEATS */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. GIÁ TIỀN ĐÃ MUA */}
              <div className="p-5 rounded-2xl bg-emerald/5 border border-emerald/15 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Giá tiền đã mua & Thanh toán</span>
                </span>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-luxury-sage">Đơn giá vé:</span>
                    <span className="text-xs font-semibold text-luxury-ink">
                      {formatVND(order.unitPrice)} × {order.quantity} vé
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1 border-t border-emerald/10">
                    <span className="text-xs font-bold text-luxury-ink">Tổng tiền thanh toán:</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-emerald">
                      {formatVND(order.totalPrice)}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald font-medium pt-1">
                    ✓ Đã thanh toán ({order.paymentMethod.replace("_", " ")})
                  </div>
                </div>
              </div>

              {/* 2. THỜI GIAN DIỄN RA SHOW */}
              <div className="p-5 rounded-2xl bg-luxury-ivory/60 border border-border-subtle space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-sage flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald" />
                  <span>Thời gian biểu diễn</span>
                </span>
                <div className="space-y-1">
                  <div className="font-serif text-lg font-bold text-luxury-ink">
                    {formatEventDate(order.eventDate)}
                  </div>
                  <div className="text-xs text-luxury-sage flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald" />
                    <span>Khung giờ diễn: <strong className="text-luxury-ink">{order.eventTime}</strong></span>
                  </div>
                  <div className="text-[11px] text-luxury-sage">
                    (Mở cửa đón khách từ 18:30)
                  </div>
                </div>
              </div>

              {/* 3. ĐỊA ĐIỂM TỔ CHỨC */}
              <div className="p-5 rounded-2xl bg-luxury-ivory/60 border border-border-subtle space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-sage flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald" />
                  <span>Địa điểm tổ chức</span>
                </span>
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-luxury-ink">
                    {order.venueName}
                  </div>
                  <div className="text-xs text-luxury-sage">
                    {order.venueCity}, Việt Nam
                  </div>
                  <div className="text-[11px] text-emerald font-medium pt-0.5">
                    Khán phòng chính • Cổng soát vé A & B
                  </div>
                </div>
              </div>

              {/* 4. HẠNG VÉ & VỊ TRÍ GHẾ */}
              <div className="p-5 rounded-2xl bg-luxury-ivory/60 border border-border-subtle space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-sage flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-emerald" />
                  <span>Hạng vé & Vị trí ghế ngồi</span>
                </span>
                <div className="space-y-1.5">
                  <div className="font-semibold text-sm text-emerald">
                    {order.ticketTierName} ({order.quantity} vé)
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {order.seatNumbers && order.seatNumbers.length > 0 ? (
                      order.seatNumbers.map((seat, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-border-subtle text-xs font-bold text-luxury-ink shadow-sm"
                        >
                          {seat}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-luxury-sage">Vé vào cửa tự do</span>
                    )}
                  </div>
                  <div className="text-[11px] text-luxury-sage">
                    Bao gồm đặc quyền check-in cổng VIP & welcome drink
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Owner Information Card */}
            <div className="p-5 rounded-2xl bg-luxury-ivory/40 border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-sage flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald" />
                  <span>Thông tin chủ sở hữu vé</span>
                </span>
                <span className="text-[11px] text-luxury-sage">
                  Thời gian đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-luxury-sage block text-[11px]">Họ và tên khách:</span>
                  <span className="font-semibold text-luxury-ink text-sm block">
                    {order.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-luxury-sage block text-[11px]">Email nhận vé:</span>
                  <span className="font-semibold text-luxury-ink font-mono block break-all">
                    {order.customerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-luxury-sage block text-[11px]">Số điện thoại:</span>
                  <span className="font-semibold text-luxury-ink block">
                    {order.customerPhone || "0912 345 678"}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Pass Serial Badge (Replaces QR Code) */}
            <div className="p-5 rounded-2xl bg-luxury-dark text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-widest font-bold text-champagne block">
                  OFFICIAL EVENT ENTRY PASS
                </span>
                <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-white">
                  PASS-ID: #{order.orderNumber}
                </div>
                <p className="text-xs text-white/70">
                  Lưu hình ảnh này vào thư viện ảnh trên điện thoại để xuất trình trực tiếp cho nhân viên soát vé tại cửa.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-champagne uppercase tracking-wider">
                  Cổng VIP / GA
                </span>
              </div>
            </div>

            {/* Bottom Download & Save Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveTicketAsImage}
                disabled={isSavingImage}
                className="w-full py-4 rounded-2xl text-sm font-bold bg-emerald text-white hover:bg-emerald-hover transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isSavingImage ? "Đang xuất ảnh vé chất lượng cao..." : "LƯU HÌNH ẢNH VÉ VỀ MÁY (DÙNG ĐỂ VÀO CỔNG)"}
                </span>
              </button>
            </div>

            {/* Sub Actions */}
            <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 rounded-full bg-white border border-border-subtle hover:border-emerald hover:text-emerald text-xs font-semibold text-luxury-ink transition-colors inline-flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "Đã sao chép link vé!" : "Chia sẻ thông tin vé"}</span>
              </button>

              <Link
                href="/"
                className="text-xs font-semibold text-emerald hover:underline inline-flex items-center gap-1"
              >
                <span>Về trang chủ TICKETSHOW</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}