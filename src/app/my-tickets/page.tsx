"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Ticket, Calendar, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { OrderItem } from "@/types";
import { TicketPassCard } from "@/components/tickets/TicketPassCard";
import { mockEvents } from "@/data/mockEvents";

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Default demo seed ticket pass
  const defaultOrders: OrderItem[] = [
    {
      id: "ord-demo-01",
      orderNumber: "TS-882914",
      eventId: mockEvents[0].id,
      eventTitle: mockEvents[0].title,
      eventSlug: mockEvents[0].slug,
      eventImage: mockEvents[0].heroImage,
      eventDate: mockEvents[0].dateDisplay,
      eventTime: mockEvents[0].timeDisplay,
      venueName: mockEvents[0].venue.name,
      venueCity: mockEvents[0].venue.city,
      ticketTierName: "VIP Lounge (Hàng 1-5)",
      quantity: 2,
      unitPrice: 2800000,
      totalPrice: 5600000,
      customerName: "Nguyễn Hoàng Minh",
      customerEmail: "minh.nguyen@example.com",
      customerPhone: "0909 123 456",
      paymentMethod: "bank_transfer",
      paymentStatus: "paid",
      qrCodeData: "https://ticketshow.vn/verify/TS-882914",
      createdAt: "2026-08-20T10:00:00Z",
      seatNumbers: ["Zone VIP-12", "Zone VIP-13"],
    },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ticketshow_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders([...parsed, ...defaultOrders]);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setOrders(defaultOrders);
  }, []);

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return ord.paymentStatus === "paid";
    if (activeTab === "past") return ord.paymentStatus === "cancelled";
    return true;
  });

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-site mx-auto px-5 sm:px-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-subtle pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald">
            <Ticket className="w-4 h-4" />
            <span>TICKET HUB</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink">
            Vé của tôi
          </h1>
          <p className="text-luxury-sage text-sm sm:text-base">
            Quản lý vé sự kiện đã đặt, xuất trình mã QR check-in tại cổng hoặc tải bản in.
          </p>
        </div>

        <Link
          href="/shows"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-all shadow-sm self-start sm:self-auto"
        >
          <span>Khám phá thêm show</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all ${
            activeTab === "upcoming"
              ? "bg-emerald text-white shadow-sm"
              : "bg-white text-luxury-ink/70 border border-border-subtle hover:text-emerald"
          }`}
        >
          Sắp diễn ra ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all ${
            activeTab === "past"
              ? "bg-emerald text-white shadow-sm"
              : "bg-white text-luxury-ink/70 border border-border-subtle hover:text-emerald"
          }`}
        >
          Đã qua / Lịch sử (0)
        </button>
      </div>

      {/* Tickets List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-8">
          {filteredOrders.map((order) => (
            <TicketPassCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-border-subtle p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
              Chưa có vé nào trong mục này
            </h3>
            <p className="text-sm text-luxury-sage max-w-md mx-auto">
              Bạn chưa có vé nào sắp diễn ra. Hãy khám phá các chương trình liveshow mới nhất trên TICKETSHOW!
            </p>
          </div>
          <Link
            href="/shows"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-all"
          >
            <span>Khám phá sự kiện ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
