export type EventCategory =
  | 'Tất cả'
  | 'Âm nhạc'
  | 'Liveshow'
  | 'Festival'
  | 'Theater'
  | 'Comedy'
  | 'Conference';

export type EventCity = 'Tất cả' | 'TP. Hồ Chí Minh' | 'Hà Nội' | 'Đà Nẵng' | 'Đà Lạt';

export type EventDateFilter = 'all' | 'today' | 'weekend' | 'this_month';

export type EventStatus = 'on_sale' | 'selling_soon' | 'sold_out' | 'past';

export interface Venue {
  id: string;
  name: string;
  address: string;
  district?: string;
  city: string;
  capacity: number;
  mapEmbedUrl?: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  genre: string;
  image: string;
  bio: string;
  isFeatured?: boolean;
  upcomingShowsCount?: number;
  highlightTrack?: string;
  socials?: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  totalQuantity: number;
  availableQuantity: number;
  isPopular?: boolean;
  status: 'available' | 'selling_fast' | 'sold_out';
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  heroImage: string;
  bannerImage: string;
  artist: Artist;
  venue: Venue;
  startDate: string;
  dateDisplay: string;
  timeDisplay: string;
  doorTimeDisplay: string;
  startingPrice: number;
  isHero?: boolean;
  isFeatured?: boolean;
  isSellingFast?: boolean;
  status: EventStatus;
  description: string[];
  seatMapInfo?: string;
  ticketTiers: TicketTier[];
  importantNotices?: string[];
  termsAndConditions?: string[];
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  eventImage: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueCity: string;
  ticketTierName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'momo' | 'vnpay';
  paymentStatus: 'paid' | 'pending' | 'cancelled';
  qrCodeData: string;
  createdAt: string;
  seatNumbers?: string[];
}

export interface FilterParams {
  category: EventCategory;
  city: EventCity;
  dateFilter: EventDateFilter;
  searchQuery: string;
}

// User Profile Types for Admin Management & Supabase
export type UserRole = 'customer' | 'admin' | 'editor';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  status: UserStatus;
  totalOrdersCount: number;
  totalSpent: number;
  createdAt: string;
  lastLoginAt?: string;
}

// Editorial & Article Types for Admin Management & Supabase
export type ArticleCategory =
  | 'Tất cả'
  | 'Hậu trường sân khấu'
  | 'Phỏng vấn nghệ sĩ'
  | 'Review đêm nhạc'
  | 'Phong cách & Nghệ thuật'
  | 'Thông báo mở bán';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: ArticleCategory;
  authorName: string;
  authorAvatar?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  viewCount: number;
  readingTimeMinutes: number;
  publishedAt: string;
  createdAt: string;
  updatedAt?: string;
}
