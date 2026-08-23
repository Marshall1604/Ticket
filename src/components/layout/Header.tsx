"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Ticket, User, Menu, X, ArrowRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "SHOW ALL", href: "/shows" },
    { name: "TẠP CHÍ", href: "/journal" },
    { name: "VÉ CỦA TÔI", href: "/my-tickets" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 header-glass",
          isScrolled
            ? "py-3.5 border-b border-border-subtle shadow-[0_4px_20px_rgba(16,35,30,0.03)]"
            : "py-5 border-b border-transparent"
        )}
      >
        <div className="max-w-site mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-luxury-ink focus:outline-none"
            aria-label="TICKETSHOW Trang chủ"
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-emerald transition-colors group-hover:text-emerald-hover">
              TICKETSHOW
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-champagne mb-1" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[13px] lg:text-[14px] font-semibold tracking-wider transition-colors duration-200 relative py-1",
                    isActive
                      ? "text-emerald font-bold"
                      : "text-luxury-ink/80 hover:text-emerald"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="p-2.5 text-luxury-ink/60 hover:text-emerald hover:bg-emerald/5 rounded-full transition-colors hidden sm:inline-flex"
              title="Trang quản trị Admin"
            >
              <Shield className="w-4 h-4" />
            </Link>

            <Link
              href="/shows"
              className="p-2.5 text-luxury-ink/70 hover:text-emerald hover:bg-emerald/5 rounded-full transition-colors hidden sm:inline-flex"
              aria-label="Tìm kiếm sự kiện"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              href="/my-tickets"
              className="p-2.5 text-luxury-ink/70 hover:text-emerald hover:bg-emerald/5 rounded-full transition-colors hidden sm:inline-flex"
              aria-label="Vé đã mua"
            >
              <Ticket className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-wide bg-emerald text-white hover:bg-emerald-hover hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-luxury-ink hover:text-emerald rounded-lg focus:outline-none"
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-luxury-ivory pt-24 px-6 flex flex-col justify-between pb-8 animate-fade-in">
          <div className="flex flex-col space-y-6">
            <div className="text-xs uppercase tracking-widest text-luxury-sage font-medium">
              Menu điều hướng
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-2xl font-display font-semibold text-luxury-ink hover:text-emerald py-2 border-b border-border-subtle"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-5 h-5 text-luxury-muted" />
                </Link>
              ))}

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-lg font-semibold text-emerald py-2 border-b border-border-subtle"
              >
                <span>Bảng điều khiển Admin</span>
                <Shield className="w-5 h-5" />
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-border-subtle">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-emerald text-white text-base font-medium shadow-sm active:scale-95 transition-transform"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập / Đăng ký</span>
            </Link>
            <div className="text-center text-xs text-luxury-sage">
              TICKETSHOW • Nền tảng phân phối vé sự kiện cao cấp
            </div>
          </div>
        </div>
      )}
    </>
  );
}
