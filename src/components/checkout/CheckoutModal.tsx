"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Check, ShieldCheck, CreditCard, Building2, Smartphone, ArrowRight, X, AlertCircle, Sparkles, ExternalLink, Download } from "lucide-react";
import { EventItem, TicketTier, OrderItem } from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import * as htmlToImage from "html-to-image";

interface CheckoutModalProps {
  event: EventItem;
  selectedTier: TicketTier;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: OrderItem) => void;
}

export function CheckoutModal({
  event,
  selectedTier,
  quantity,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"info" | "payment" | "processing" | "success">("info");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "credit_card" | "momo">("bank_transfer");
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const totalAmount = selectedTier.price * quantity;

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ họ tên, email và số điện thoại.");
      return;
    }
    setErrorMsg("");
    setStep("payment");
    trackEvent({
      name: "begin_checkout",
      properties: {
        eventId: event.id,
        tierName: selectedTier.name,
        quantity,
        totalAmount,
      },
    });
  };

  const handlePaymentComplete = () => {
    setStep("processing");

    setTimeout(() => {
      const orderNumber = "TS-" + Math.floor(100000 + Math.random() * 900000);
      const newOrder: OrderItem = {
        id: "order-" + Date.now(),
        orderNumber,
        eventId: event.id,
        eventTitle: event.title,
        eventSlug: event.slug,
        eventImage: event.heroImage,
        eventDate: event.dateDisplay,
        eventTime: event.timeDisplay,
        venueName: event.venue.name,
        venueCity: event.venue.city,
        ticketTierName: selectedTier.name,
        quantity,
        unitPrice: selectedTier.price,
        totalPrice: totalAmount,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        paymentMethod,
        paymentStatus: "paid",
        qrCodeData: `https://ticketshow.vn/verify/${orderNumber}`,
        createdAt: new Date().toISOString(),
        seatNumbers: Array.from({ length: quantity }, (_, i) => `Zone ${selectedTier.name.slice(0, 3).toUpperCase()}-${10 + i}`),
      };

      // Save order in localStorage for realistic demo persistence
      try {
        const existingOrders = JSON.parse(localStorage.getItem("ticketshow_orders") || "[]");
        localStorage.setItem("ticketshow_orders", JSON.stringify([newOrder, ...existingOrders]));
      } catch {
        // Fallback
      }

      trackEvent({
        name: "purchase_success",
        properties: {
          orderId: newOrder.id,
          eventId: event.id,
          totalAmount,
          ticketCount: quantity,
        },
      });

      setCompletedOrder(newOrder);
      setStep("success");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-border-subtle flex items-center justify-between bg-luxury-ivory/60">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-emerald">
              SECURE CHECKOUT
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-luxury-ink">
              {step === "info" && "Thông tin người nhận vé"}
              {step === "payment" && "Phương thức thanh toán"}
              {step === "processing" && "Đang xử lý đơn hàng..."}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-luxury-muted hover:text-luxury-ink rounded-full hover:bg-black/5 transition-colors"
            aria-label="Đóng cửa sổ đặt vé"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="px-6 sm:px-8 py-4 bg-emerald/5 border-b border-emerald/10 flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="font-semibold text-emerald">{event.title}</span>
            <span className="text-luxury-sage block sm:inline sm:ml-2">
              ({selectedTier.name} × {quantity})
            </span>
          </div>
          <div className="text-right">
            <span className="font-bold text-luxury-ink text-base">
              {formatVND(totalAmount)}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Customer Info */}
          {step === "info" && (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-luxury-ink uppercase tracking-wider">
                  Họ và tên người nhận vé *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/50 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-luxury-ink uppercase tracking-wider">
                    Email nhận vé điện tử *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/50 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-luxury-ink uppercase tracking-wider">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/50 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-luxury-ivory border border-border-subtle text-xs text-luxury-sage space-y-1">
                <div className="font-semibold text-luxury-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald" />
                  <span>Vé điện tử có mã QR sẽ được gửi trực tiếp đến email này</span>
                </div>
                <p>Thông tin của bạn được bảo mật tuyệt đối và chỉ dùng cho mục đích xác thực tại cổng sự kiện.</p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-luxury-sage hover:text-luxury-ink transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-all duration-200 shadow-md inline-flex items-center gap-2 active:scale-95"
                >
                  <span>Tiếp tục thanh toán</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Selector */}
          {step === "payment" && (
            <div className="space-y-6">
              <div className="space-y-3">
                {/* Option 1: Chuyển khoản QR */}
                <label
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "bank_transfer"
                      ? "border-emerald bg-emerald/5 shadow-sm"
                      : "border-border-subtle hover:border-emerald/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1 accent-emerald"
                  />
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-luxury-ink">
                        Chuyển khoản Ngân hàng (VietQR tức thì)
                      </span>
                      <Building2 className="w-4 h-4 text-emerald" />
                    </div>
                    <p className="text-xs text-luxury-sage">
                      Quét mã QR tự động xác nhận trong 15 giây, hỗ trợ toàn bộ ngân hàng tại Việt Nam.
                    </p>
                  </div>
                </label>

                {/* Option 2: Thẻ Quốc Tế */}
                <label
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "credit_card"
                      ? "border-emerald bg-emerald/5 shadow-sm"
                      : "border-border-subtle hover:border-emerald/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="mt-1 accent-emerald"
                  />
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-luxury-ink">
                        Thẻ tín dụng / Thẻ ghi nợ Quốc tế (Visa, Mastercard)
                      </span>
                      <CreditCard className="w-4 h-4 text-emerald" />
                    </div>
                    <p className="text-xs text-luxury-sage">
                      Cổng thanh toán mã hóa SSL 256-bit chuẩn PCI-DSS an toàn tuyệt đối.
                    </p>
                  </div>
                </label>

                {/* Option 3: Ví MoMo / VNPay */}
                <label
                  onClick={() => setPaymentMethod("momo")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "momo"
                      ? "border-emerald bg-emerald/5 shadow-sm"
                      : "border-border-subtle hover:border-emerald/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="mt-1 accent-emerald"
                  />
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-luxury-ink">
                        Ví điện tử (MoMo / VNPay)
                      </span>
                      <Smartphone className="w-4 h-4 text-emerald" />
                    </div>
                    <p className="text-xs text-luxury-sage">
                      Thanh toán nhanh một chạm trên ứng dụng ví điện tử của bạn.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setStep("info")}
                  className="text-xs sm:text-sm font-semibold text-luxury-sage hover:text-luxury-ink"
                >
                  ← Quay lại thông tin
                </button>
                <button
                  onClick={handlePaymentComplete}
                  className="px-8 py-3.5 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-all duration-200 shadow-md inline-flex items-center gap-2 active:scale-95"
                >
                  <span>Hoàn tất thanh toán ({formatVND(totalAmount)})</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === "processing" && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="font-serif text-xl font-semibold text-luxury-ink">
                  Đang khởi tạo vé điện tử của bạn...
                </h4>
                <p className="text-xs sm:text-sm text-luxury-sage">
                  Vui lòng không đóng trình duyệt. Chúng tôi đang lưu mã QR vào tài khoản của bạn.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success with Instant Ticket Pass & Save as Image */}
          {step === "success" && completedOrder && (
            <div className="space-y-5 animate-fade-in text-center">
              <div className="p-3.5 rounded-2xl bg-emerald/10 border border-emerald/20 text-emerald flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-serif text-base sm:text-lg font-bold">
                  ĐẶT VÉ THÀNH CÔNG • VÉ ĐÃ SẴN SÀNG!
                </span>
              </div>

              {/* Luxury Boarding Pass Container to be exported as Image */}
              <div
                ref={ticketRef}
                className="p-5 rounded-3xl bg-white border border-border-subtle shadow-md space-y-4 text-left"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald to-emerald-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-champagne block">
                      TICKETSHOW BOARDING PASS
                    </span>
                    <h4 className="font-serif text-base font-bold line-clamp-1">{completedOrder.eventTitle}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md">
                    #{completedOrder.orderNumber}
                  </span>
                </div>

                {/* Order Info Breakdown */}
                <div className="space-y-2 text-xs bg-luxury-ivory/60 p-4 rounded-2xl border border-border-subtle">
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-luxury-sage">Tổng tiền đã mua:</span>
                    <span className="font-serif text-sm font-bold text-emerald">
                      {formatVND(completedOrder.totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pb-2 border-b border-border-subtle">
                    <span className="text-luxury-sage">Thời gian biểu diễn:</span>
                    <span className="font-semibold text-luxury-ink text-right">
                      {formatEventDate(completedOrder.eventDate)} ({completedOrder.eventTime})
                    </span>
                  </div>

                  <div className="flex justify-between items-start pb-2 border-b border-border-subtle">
                    <span className="text-luxury-sage">Địa điểm:</span>
                    <span className="font-semibold text-luxury-ink text-right max-w-[220px]">
                      {completedOrder.venueName} ({completedOrder.venueCity})
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-luxury-sage">Hạng vé & Ghế:</span>
                    <span className="font-semibold text-emerald">
                      {completedOrder.ticketTierName} • {completedOrder.seatNumbers?.join(", ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-luxury-sage">Chủ sở hữu vé:</span>
                    <span className="font-semibold text-luxury-ink">{completedOrder.customerName}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-luxury-dark text-white text-center">
                  <span className="text-[10px] uppercase tracking-wider text-champagne font-bold block">
                    XUẤT TRÌNH HÌNH ẢNH NÀY KHI VÀO CỔNG SỰ KIỆN
                  </span>
                  <span className="font-mono text-xs text-white/80 font-bold">
                    PASS-ID: #{completedOrder.orderNumber}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Save Ticket as Image */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    if (!ticketRef.current || !completedOrder) return;
                    setIsSavingImage(true);
                    try {
                      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
                        quality: 0.98,
                        pixelRatio: 2,
                        backgroundColor: "#ffffff",
                      });
                      const link = document.createElement("a");
                      link.download = `Ve-Vao-Cong-TICKETSHOW-${completedOrder.orderNumber}.png`;
                      link.href = dataUrl;
                      link.click();
                    } catch (err) {
                      console.error("Lỗi khi lưu ảnh vé:", err);
                    } finally {
                      setIsSavingImage(false);
                    }
                  }}
                  disabled={isSavingImage}
                  className="w-full py-3.5 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-colors shadow-md inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isSavingImage ? "Đang tạo ảnh vé..." : "LƯU HÌNH ẢNH VÉ VỀ MÁY (DÙNG ĐỂ VÀO CỔNG)"}
                  </span>
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/verify/${completedOrder.orderNumber}`}
                    target="_blank"
                    className="flex-1 py-2.5 rounded-full bg-luxury-ivory border border-border-subtle text-xs font-semibold text-luxury-ink hover:border-emerald hover:text-emerald transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <span>Xem thẻ vé chi tiết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onSuccess(completedOrder)}
                    className="flex-1 py-2.5 rounded-full bg-emerald/10 text-emerald text-xs font-semibold hover:bg-emerald hover:text-white transition-colors"
                  >
                    Đến mục Vé của tôi →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
