"use client";

import React, { useState, useEffect } from "react";
import { Check, Plus, Minus, ShieldCheck, Ticket, Sparkles, ArrowRight } from "lucide-react";
import { EventItem, TicketTier, OrderItem } from "@/types";
import { formatVND } from "@/lib/utils";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { useRouter } from "next/navigation";

interface TicketTierSelectorProps {
  event: EventItem;
}

export function TicketTierSelector({ event: initialEvent }: TicketTierSelectorProps) {
  const router = useRouter();
  const [currentEvent, setCurrentEvent] = useState<EventItem>(initialEvent);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ticketshow_admin_events");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const matched = parsed.find((e: EventItem) => e.id === initialEvent.id || e.slug === initialEvent.slug);
          if (matched && matched.ticketTiers) {
            setCurrentEvent(matched);
            setSelectedTier(matched.ticketTiers[0]);
          }
        } catch {
          // Fallback
        }
      }
    }
  }, [initialEvent.id, initialEvent.slug]);

  const availableTiers = currentEvent.ticketTiers;
  const initialTier = availableTiers.find((t) => t.status !== "sold_out") || availableTiers[0];

  const [selectedTier, setSelectedTier] = useState<TicketTier>(initialTier);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleTierSelect = (tier: TicketTier) => {
    if (tier.status === "sold_out") return;
    setSelectedTier(tier);
  };

  const handleIncrement = () => {
    if (quantity < Math.min(8, selectedTier.availableQuantity)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const totalAmount = selectedTier ? selectedTier.price * quantity : 0;
  const isSelectedSoldOut = selectedTier.status === "sold_out";

  const handleOrderSuccess = (order: OrderItem) => {
    setIsCheckoutOpen(false);
    router.push(`/my-tickets?order=${order.orderNumber}`);
  };

  return (
    <>
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 border border-border-subtle shadow-[0_8px_30px_rgba(16,35,30,0.04)] space-y-8">
        {/* Tier Selector Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-6">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest font-bold text-emerald">
              TICKET SELECTION
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-luxury-ink">
              Chọn hạng vé & số lượng
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-luxury-sage font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald" />
            <span>Giá niêm yết chính thức</span>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="space-y-4">
          {availableTiers.map((tier) => {
            const isSelected = selectedTier?.id === tier.id;
            const isSoldOut = tier.status === "sold_out";
            const isSellingFast = tier.status === "selling_fast";

            return (
              <div
                key={tier.id}
                onClick={() => handleTierSelect(tier)}
                className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-200 cursor-pointer ${
                  isSoldOut
                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "border-emerald bg-emerald/[0.03] ring-2 ring-emerald/20 shadow-sm"
                    : "border-border-subtle hover:border-emerald/40 bg-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Tier Info */}
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center gap-2.5">
                      <span className="font-serif text-lg sm:text-xl font-semibold text-luxury-ink">
                        {tier.name}
                      </span>
                      {tier.isPopular && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-champagne text-luxury-ink">
                          Được chọn nhiều
                        </span>
                      )}
                      {isSellingFast && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                          Chỉ còn ít vé
                        </span>
                      )}
                      {isSoldOut && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600">
                          Đã hết vé
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-luxury-sage">{tier.description}</p>

                    {/* Tier Benefits */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
                      {tier.benefits.map((benefit, bIdx) => (
                        <span
                          key={bIdx}
                          className="inline-flex items-center gap-1.5 text-[12px] text-luxury-ink/80"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald" />
                          <span>{benefit}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tier Price & Radio */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                    <div className="text-left sm:text-right">
                      <span className="font-semibold text-xl sm:text-2xl text-luxury-ink block">
                        {formatVND(tier.price)}
                      </span>
                      <span className="text-[11px] text-luxury-sage">/ vé</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-emerald bg-emerald text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantity Selector & Summary */}
        {!isSelectedSoldOut && (
          <div className="p-6 rounded-2xl bg-luxury-ivory/80 border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-luxury-sage block">
                Số lượng vé mong muốn
              </span>
              <span className="text-xs text-luxury-muted">
                Tối đa 8 vé cho mỗi giao dịch
              </span>
            </div>

            {/* Stepper (+ / -) */}
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-border-subtle shadow-sm">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-luxury-ink hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Giảm 1 vé"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-lg w-6 text-center text-luxury-ink">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= Math.min(8, selectedTier.availableQuantity)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-luxury-ink hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Tăng 1 vé"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Total Price & Primary Checkout CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-subtle">
          <div>
            <span className="text-xs uppercase tracking-wider text-luxury-sage block">
              Tổng tiền tạm tính ({quantity} vé)
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
              {formatVND(totalAmount)}
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            disabled={isSelectedSoldOut}
            className={`w-full sm:w-auto px-10 h-14 rounded-full text-base font-semibold tracking-wide inline-flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
              isSelectedSoldOut
                ? "bg-gray-200 text-luxury-muted cursor-not-allowed"
                : "bg-emerald text-white hover:bg-emerald-hover hover:-translate-y-0.5"
            }`}
          >
            <span>{isSelectedSoldOut ? "Hạng vé đã hết" : "Tiến hành mua vé"}</span>
            {!isSelectedSoldOut && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-border-subtle p-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div>
          <span className="text-[11px] text-luxury-sage block">
            {selectedTier.name} × {quantity}
          </span>
          <span className="font-bold text-lg text-luxury-ink">
            {formatVND(totalAmount)}
          </span>
        </div>
        <button
          onClick={() => setIsCheckoutOpen(true)}
          disabled={isSelectedSoldOut}
          className="px-6 py-3 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover shadow-sm active:scale-95"
        >
          {isSelectedSoldOut ? "Hết vé" : "Mua vé ngay"}
        </button>
      </div>

      {/* Checkout Modal Dialog */}
      <CheckoutModal
        event={currentEvent}
        selectedTier={selectedTier}
        quantity={quantity}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />
    </>
  );
}
