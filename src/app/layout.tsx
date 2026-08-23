import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://ticketshow.vn"),
  title: {
    default: "TICKETSHOW — Nền tảng bán vé sự kiện & hòa nhạc cao cấp",
    template: "%s | TICKETSHOW",
  },
  description:
    "Khám phá và sở hữu vé hòa nhạc, liveshow và sự kiện văn hóa nghệ thuật chọn lọc hàng đầu Việt Nam. Trải nghiệm tối giản, thanh lịch và bảo mật tuyệt đối.",
  keywords: [
    "vé hòa nhạc",
    "mua vé liveshow",
    "concert vietnam",
    "vé concert",
    "hà anh tuấn",
    "vũ concert",
    "ticketshow",
    "vé sự kiện cao cấp",
  ],
  authors: [{ name: "TICKETSHOW Vietnam" }],
  creator: "TICKETSHOW",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://ticketshow.vn",
    siteName: "TICKETSHOW",
    title: "TICKETSHOW — Your access to unforgettable moments",
    description: "Nền tảng bán vé sự kiện & hòa nhạc cao cấp hàng đầu Việt Nam.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "TICKETSHOW Luxury Ticketing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TICKETSHOW — Nền tảng bán vé sự kiện & hòa nhạc cao cấp",
    description: "Your access to unforgettable moments.",
    images: ["https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Organization Structured Data
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TICKETSHOW",
    url: "https://ticketshow.vn",
    logo: "https://ticketshow.vn/logo.png",
    description: "Nền tảng phân phối vé hòa nhạc & sự kiện nghệ thuật cao cấp tại Việt Nam.",
    sameAs: [
      "https://facebook.com/ticketshow",
      "https://instagram.com/ticketshow",
      "https://spotify.com",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "concierge@ticketshow.vn",
      areaServed: "VN",
      availableLanguage: ["Vietnamese", "English"],
    },
  };

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-luxury-ivory text-luxury-ink antialiased flex flex-col min-h-screen selection:bg-champagne/30 selection:text-emerald">
        {/* Header */}
        <Header />

        {/* Main Content Viewport */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
