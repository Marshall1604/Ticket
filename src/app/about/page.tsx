import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, Heart, Award, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Về TICKETSHOW — Your access to unforgettable moments",
  description:
    "Câu chuyện và triết lý tuyển chọn những trải nghiệm văn hóa nghệ thuật và hòa nhạc đỉnh cao tại TICKETSHOW.",
};

export default function AboutPage() {
  const faqs = [
    {
      q: "Làm thế nào để nhận vé sau khi thanh toán thành công?",
      a: "Vé điện tử dưới dạng mã QR sẽ hiển thị ngay lập tức trong mục 'Vé của tôi' trên tài khoản của bạn, đồng thời được gửi trực tiếp về email bạn đã đăng ký.",
    },
    {
      q: "Tôi có cần in vé giấy khi đến tham dự sự kiện không?",
      a: "Không bắt buộc. Bạn chỉ cần xuất trình mã QR trên màn hình điện thoại tại cổng check-in. Tuy nhiên, bạn vẫn có thể tải và in vé nếu muốn lưu giữ kỷ niệm.",
    },
    {
      q: "Chính sách hoàn / đổi vé diễn ra như thế nào?",
      a: "Theo quy định chuẩn từ các Ban Tổ Chức sự kiện, vé đã mua không hỗ trợ hủy hoặc hoàn tiền trừ khi sự kiện bị hoãn hoặc hủy do quyết định chính thức từ phía Nhà Tổ Chức.",
    },
    {
      q: "TICKETSHOW có đảm bảo tính xác thực của vé không?",
      a: "Tất cả các vé phân phối trên TICKETSHOW đều được phát hành và kiểm soát trực tiếp từ Ban Tổ Chức sự kiện với mã định danh độc bản chống làm giả.",
    },
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-site mx-auto px-5 sm:px-8 space-y-16">
      {/* Editorial Story Header */}
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ABOUT TICKETSHOW</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-luxury-ink leading-[1.08]">
          Nơi âm nhạc đích thực gặp gỡ <br />
          <span className="italic font-normal">những tâm hồn say mê.</span>
        </h1>
        <p className="text-luxury-sage text-base sm:text-lg leading-relaxed">
          TICKETSHOW được kiến tạo từ niềm đam mê sâu sắc dành cho sân khấu trực tiếp. Chúng tôi tin rằng mỗi buổi hòa nhạc, mỗi vở kịch hay lễ hội không chỉ là một sự kiện, mà là một khoảnh khắc nghệ thuật độc bản không thể tái lặp trong đời.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-border-subtle space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
            Tuyển chọn khắt khe
          </h3>
          <p className="text-luxury-sage text-sm leading-relaxed">
            Chúng tôi đồng hành cùng các nghệ sĩ và nhà sản xuất hàng đầu để mang đến những sân khấu có giá trị nghệ thuật và chất lượng dàn dựng cao nhất.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-border-subtle space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
            Minh bạch tuyệt đối
          </h3>
          <p className="text-luxury-sage text-sm leading-relaxed">
            Không đội giá vé, không phí ẩn. Mỗi vị trí ghế và quyền lợi đi kèm đều được mô tả chi tiết và chuẩn hóa.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-border-subtle space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
            Trải nghiệm tinh gọn
          </h3>
          <p className="text-luxury-sage text-sm leading-relaxed">
            Từ việc chọn show đến chiếc vé trong tay chỉ mất vài cú nhấp chuột trên giao diện được chăm chút tỉ mỉ.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="space-y-8 pt-8 border-t border-border-subtle">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-luxury-ink">
            Câu hỏi thường gặp
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle space-y-2.5"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <h4 className="font-semibold text-base sm:text-lg text-luxury-ink">
                  {faq.q}
                </h4>
              </div>
              <p className="text-luxury-sage text-sm leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
