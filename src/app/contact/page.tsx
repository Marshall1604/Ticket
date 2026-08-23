"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Headphones, Building2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "concierge",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-site mx-auto px-5 sm:px-8 space-y-16">
      <div className="max-w-2xl space-y-3">
        <div className="text-xs uppercase tracking-widest font-bold text-emerald">
          CONCIERGE & SUPPORT
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink">
          Liên hệ với TICKETSHOW
        </h1>
        <p className="text-luxury-sage text-base">
          Đội ngũ VIP Concierge và hỗ trợ đối tác của chúng tôi sẵn sàng giải đáp mọi thắc mắc của bạn 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-luxury-ink">
                  VIP Concierge Desk
                </h4>
                <p className="text-xs text-luxury-sage">
                  Hỗ trợ đặt vé VIP, vé đoàn và sự kiện riêng tư
                </p>
                <div className="text-emerald font-semibold text-sm pt-1">
                  concierge@ticketshow.vn
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-luxury-ink">
                  Hợp tác phân phối vé
                </h4>
                <p className="text-xs text-luxury-sage">
                  Dành cho Ban Tổ Chức, Nhà hát & Nhà sản xuất
                </p>
                <div className="text-emerald font-semibold text-sm pt-1">
                  partners@ticketshow.vn
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-luxury-ink">
                  Văn phòng đại diện
                </h4>
                <p className="text-xs text-luxury-sage">
                  Tòa nhà Deutsches Haus, 33 Lê Duẩn, Bến Nghé, Quận 1, TP. Hồ Chí Minh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
              Gửi tin nhắn cho chúng tôi
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center gap-3 text-emerald font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Cảm ơn bạn! Chúng tôi đã nhận được yêu cầu và sẽ phản hồi trong vòng 2 giờ làm việc.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                      Email liên hệ *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Mục đích liên hệ
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="concierge">Hỗ trợ đặt vé VIP / Vé đoàn</option>
                    <option value="organizer">Đăng ký bán vé sự kiện mới</option>
                    <option value="technical">Hỗ trợ kỹ thuật & tài khoản</option>
                    <option value="other">Ý kiến đóng góp khác</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-all duration-200 shadow-md inline-flex items-center gap-2"
                >
                  <span>Gửi yêu cầu</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
