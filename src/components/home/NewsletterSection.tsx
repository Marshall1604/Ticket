"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      trackEvent({ name: "newsletter_signup", properties: { source: "homepage_bottom" } });
    }, 600);
  };

  return (
    <section className="py-20 sm:py-28 max-w-site mx-auto px-5 sm:px-8">
      <div className="relative rounded-3xl sm:rounded-[36px] bg-white border border-border-subtle p-8 sm:p-16 lg:p-20 text-center max-w-4xl mx-auto shadow-[0_12px_40px_rgba(16,35,30,0.04)] overflow-hidden">
        {/* Subtle decorative background ring */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-champagne/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald">
            <Mail className="w-4 h-4" />
            <span>PRESALE & PRIVATE ACCESS</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-luxury-ink">
            Đừng bỏ lỡ lần mở bán tiếp theo.
          </h2>

          <p className="text-luxury-sage text-sm sm:text-base leading-relaxed">
            Nhận thông báo sớm nhất về show mới, đặc quyền mua vé presale và những sự kiện nghệ thuật tuyển chọn.
          </p>

          {isSubscribed ? (
            <div className="p-6 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center gap-3 text-emerald font-semibold text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cảm ơn bạn! Chúng tôi đã ghi nhận email đăng ký nhận thông báo presale.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] px-5 rounded-full bg-luxury-ivory border border-border-subtle hover:border-emerald/40 focus:border-emerald focus:ring-2 focus:ring-emerald/10 text-sm text-luxury-ink placeholder:text-luxury-muted outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto shrink-0 h-[52px] px-8 rounded-full bg-emerald text-white text-sm font-semibold tracking-wide hover:bg-emerald-hover transition-all duration-200 active:scale-95 shadow-sm inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Đang gửi...</span>
                  ) : (
                    <>
                      <span>Nhận thông báo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[12px] text-luxury-muted">
                Chúng tôi tôn trọng quyền riêng tư của bạn. Không gửi spam, có thể hủy đăng ký bất cứ lúc nào.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
