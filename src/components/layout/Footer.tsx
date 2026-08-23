import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxury-dark text-white/90 pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-site mx-auto px-5 sm:px-8">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                TICKETSHOW
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-champagne mb-1" />
            </Link>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-md">
              Your access to unforgettable moments. Nền tảng phân phối vé hòa nhạc, liveshow và sự kiện văn hóa nghệ thuật cao cấp hàng đầu tại Việt Nam.
            </p>
            <div className="flex items-center gap-3 pt-2 text-champagne text-xs font-medium uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-champagne" />
              <span>100% Vé chính thức từ Ban Tổ Chức</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-champagne">Khám phá</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <Link href="/shows" className="text-white/70 hover:text-white transition-colors">
                    Show All
                  </Link>
                </li>
                <li>
                  <Link href="/shows?filter=artists" className="text-white/70 hover:text-white transition-colors">
                    Featured Artists
                  </Link>
                </li>
                <li>
                  <Link href="/shows?filter=upcoming" className="text-white/70 hover:text-white transition-colors">
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link href="/shows?city=hcm" className="text-white/70 hover:text-white transition-colors">
                    TP. Hồ Chí Minh
                  </Link>
                </li>
                <li>
                  <Link href="/shows?city=hanoi" className="text-white/70 hover:text-white transition-colors">
                    Hà Nội
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-champagne">Hỗ trợ</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                    Liên hệ Ban Tổ Chức
                  </Link>
                </li>
                <li>
                  <Link href="/about#faq" className="text-white/70 hover:text-white transition-colors">
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link href="/about#policy" className="text-white/70 hover:text-white transition-colors">
                    Chính sách hoàn vé
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                    Hỗ trợ VIP Concierge
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-champagne">Tài khoản</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                    Đăng nhập / Đăng ký
                  </Link>
                </li>
                <li>
                  <Link href="/my-tickets" className="text-white/70 hover:text-white transition-colors">
                    Vé của tôi
                  </Link>
                </li>
                <li>
                  <Link href="/my-tickets" className="text-white/70 hover:text-white transition-colors">
                    Lịch sử đặt vé
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-white/40 hover:text-champagne transition-colors inline-flex items-center gap-1">
                    <span>Admin Portal</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-champagne">Pháp lý</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <Link href="/about#terms" className="text-white/70 hover:text-white transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link href="/about#privacy" className="text-white/70 hover:text-white transition-colors">
                    Quy định quyền riêng tư
                  </Link>
                </li>
                <li>
                  <Link href="/about#security" className="text-white/70 hover:text-white transition-colors">
                    Bảo mật thanh toán
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {currentYear} TICKETSHOW Vietnam. All rights reserved. Designed for unforgettable live moments.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-white transition-colors cursor-pointer">Spotify</span>
            <span className="hover:text-white transition-colors cursor-pointer">Facebook</span>
            <span className="hover:text-white transition-colors cursor-pointer">YouTube</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
