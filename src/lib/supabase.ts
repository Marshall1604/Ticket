import { createClient } from "@supabase/supabase-js";
import { UserProfile, Article, EventItem, Artist, Venue, TicketTier, OrderItem } from "@/types";
import { mockEvents } from "@/data/mockEvents";
import { mockArticles } from "@/data/mockArticles";
import { mockUsers } from "@/data/mockUsers";
import { mockArtists } from "@/data/mockArtists";
import { mockOrders } from "@/data/mockOrders";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    !supabaseUrl.includes("placeholder")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fallback local storage keys for local admin simulation
 */
const USERS_STORAGE_KEY = "ticketshow_admin_users";
const ARTICLES_STORAGE_KEY = "ticketshow_admin_articles";
const EVENTS_STORAGE_KEY = "ticketshow_admin_events";

// -------------------------------------------------------------------
// Mappers: Postgres snake_case <-> TypeScript camelCase
// -------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProfileFromDb(row: any): UserProfile {
  return {
    id: row.id || "usr-" + Date.now(),
    email: row.email || "",
    fullName: row.full_name || row.fullName || "Người dùng",
    role: row.role || "customer",
    phone: row.phone || "",
    avatarUrl: row.avatar_url || row.avatarUrl,
    status: row.status || "active",
    totalOrdersCount: Number(row.total_orders_count ?? row.totalOrdersCount ?? 0),
    totalSpent: Number(row.total_spent ?? row.totalSpent ?? 0),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    lastLoginAt: row.last_login_at || row.lastLoginAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapArticleFromDb(row: any): Article {
  const publishedAt =
    row.published_at ||
    row.publishedAt ||
    row.created_at ||
    row.createdAt ||
    new Date().toISOString();

  return {
    id: String(row.id || "art-" + Date.now()),
    slug: row.slug || "",
    title: row.title || "Bài viết TICKETSHOW",
    excerpt: row.excerpt || "",
    content: row.content || "",
    coverImage:
      row.cover_image ||
      row.coverImage ||
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    category: row.category || "Phong cách & Nghệ thuật",
    authorName: row.author_name || row.authorName || "Ban Biên Tập TICKETSHOW",
    authorAvatar: row.author_avatar || row.authorAvatar,
    isPublished: row.is_published !== undefined ? Boolean(row.is_published) : row.isPublished !== undefined ? Boolean(row.isPublished) : true,
    isFeatured: Boolean(row.is_featured ?? row.isFeatured ?? false),
    viewCount: Number(row.view_count ?? row.viewCount ?? 0),
    readingTimeMinutes: Number(row.reading_time_minutes ?? row.readingTimeMinutes ?? 4),
    publishedAt,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapEventFromDb(row: any): EventItem {
  const artist: Artist =
    row && row.artist && typeof row.artist === "object"
      ? {
          id: String(row.artist.id || "artist-default"),
          slug: row.artist.slug || "ha-anh-tuan",
          name: row.artist.name || "Hà Anh Tuấn",
          genre: row.artist.genre || "Pop / Acoustic",
          image: row.artist.image || mockArtists[0].image,
          bio: row.artist.bio || "",
          isFeatured: Boolean(row.artist.is_featured ?? row.artist.isFeatured ?? false),
          highlightTrack: row.artist.highlight_track || row.artist.highlightTrack,
        }
      : mockArtists[0];

  const venue: Venue =
    row && row.venue && typeof row.venue === "object"
      ? {
          id: String(row.venue.id || "venue-default"),
          name: row.venue.name || "Saigon Exhibition and Convention Center (SECC)",
          address: row.venue.address || "799 Nguyễn Văn Linh, Tân Phú, Quận 7",
          city: row.venue.city || "TP. Hồ Chí Minh",
          capacity: Number(row.venue.capacity || 5000),
        }
      : mockEvents[0].venue;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ticketTiers: TicketTier[] =
    row && Array.isArray(row.ticketTiers) && row.ticketTiers.length > 0
      ? row.ticketTiers.map((t: any) => ({
          id: String(t.id || "tier-" + Math.random()),
          name: t.name || "Vé Tiêu Chuẩn",
          price: Number(t.price || 650000),
          description: t.description || "",
          benefits: Array.isArray(t.benefits) ? t.benefits : ["Vé vào cổng chính thức"],
          totalQuantity: Number(t.total_quantity || t.totalQuantity || 500),
          availableQuantity: Number(t.available_quantity || t.availableQuantity || 200),
          isPopular: Boolean(t.is_popular ?? t.isPopular ?? false),
          status: t.status || "available",
        }))
      : mockEvents[0].ticketTiers;

  return {
    id: String(row?.id || "evt-" + Date.now()),
    slug: row?.slug || "event-slug",
    title: row?.title || "Sự kiện TICKETSHOW",
    subtitle: row?.subtitle || "",
    category: row?.category || "Liveshow",
    heroImage: row?.hero_image || row?.heroImage || mockEvents[0].heroImage,
    bannerImage: row?.banner_image || row?.bannerImage || mockEvents[0].bannerImage,
    artist,
    venue,
    startDate: row?.start_date || row?.startDate || "2026-12-31T20:00:00",
    dateDisplay: row?.date_display || row?.dateDisplay || "31.12.2026",
    timeDisplay: row?.time_display || row?.timeDisplay || "20:00 - 23:30",
    doorTimeDisplay: row?.door_time_display || row?.doorTimeDisplay || "18:30",
    startingPrice: Number(row?.starting_price ?? row?.startingPrice ?? 650000),
    isHero: Boolean(row?.is_hero ?? row?.isHero ?? false),
    isFeatured: Boolean(row?.is_featured ?? row?.isFeatured ?? false),
    isSellingFast: Boolean(row?.is_selling_fast ?? row?.isSellingFast ?? false),
    status: row?.status || "on_sale",
    description: Array.isArray(row?.description) ? row.description : [row?.description || "Đêm nhạc nghệ thuật đặc sắc"],
    seatMapInfo: row?.seat_map_info || row?.seatMapInfo || "",
    ticketTiers,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapOrderFromDb(row: any): OrderItem {
  return {
    id: String(row.id || "ord-" + Date.now()),
    orderNumber: row.order_number || row.orderNumber || "TS-" + Math.floor(100000 + Math.random() * 900000),
    eventId: row.event_id || row.eventId || mockEvents[0].id,
    eventTitle: row.event_title || row.eventTitle || (row.event ? row.event.title : mockEvents[0].title),
    eventSlug: row.event_slug || row.eventSlug || (row.event ? row.event.slug : mockEvents[0].slug),
    eventImage: row.event_image || row.eventImage || (row.event ? row.event.hero_image : mockEvents[0].heroImage),
    eventDate: row.event_date || row.eventDate || (row.event ? row.event.date_display : mockEvents[0].dateDisplay),
    eventTime: row.event_time || row.eventTime || (row.event ? row.event.time_display : mockEvents[0].timeDisplay),
    venueName: row.venue_name || row.venueName || (row.event?.venue ? row.event.venue.name : mockEvents[0].venue.name),
    venueCity: row.venue_city || row.venueCity || (row.event?.venue ? row.event.venue.city : mockEvents[0].venue.city),
    ticketTierName: row.ticket_tier_name || row.ticketTierName || "Standard Seated",
    quantity: Number(row.quantity || 1),
    unitPrice: Number(row.unit_price ?? row.unitPrice ?? 1450000),
    totalPrice: Number(row.total_price ?? row.totalPrice ?? 1450000),
    customerName: row.customer_name || row.customerName || "Khách hàng",
    customerEmail: row.customer_email || row.customerEmail || "",
    customerPhone: row.customer_phone || row.customerPhone || "",
    paymentMethod: row.payment_method || row.paymentMethod || "bank_transfer",
    paymentStatus: row.payment_status || row.paymentStatus || "paid",
    qrCodeData: row.qr_code_data || row.qrCodeData || `https://ticketshow.vn/verify/${row.order_number || "TS-882914"}`,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    seatNumbers: Array.isArray(row.seat_numbers)
      ? row.seat_numbers
      : Array.isArray(row.seatNumbers)
      ? row.seatNumbers
      : ["Khu A - Ghế 12"],
  };
}

// Helper: Get orders list from Supabase or Fallback
export async function fetchOrdersList(): Promise<OrderItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, event:events(*)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapOrderFromDb);
      }
    } catch (err) {
      console.warn("Supabase fetch orders error:", err);
    }
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ticketshow_orders");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed.map(mapOrderFromDb), ...mockOrders];
        }
      } catch {
        // Fallback
      }
    }
  }
  return mockOrders;
}

// Helper: Get orders for specific user
export async function fetchOrdersByUser(email: string): Promise<OrderItem[]> {
  const allOrders = await fetchOrdersList();
  return allOrders.filter(
    (o) => o.customerEmail.toLowerCase().trim() === email.toLowerCase().trim()
  );
}

// Helper: Get single order by orderNumber
export async function fetchOrderByNumber(orderNumber: string): Promise<OrderItem | null> {
  const cleanNumber = orderNumber.trim().toUpperCase();
  
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, event:events(*)")
        .eq("order_number", cleanNumber)
        .maybeSingle();

      if (!error && data) {
        return mapOrderFromDb(data);
      }
    } catch (err) {
      console.warn("Supabase fetch order by number error:", err);
    }
  }

  const allOrders = await fetchOrdersList();
  const matched = allOrders.find(
    (o) =>
      o.orderNumber.toUpperCase() === cleanNumber ||
      o.orderNumber.replace(/[^A-Z0-9]/gi, "").toUpperCase() ===
        cleanNumber.replace(/[^A-Z0-9]/gi, "")
  );

  return matched || null;
}

// -------------------------------------------------------------------
// Helper: Get users from Supabase or Local Fallback
// -------------------------------------------------------------------
export async function fetchUsersList(): Promise<UserProfile[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapProfileFromDb);
      }
    } catch (err) {
      console.warn("Supabase fetch profiles error, using local fallback", err);
    }
  }

  // Local storage fallback
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map(mapProfileFromDb);
      } catch {
        // Fallback
      }
    }
  }
  return mockUsers;
}

// Helper: Save/Update user profile
export async function saveUserProfile(user: UserProfile): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id.startsWith("usr-") ? undefined : user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        phone: user.phone,
        status: user.status,
        total_orders_count: user.totalOrdersCount,
        total_spent: user.totalSpent,
      });
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase upsert profile error:", err);
    }
  }

  // Local storage fallback
  if (typeof window !== "undefined") {
    const current = await fetchUsersList();
    const index = current.findIndex((u) => u.id === user.id);
    let updated: UserProfile[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = user;
    } else {
      updated = [user, ...current];
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
  return false;
}

// Helper: Delete User Profile
export async function deleteUserProfile(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete profile error:", err);
    }
  }

  if (typeof window !== "undefined") {
    const current = await fetchUsersList();
    const filtered = current.filter((u) => u.id !== id);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

// -------------------------------------------------------------------
// Helper: Get articles from Supabase or Local Fallback
// -------------------------------------------------------------------
export async function fetchArticlesList(): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapArticleFromDb);
      }
    } catch (err) {
      console.warn("Supabase fetch articles error, using local fallback", err);
    }
  }

  // Local storage fallback
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map(mapArticleFromDb);
      } catch {
        // Fallback
      }
    }
  }
  return mockArticles;
}

// Helper: Save/Update Article
export async function saveArticle(article: Article): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("articles").upsert({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        cover_image: article.coverImage,
        category: article.category,
        author_name: article.authorName,
        is_published: article.isPublished,
        is_featured: article.isFeatured || false,
        view_count: article.viewCount,
        reading_time_minutes: article.readingTimeMinutes,
        updated_at: new Date().toISOString(),
      });
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase upsert article error:", err);
    }
  }

  // Local storage fallback
  if (typeof window !== "undefined") {
    const current = await fetchArticlesList();
    const index = current.findIndex((a) => a.id === article.id || a.slug === article.slug);
    let updated: Article[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...article, updatedAt: new Date().toISOString() };
    } else {
      updated = [article, ...current];
    }
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
  return false;
}

// Helper: Delete Article
export async function deleteArticleItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete article error:", err);
    }
  }

  if (typeof window !== "undefined") {
    const current = await fetchArticlesList();
    const filtered = current.filter((a) => a.id !== id);
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

// -------------------------------------------------------------------
// Helper: Get Events from Supabase or Local Fallback
// -------------------------------------------------------------------
export async function fetchEventsList(): Promise<EventItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*, artist:artists(*), venue:venues(*), ticketTiers:ticket_types(*)")
        .order("start_date", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapEventFromDb);
      }
    } catch (err) {
      console.warn("Supabase fetch events error, using fallback", err);
    }
  }

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map(mapEventFromDb);
      } catch {
        // Fallback
      }
    }
  }
  return mockEvents;
}

// Helper: Save/Update Event & Ticket Tiers
export async function saveEventItem(event: EventItem): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("events").upsert({
        slug: event.slug,
        title: event.title,
        subtitle: event.subtitle,
        category: event.category,
        hero_image: event.heroImage,
        banner_image: event.bannerImage,
        date_display: event.dateDisplay,
        time_display: event.timeDisplay,
        door_time_display: event.doorTimeDisplay,
        starting_price: event.startingPrice,
        is_hero: event.isHero,
        is_featured: event.isFeatured,
        is_selling_fast: event.isSellingFast,
        status: event.status,
        description: event.description,
        seat_map_info: event.seatMapInfo,
      });
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase upsert event error:", err);
    }
  }

  if (typeof window !== "undefined") {
    const current = await fetchEventsList();
    const index = current.findIndex((e) => e.id === event.id || e.slug === event.slug);
    let updated: EventItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = event;
    } else {
      updated = [event, ...current];
    }
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
  return false;
}

// Helper: Delete Event
export async function deleteEventItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete event error:", err);
    }
  }

  if (typeof window !== "undefined") {
    const current = await fetchEventsList();
    const filtered = current.filter((e) => e.id !== id);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

// -------------------------------------------------------------------
// Helper: Test Live Supabase Connection
// -------------------------------------------------------------------
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message: "Chưa cấu hình NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trong file .env.local",
    };
  }

  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
      if (error.code === "42P01") {
        return {
          success: false,
          message: "Kết nối thành công tới Supabase, nhưng các bảng chưa được tạo. Vui lòng chạy file schema.sql trong Supabase SQL Editor.",
        };
      }
      return {
        success: false,
        message: `Lỗi kết nối: ${error.message} (Mã: ${error.code})`,
      };
    }
    return {
      success: true,
      message: "Kết nối thành công tuyệt đối tới dự án Supabase Cloud!",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Không thể kết nối tới Supabase: ${errorMsg}`,
    };
  }
}

// -------------------------------------------------------------------
// Helper: Seed Initial Demo Data to Supabase
// -------------------------------------------------------------------
export async function seedInitialDataToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message: "Vui lòng cấu hình biến môi trường Supabase trong file .env.local trước khi nạp dữ liệu.",
    };
  }

  try {
    // 1. Seed Artists
    const artistIdMap = new Map<string, string>();
    for (const artist of mockArtists) {
      const { data: existing } = await supabase
        .from("artists")
        .select("id")
        .eq("slug", artist.slug)
        .maybeSingle();

      if (existing) {
        artistIdMap.set(artist.slug, existing.id);
      } else {
        const { data: inserted } = await supabase
          .from("artists")
          .insert({
            slug: artist.slug,
            name: artist.name,
            genre: artist.genre,
            image: artist.image,
            bio: artist.bio,
            is_featured: artist.isFeatured,
            highlight_track: artist.highlightTrack,
          })
          .select("id")
          .single();
        if (inserted) artistIdMap.set(artist.slug, inserted.id);
      }
    }

    // 2. Seed Venues & Events & Ticket Types
    for (const evt of mockEvents) {
      let venueId: string | null = null;
      const { data: existingVenue } = await supabase
        .from("venues")
        .select("id")
        .eq("name", evt.venue.name)
        .maybeSingle();

      if (existingVenue) {
        venueId = existingVenue.id;
      } else {
        const { data: insertedVenue } = await supabase
          .from("venues")
          .insert({
            name: evt.venue.name,
            address: evt.venue.address,
            city: evt.venue.city,
            capacity: evt.venue.capacity,
          })
          .select("id")
          .single();
        if (insertedVenue) venueId = insertedVenue.id;
      }

      const artistId = artistIdMap.get(evt.artist.slug) || null;

      const { data: existingEvent } = await supabase
        .from("events")
        .select("id")
        .eq("slug", evt.slug)
        .maybeSingle();

      let eventDbId: string | null = null;

      if (existingEvent) {
        eventDbId = existingEvent.id;
      } else {
        const { data: insertedEvent, error: eventErr } = await supabase
          .from("events")
          .insert({
            slug: evt.slug,
            title: evt.title,
            subtitle: evt.subtitle,
            category: evt.category,
            hero_image: evt.heroImage,
            banner_image: evt.bannerImage,
            artist_id: artistId,
            venue_id: venueId,
            date_display: evt.dateDisplay,
            time_display: evt.timeDisplay,
            door_time_display: evt.doorTimeDisplay,
            starting_price: evt.startingPrice,
            is_hero: evt.isHero,
            is_featured: evt.isFeatured,
            is_selling_fast: evt.isSellingFast,
            status: evt.status,
            description: evt.description,
            seat_map_info: evt.seatMapInfo,
          })
          .select("id")
          .single();

        if (!eventErr && insertedEvent) {
          eventDbId = insertedEvent.id;
        }
      }

      if (eventDbId && evt.ticketTiers) {
        for (const tier of evt.ticketTiers) {
          const { data: existingTier } = await supabase
            .from("ticket_types")
            .select("id")
            .eq("event_id", eventDbId)
            .eq("name", tier.name)
            .maybeSingle();

          if (!existingTier) {
            await supabase.from("ticket_types").insert({
              event_id: eventDbId,
              name: tier.name,
              price: tier.price,
              description: tier.description,
              benefits: tier.benefits,
              total_quantity: tier.totalQuantity,
              available_quantity: tier.availableQuantity,
              is_popular: tier.isPopular || false,
              status: tier.status,
            });
          }
        }
      }
    }

    // 3. Seed Articles
    for (const art of mockArticles) {
      const { data: existingArt } = await supabase
        .from("articles")
        .select("id")
        .eq("slug", art.slug)
        .maybeSingle();

      if (!existingArt) {
        await supabase.from("articles").insert({
          slug: art.slug,
          title: art.title,
          excerpt: art.excerpt,
          content: art.content,
          cover_image: art.coverImage,
          category: art.category,
          author_name: art.authorName,
          is_published: art.isPublished,
          view_count: art.viewCount,
          reading_time_minutes: art.readingTimeMinutes,
        });
      }
    }

    // 4. Seed Profiles (Demo Users)
    for (const usr of mockUsers) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", usr.email)
        .maybeSingle();

      if (!existingUser) {
        await supabase.from("profiles").insert({
          email: usr.email,
          full_name: usr.fullName,
          role: usr.role,
          phone: usr.phone,
          status: usr.status,
          total_orders_count: usr.totalOrdersCount,
          total_spent: usr.totalSpent,
        });
      }
    }

    return {
      success: true,
      message: "Đã nạp toàn bộ dữ liệu mẫu (Show bán vé, Hạng vé, Nghệ sĩ, Bài viết, Người dùng) lên Supabase Cloud thành công!",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Lỗi nạp dữ liệu: ${errorMsg}`,
    };
  }
}
