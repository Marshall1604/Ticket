import React from "react";
import { mockEvents } from "@/data/mockEvents";
import { DiscoverSection } from "@/components/home/DiscoverSection";

export const metadata = {
  title: "Tất cả sự kiện & Liveshow",
  description:
    "Danh sách toàn bộ các chương trình hòa nhạc, liveshow và sự kiện văn hóa nghệ thuật tại TP. Hồ Chí Minh, Hà Nội, Đà Nẵng và Đà Lạt.",
};

export default function ShowsPage() {
  return (
    <div className="pt-24 sm:pt-32 pb-20">
      <DiscoverSection events={mockEvents} />
    </div>
  );
}
