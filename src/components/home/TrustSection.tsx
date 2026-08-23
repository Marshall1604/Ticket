import React from "react";
import { ShieldCheck, CreditCard, Smartphone, CheckCircle2 } from "lucide-react";

export function TrustSection() {
  const pillars = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald" />,
      title: "Vé chính thức",
      description:
        "Thông tin vé và sự kiện được quản lý trực tiếp với Ban Tổ Chức, đảm bảo tính hợp lệ tuyệt đối khi check-in tại cổng.",
      tag: "Xác thực nguồn gốc",
    },
    {
      icon: <CreditCard className="w-7 h-7 text-emerald" />,
      title: "Thanh toán an toàn",
      description:
        "Quy trình mua vé bảo mật theo tiêu chuẩn PCI-DSS. Minh bạch giá vé, không phí ẩn và hỗ trợ nhiều cổng thanh toán tin cậy.",
      tag: "Bảo mật & Minh bạch",
    },
    {
      icon: <Smartphone className="w-7 h-7 text-emerald" />,
      title: "Vé luôn bên bạn",
      description:
        "Truy cập vé điện tử có mã QR ngay trong tài khoản TICKETSHOW của bạn mà không lo thất lạc hay hỏng rách vé giấy.",
      tag: "Tiện lợi số hóa",
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-site mx-auto px-5 sm:px-8">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="text-xs uppercase tracking-widest font-bold text-emerald">
          WHY TICKETSHOW
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink">
          Vé thật. Trải nghiệm thật.
        </h2>
        <p className="text-luxury-sage text-sm sm:text-base">
          Mỗi chi tiết trong hành trình đặt vé được tối ưu vì sự an tâm và trải nghiệm thưởng thức trọn vẹn của bạn.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((item, idx) => (
          <div
            key={idx}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-border-subtle hover:border-emerald/30 transition-all duration-300 shadow-[0_4px_24px_rgba(16,35,30,0.03)] hover:shadow-[0_12px_32px_rgba(16,35,30,0.06)] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald/8 flex items-center justify-center border border-emerald/10">
                {item.icon}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-champagne">
                {item.tag}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
                {item.title}
              </h3>
              <p className="text-luxury-sage text-[15px] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-border-subtle/60 flex items-center gap-2 text-xs font-semibold text-emerald">
              <CheckCircle2 className="w-4 h-4 text-emerald" />
              <span>Tiêu chuẩn dịch vụ TICKETSHOW</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
