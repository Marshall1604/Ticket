"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push("/my-tickets");
      }, 800);
    }, 600);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-md mx-auto px-5">
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-8 sm:p-10 border border-border-subtle shadow-[0_12px_40px_rgba(16,35,30,0.06)] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald">
            {isLogin ? "WELCOME BACK" : "JOIN TICKETSHOW"}
          </div>
          <h1 className="font-serif text-3xl font-semibold text-luxury-ink">
            {isLogin ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
          </h1>
          <p className="text-luxury-sage text-xs sm:text-sm">
            {isLogin
              ? "Truy cập vé điện tử và quyền mua vé presale của bạn"
              : "Đăng ký thành viên để nhận ưu đãi và quản lý vé dễ dàng"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-full bg-luxury-ivory border border-border-subtle text-xs font-semibold">
          <button
            onClick={() => setIsLogin(true)}
            className={`py-2 rounded-full transition-all ${
              isLogin
                ? "bg-emerald text-white shadow-sm"
                : "text-luxury-sage hover:text-luxury-ink"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`py-2 rounded-full transition-all ${
              !isLogin
                ? "bg-emerald text-white shadow-sm"
                : "text-luxury-sage hover:text-luxury-ink"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className="p-3.5 rounded-2xl bg-emerald/10 border border-emerald/20 text-emerald text-xs text-center font-medium">
              {message}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                />
                <User className="w-4 h-4 text-luxury-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-luxury-muted absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                Mật khẩu
              </label>
              {isLogin && (
                <a href="#" className="text-[11px] text-emerald hover:underline">
                  Quên mật khẩu?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-luxury-muted absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 py-3.5 rounded-full bg-emerald text-white text-sm font-semibold tracking-wide hover:bg-emerald-hover transition-all duration-200 shadow-md flex items-center justify-center gap-2 active:scale-95 mt-6"
          >
            <span>{isLoading ? "Đang xác thực..." : isLogin ? "Đăng nhập" : "Tạo tài khoản"}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border-subtle">
          <p className="text-xs text-luxury-sage">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <Link href="/about#terms" className="text-emerald underline">
              Điều khoản dịch vụ
            </Link>{" "}
            của TICKETSHOW.
          </p>
        </div>
      </div>
    </div>
  );
}
