import React from "react";
import { ArrowRight, Music2, Ticket, QrCode } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <Music2 className="w-6 h-6 text-emerald" />,
      title: "Chọn show",
      description: "Khám phá nghệ sĩ, kiểm tra lịch diễn và chọn sự kiện phù hợp với gu thưởng thức của bạn.",
    },
    {
      number: "02",
      icon: <Ticket className="w-6 h-6 text-emerald" />,
      title: "Chọn vé",
      description: "Lựa chọn hạng vé VIP, Standard hoặc General Admission với sơ đồ chỗ ngồi minh bạch.",
    },
    {
      number: "03",
      icon: <QrCode className="w-6 h-6 text-emerald" />,
      title: "Nhận vé",
      description: "Vé điện tử có mã QR được lưu ngay trong tài khoản và gửi về email sau khi thanh toán.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white/60 border-t border-border-subtle">
      <div className="max-w-site mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald">
            SIMPLE 3-STEP PROCESS
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink">
            Từ show bạn thích đến chiếc vé của bạn.
          </h2>
          <p className="text-luxury-sage text-sm sm:text-base">
            Quy trình đặt vé tối giản, liền mạch và hoàn tất chỉ trong 60 giây.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-8 sm:p-10 border border-border-subtle hover:border-emerald/30 transition-all duration-300 shadow-[0_4px_20px_rgba(16,35,30,0.03)] flex flex-col justify-between"
            >
              {/* Step Number Top Right */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald/8 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="font-serif text-3xl font-light text-luxury-muted/70 tracking-tight">
                  {step.number}
                </span>
              </div>

              {/* Step Content */}
              <div className="space-y-2.5">
                <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
                  {step.title}
                </h3>
                <p className="text-luxury-sage text-sm sm:text-[15px] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
