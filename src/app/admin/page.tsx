"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Ticket,
  Database,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Shield,
  TrendingUp,
  DollarSign,
  Filter,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  X,
  Settings,
  Tag,
  MapPin,
  Clock,
  QrCode,
  Receipt,
  CreditCard,
  CalendarDays,
  Phone,
  Mail,
  UserCheck,
  Layers,
} from "lucide-react";
import { mockEvents } from "@/data/mockEvents";
import { mockUsers } from "@/data/mockUsers";
import { mockArtists } from "@/data/mockArtists";
import { mockArticles } from "@/data/mockArticles";
import { QRCodeSVG } from "qrcode.react";
import {
  UserProfile,
  Article,
  ArticleCategory,
  UserRole,
  UserStatus,
  EventItem,
  EventStatus,
  TicketTier,
  EventCategory,
  OrderItem,
} from "@/types";
import { formatVND, formatEventDate } from "@/lib/utils";
import {
  isSupabaseConfigured,
  fetchUsersList,
  saveUserProfile,
  fetchArticlesList,
  saveArticle,
  deleteArticleItem,
  fetchEventsList,
  saveEventItem,
  deleteEventItem,
  testSupabaseConnection,
  seedInitialDataToSupabase,
  fetchOrdersByUser,
  deleteUserProfile,
} from "@/lib/supabase";

type AdminTab = "overview" | "events" | "articles" | "users" | "supabase";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserProfile | null>(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState<OrderItem[]>([]);
  const [isLoadingUserOrders, setIsLoadingUserOrders] = useState(false);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<OrderItem | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    fullName: "",
    role: "customer" as UserRole,
    phone: "",
  });

  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleSearch, setArticleSearch] = useState("");
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>("all");
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    category: "Phong cách & Nghệ thuật" as ArticleCategory,
    excerpt: "",
    content: "",
    coverImage: "",
    authorName: "Ban Biên Tập TICKETSHOW",
    isPublished: true,
    readingTimeMinutes: 4,
  });

  // Events State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState<string>("all");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [managingTiersEvent, setManagingTiersEvent] = useState<EventItem | null>(null);

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: "",
    subtitle: "",
    slug: "",
    category: "Liveshow" as EventCategory,
    artistName: "Hà Anh Tuấn",
    artistSlug: "ha-anh-tuan",
    venueName: "Saigon Exhibition and Convention Center (SECC)",
    venueAddress: "799 Nguyễn Văn Linh, Tân Phú, Quận 7",
    venueCity: "TP. Hồ Chí Minh",
    venueCapacity: 6500,
    dateDisplay: "31.12.2026",
    timeDisplay: "20:00 - 23:30",
    doorTimeDisplay: "18:30",
    heroImage: "",
    bannerImage: "",
    status: "on_sale" as EventStatus,
    isHero: false,
    isFeatured: false,
    isSellingFast: false,
    description: "",
    seatMapInfo: "",
    ticketTiers: [] as TicketTier[],
  });

  // Status Toast & Supabase Testing
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    const result = await testSupabaseConnection();
    setIsTestingConnection(false);
    setSupabaseTestStatus({
      tested: true,
      success: result.success,
      message: result.message,
    });
    showToast(result.success ? "Kết nối Supabase thành công!" : "Chưa thể kết nối tới Supabase.");
  };

  const handleSeedData = async () => {
    setIsSeedingData(true);
    const result = await seedInitialDataToSupabase();
    setIsSeedingData(false);
    showToast(result.message);
  };

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      // Load Users
      const remoteUsers = await fetchUsersList();
      if (remoteUsers && remoteUsers.length > 0) {
        setUsers(remoteUsers);
      } else {
        setUsers(mockUsers);
        if (typeof window !== "undefined" && !localStorage.getItem("ticketshow_admin_users")) {
          localStorage.setItem("ticketshow_admin_users", JSON.stringify(mockUsers));
        }
      }

      // Load Articles
      const remoteArticles = await fetchArticlesList();
      if (remoteArticles && remoteArticles.length > 0) {
        setArticles(remoteArticles);
      } else {
        setArticles(mockArticles);
        if (typeof window !== "undefined" && !localStorage.getItem("ticketshow_admin_articles")) {
          localStorage.setItem("ticketshow_admin_articles", JSON.stringify(mockArticles));
        }
      }

      // Load Events
      const remoteEvents = await fetchEventsList();
      setEvents(remoteEvents);
    }
    loadData();
  }, []);

  // --- USER HANDLERS ---
  const handleOpenUserDetail = async (user: UserProfile) => {
    setSelectedUserForDetail(user);
    setIsUserDetailModalOpen(true);
    setIsLoadingUserOrders(true);
    const orders = await fetchOrdersByUser(user.email);
    setSelectedUserOrders(orders);
    setIsLoadingUserOrders(false);
  };

  const handleToggleUserStatus = async (user: UserProfile) => {
    const nextStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    const updatedUser = { ...user, status: nextStatus };
    await saveUserProfile(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    if (selectedUserForDetail && selectedUserForDetail.id === user.id) {
      setSelectedUserForDetail(updatedUser);
    }
    showToast(`Đã chuyển trạng thái của ${user.fullName} sang: ${nextStatus === "active" ? "Hoạt động" : "Tạm khóa"}`);
  };

  const handleChangeUserRole = async (user: UserProfile, newRole: UserRole) => {
    const updatedUser = { ...user, role: newRole };
    await saveUserProfile(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    if (selectedUserForDetail && selectedUserForDetail.id === user.id) {
      setSelectedUserForDetail(updatedUser);
    }
    showToast(`Đã nâng quyền của ${user.fullName} thành: ${newRole.toUpperCase()}`);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.fullName) return;

    const newUser: UserProfile = {
      id: "usr-" + Date.now(),
      email: newUserForm.email,
      fullName: newUserForm.fullName,
      role: newUserForm.role,
      phone: newUserForm.phone || "Chưa cập nhật",
      status: "active",
      totalOrdersCount: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };

    await saveUserProfile(newUser);
    setUsers((prev) => [newUser, ...prev]);
    setIsAddUserModalOpen(false);
    setNewUserForm({ email: "", fullName: "", role: "customer", phone: "" });
    showToast(`Đã tạo người dùng mới: ${newUser.fullName}`);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}" không?`)) {
      await deleteUserProfile(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (selectedUserForDetail && selectedUserForDetail.id === id) {
        setIsUserDetailModalOpen(false);
        setSelectedUserForDetail(null);
      }
      showToast(`Đã xóa người dùng "${name}" thành công.`);
    }
  };

  // --- ARTICLE HANDLERS ---
  const handleOpenArticleModal = (art?: Article) => {
    if (art) {
      setEditingArticle(art);
      setArticleForm({
        title: art.title,
        slug: art.slug,
        category: art.category,
        excerpt: art.excerpt,
        content: art.content,
        coverImage: art.coverImage,
        authorName: art.authorName,
        isPublished: art.isPublished,
        readingTimeMinutes: art.readingTimeMinutes,
      });
    } else {
      setEditingArticle(null);
      setArticleForm({
        title: "",
        slug: "",
        category: "Phong cách & Nghệ thuật",
        excerpt: "",
        content: "",
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
        authorName: "Ban Biên Tập TICKETSHOW",
        isPublished: true,
        readingTimeMinutes: 4,
      });
    }
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title) return;

    const generatedSlug =
      articleForm.slug.trim() !== ""
        ? articleForm.slug.trim().toLowerCase().replace(/\s+/g, "-")
        : articleForm.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

    const articleToSave: Article = {
      id: editingArticle ? editingArticle.id : "art-" + Date.now(),
      slug: generatedSlug,
      title: articleForm.title,
      category: articleForm.category,
      excerpt: articleForm.excerpt,
      content: articleForm.content,
      coverImage: articleForm.coverImage,
      authorName: articleForm.authorName,
      isPublished: articleForm.isPublished,
      readingTimeMinutes: Number(articleForm.readingTimeMinutes) || 4,
      viewCount: editingArticle ? editingArticle.viewCount : 1,
      publishedAt: editingArticle ? editingArticle.publishedAt : new Date().toISOString(),
      createdAt: editingArticle ? editingArticle.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveArticle(articleToSave);

    if (editingArticle) {
      setArticles((prev) => prev.map((a) => (a.id === articleToSave.id ? articleToSave : a)));
      showToast(`Đã cập nhật bài viết: "${articleToSave.title}"`);
    } else {
      setArticles((prev) => [articleToSave, ...prev]);
      showToast(`Đã đăng bài viết mới: "${articleToSave.title}"`);
    }

    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      await deleteArticleItem(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast("Đã xóa bài viết thành công.");
    }
  };

  const handleToggleArticlePublish = async (art: Article) => {
    const updated = { ...art, isPublished: !art.isPublished };
    await saveArticle(updated);
    setArticles((prev) => prev.map((a) => (a.id === art.id ? updated : a)));
    showToast(`Đã chuyển bài viết sang: ${updated.isPublished ? "Đã xuất bản" : "Bản nháp"}`);
  };

  // --- EVENT & TICKET MANAGEMENT HANDLERS ---
  const handleOpenEventModal = (evt?: EventItem) => {
    if (evt) {
      setEditingEvent(evt);
      setEventForm({
        title: evt.title,
        subtitle: evt.subtitle || "",
        slug: evt.slug,
        category: evt.category,
        artistName: evt.artist.name,
        artistSlug: evt.artist.slug,
        venueName: evt.venue.name,
        venueAddress: evt.venue.address,
        venueCity: evt.venue.city,
        venueCapacity: evt.venue.capacity,
        dateDisplay: evt.dateDisplay,
        timeDisplay: evt.timeDisplay,
        doorTimeDisplay: evt.doorTimeDisplay,
        heroImage: evt.heroImage,
        bannerImage: evt.bannerImage,
        status: evt.status,
        isHero: Boolean(evt.isHero),
        isFeatured: Boolean(evt.isFeatured),
        isSellingFast: Boolean(evt.isSellingFast),
        description: evt.description.join("\n\n"),
        seatMapInfo: evt.seatMapInfo || "",
        ticketTiers: evt.ticketTiers,
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: "",
        subtitle: "",
        slug: "",
        category: "Liveshow",
        artistName: "Hà Anh Tuấn",
        artistSlug: "ha-anh-tuan",
        venueName: "Saigon Exhibition and Convention Center (SECC)",
        venueAddress: "799 Nguyễn Văn Linh, Tân Phú, Quận 7",
        venueCity: "TP. Hồ Chí Minh",
        venueCapacity: 5000,
        dateDisplay: "20.12.2026",
        timeDisplay: "20:00 - 23:00",
        doorTimeDisplay: "18:30",
        heroImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop",
        bannerImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1600&auto=format&fit=crop",
        status: "on_sale",
        isHero: false,
        isFeatured: false,
        isSellingFast: false,
        description: "Đêm nhạc nghệ thuật chọn lọc hàng đầu với dàn nhạc giao hưởng và hệ thống âm thanh tiêu chuẩn quốc tế.",
        seatMapInfo: "Sân khấu trung tâm, khu vực VIP gồm quà tặng và lối đi riêng.",
        ticketTiers: [
          {
            id: "tier-new-vip",
            name: "VIP Lounge",
            price: 2500000,
            description: "Ghế sofa sát sân khấu kèm đồ uống chào đón",
            benefits: ["Lối vào riêng VIP", "Đồ uống cao cấp", "Quà tặng kỷ niệm"],
            totalQuantity: 150,
            availableQuantity: 50,
            isPopular: true,
            status: "available",
          },
          {
            id: "tier-new-std",
            name: "Standard Seated",
            price: 1200000,
            description: "Khu vực ghế ngồi trung tâm",
            benefits: ["Ghế ngồi cố định có số", "Tầm nhìn toàn cảnh sân khấu"],
            totalQuantity: 600,
            availableQuantity: 240,
            status: "available",
          },
          {
            id: "tier-new-ga",
            name: "General Admission",
            price: 650000,
            description: "Khu vực đứng sôi động",
            benefits: ["Vòng tay check-in phát sáng"],
            totalQuantity: 1000,
            availableQuantity: 500,
            status: "available",
          },
        ],
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;

    const matchedArtist =
      mockArtists.find((a) => a.name === eventForm.artistName) || mockArtists[0];

    const generatedSlug =
      eventForm.slug.trim() !== ""
        ? eventForm.slug.trim().toLowerCase().replace(/\s+/g, "-")
        : eventForm.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

    // Compute lowest starting price automatically
    const startingPrice =
      eventForm.ticketTiers.length > 0
        ? Math.min(...eventForm.ticketTiers.map((t) => t.price))
        : 650000;

    const eventToSave: EventItem = {
      id: editingEvent ? editingEvent.id : "evt-" + Date.now(),
      slug: generatedSlug,
      title: eventForm.title,
      subtitle: eventForm.subtitle,
      category: eventForm.category,
      heroImage: eventForm.heroImage,
      bannerImage: eventForm.bannerImage,
      artist: {
        ...matchedArtist,
        name: eventForm.artistName,
      },
      venue: {
        id: "venue-" + Date.now(),
        name: eventForm.venueName,
        address: eventForm.venueAddress,
        city: eventForm.venueCity,
        capacity: Number(eventForm.venueCapacity) || 5000,
      },
      startDate: "2026-12-31T20:00:00",
      dateDisplay: eventForm.dateDisplay,
      timeDisplay: eventForm.timeDisplay,
      doorTimeDisplay: eventForm.doorTimeDisplay,
      startingPrice,
      isHero: eventForm.isHero,
      isFeatured: eventForm.isFeatured,
      isSellingFast: eventForm.isSellingFast,
      status: eventForm.status,
      description: eventForm.description.split("\n\n").filter(Boolean),
      seatMapInfo: eventForm.seatMapInfo,
      ticketTiers: eventForm.ticketTiers,
    };

    await saveEventItem(eventToSave);

    if (editingEvent) {
      setEvents((prev) => prev.map((evt) => (evt.id === eventToSave.id ? eventToSave : evt)));
      showToast(`Đã cập nhật thông tin Show: "${eventToSave.title}"`);
    } else {
      setEvents((prev) => [eventToSave, ...prev]);
      showToast(`Đã tạo Show bán vé mới: "${eventToSave.title}"`);
    }

    setIsEventModalOpen(false);
  };

  const handleChangeEventStatus = async (evt: EventItem, newStatus: EventStatus) => {
    const updated = { ...evt, status: newStatus };
    await saveEventItem(updated);
    setEvents((prev) => prev.map((e) => (e.id === evt.id ? updated : e)));
    showToast(`Đã chuyển trạng thái Show "${evt.title}" sang: ${newStatus.toUpperCase()}`);
  };

  const handleToggleEventHero = async (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;
    const updated = { ...target, isHero: !target.isHero };
    await saveEventItem(updated);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    showToast(`Hero Top Banner: ${updated.isHero ? "BẬT" : "TẮT"}`);
  };

  const handleToggleEventFeatured = async (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;
    const updated = { ...target, isFeatured: !target.isFeatured };
    await saveEventItem(updated);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    showToast(`Featured Spotlight: ${updated.isFeatured ? "BẬT" : "TẮT"}`);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa Show bán vé này không?")) {
      await deleteEventItem(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast("Đã xóa Show bán vé thành công.");
    }
  };

  // --- TIER MODAL HANDLERS ---
  const handleOpenTierManager = (evt: EventItem) => {
    setManagingTiersEvent(evt);
    setIsTierModalOpen(true);
  };

  const handleUpdateTierPrice = (tierIndex: number, newPrice: number) => {
    if (!managingTiersEvent) return;
    const updatedTiers = [...managingTiersEvent.ticketTiers];
    updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], price: newPrice };
    const startingPrice = Math.min(...updatedTiers.map((t) => t.price));
    setManagingTiersEvent({
      ...managingTiersEvent,
      ticketTiers: updatedTiers,
      startingPrice,
    });
  };

  const handleUpdateTierQuantity = (tierIndex: number, newAvailable: number, newTotal: number) => {
    if (!managingTiersEvent) return;
    const updatedTiers = [...managingTiersEvent.ticketTiers];
    const status = newAvailable <= 0 ? "sold_out" : newAvailable <= 20 ? "selling_fast" : "available";
    updatedTiers[tierIndex] = {
      ...updatedTiers[tierIndex],
      availableQuantity: newAvailable,
      totalQuantity: newTotal,
      status,
    };
    setManagingTiersEvent({
      ...managingTiersEvent,
      ticketTiers: updatedTiers,
    });
  };

  const handleAddNewTier = () => {
    if (!managingTiersEvent) return;
    const newTier: TicketTier = {
      id: "tier-" + Date.now(),
      name: "Hạng Vé Mới",
      price: 850000,
      description: "Mô tả đặc quyền hạng vé mới",
      benefits: ["Vé vào cổng chính thức"],
      totalQuantity: 200,
      availableQuantity: 200,
      status: "available",
    };
    const updatedTiers = [...managingTiersEvent.ticketTiers, newTier];
    const startingPrice = Math.min(...updatedTiers.map((t) => t.price));
    setManagingTiersEvent({
      ...managingTiersEvent,
      ticketTiers: updatedTiers,
      startingPrice,
    });
  };

  const handleDeleteTier = (tierIndex: number) => {
    if (!managingTiersEvent) return;
    if (managingTiersEvent.ticketTiers.length <= 1) {
      alert("Một sự kiện phải có ít nhất 1 hạng vé.");
      return;
    }
    const updatedTiers = managingTiersEvent.ticketTiers.filter((_, idx) => idx !== tierIndex);
    const startingPrice = Math.min(...updatedTiers.map((t) => t.price));
    setManagingTiersEvent({
      ...managingTiersEvent,
      ticketTiers: updatedTiers,
      startingPrice,
    });
  };

  const handleSaveTiers = async () => {
    if (!managingTiersEvent) return;
    await saveEventItem(managingTiersEvent);
    setEvents((prev) =>
      prev.map((e) => (e.id === managingTiersEvent.id ? managingTiersEvent : e))
    );
    setIsTierModalOpen(false);
    showToast(`Đã lưu thay đổi giá tiền & hạng vé cho "${managingTiersEvent.title}"`);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const name = (u?.fullName || "").toLowerCase();
    const mail = (u?.email || "").toLowerCase();
    const q = (userSearch || "").toLowerCase();
    const matchSearch = name.includes(q) || mail.includes(q);
    const matchRole = userRoleFilter === "all" || u?.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  // Filtered Articles
  const filteredArticles = articles.filter((a) => {
    const title = (a?.title || "").toLowerCase();
    const author = (a?.authorName || "").toLowerCase();
    const q = (articleSearch || "").toLowerCase();
    const matchSearch = title.includes(q) || author.includes(q);
    const matchCat =
      articleCategoryFilter === "all" || a?.category === articleCategoryFilter;
    return matchSearch && matchCat;
  });

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const title = (e?.title || "").toLowerCase();
    const artistName = (e?.artist?.name || "").toLowerCase();
    const venueCity = (e?.venue?.city || "").toLowerCase();
    const q = (eventSearch || "").toLowerCase();
    const matchSearch = title.includes(q) || artistName.includes(q) || venueCity.includes(q);
    const matchStatus = eventStatusFilter === "all" || e?.status === eventStatusFilter;
    return matchSearch && matchStatus;
  });

  const copySqlCode = () => {
    const sqlScript = `-- TICKETSHOW SUPABASE TABLES SCHEMA
-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'editor')),
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  total_orders_count INT DEFAULT 0,
  total_spent NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE
);

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow delete profiles" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update profiles" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete profiles" ON public.profiles FOR DELETE USING (true);

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  category TEXT DEFAULT 'Phong cách & Nghệ thuật' NOT NULL,
  author_name TEXT DEFAULT 'Ban Biên Tập TICKETSHOW' NOT NULL,
  is_published BOOLEAN DEFAULT true,
  view_count INT DEFAULT 0,
  reading_time_minutes INT DEFAULT 4,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP POLICY IF EXISTS "Published articles are readable by anyone" ON public.articles;
DROP POLICY IF EXISTS "Admins and Editors have full access to articles" ON public.articles;
DROP POLICY IF EXISTS "Allow select articles" ON public.articles;
DROP POLICY IF EXISTS "Allow insert articles" ON public.articles;
DROP POLICY IF EXISTS "Allow update articles" ON public.articles;
DROP POLICY IF EXISTS "Allow delete articles" ON public.articles;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow insert articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update articles" ON public.articles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete articles" ON public.articles FOR DELETE USING (true);

-- 4. Artists Table
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  image TEXT NOT NULL,
  bio TEXT,
  is_featured BOOLEAN DEFAULT false,
  highlight_track TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all artists" ON public.artists;
CREATE POLICY "Allow all artists" ON public.artists FOR ALL USING (true) WITH CHECK (true);

-- 5. Venues Table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INT DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all venues" ON public.venues;
CREATE POLICY "Allow all venues" ON public.venues FOR ALL USING (true) WITH CHECK (true);

-- 6. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  banner_image TEXT NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  date_display TEXT NOT NULL,
  time_display TEXT NOT NULL,
  door_time_display TEXT DEFAULT '18:30',
  starting_price NUMERIC(12, 2) NOT NULL,
  is_hero BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_selling_fast BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'on_sale' CHECK (status IN ('on_sale', 'selling_soon', 'sold_out', 'past')),
  description TEXT[],
  seat_map_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all events" ON public.events;
CREATE POLICY "Allow all events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- 7. Ticket Types Table
CREATE TABLE IF NOT EXISTS public.ticket_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  description TEXT,
  benefits TEXT[],
  total_quantity INT NOT NULL,
  available_quantity INT NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'selling_fast', 'sold_out'))
);

ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all ticket_types" ON public.ticket_types;
CREATE POLICY "Allow all ticket_types" ON public.ticket_types FOR ALL USING (true) WITH CHECK (true);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
  event_id UUID REFERENCES public.events(id),
  ticket_tier_name TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  payment_method TEXT DEFAULT 'bank_transfer',
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'cancelled')),
  qr_code_data TEXT NOT NULL,
  seat_numbers TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all orders" ON public.orders;
CREATE POLICY "Allow all orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlScript);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 max-w-site mx-auto px-5 sm:px-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-luxury-dark text-white text-xs font-semibold shadow-2xl flex items-center gap-3 border border-champagne/40 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-champagne" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald">
            <Shield className="w-3.5 h-3.5" />
            <span>TICKETSHOW CONTROL CONSOLE</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-luxury-ink">
            Quản trị Show & Giá vé, Bài viết, Người dùng
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border-subtle text-xs">
            <Database className="w-3.5 h-3.5 text-emerald" />
            <span>
              Supabase:{" "}
              <strong className={isSupabaseConfigured ? "text-emerald" : "text-amber-600"}>
                {isSupabaseConfigured ? "Đang đồng bộ trực tiếp" : "Chế độ Local Sync"}
              </strong>
            </span>
          </div>

          <Link
            href="/"
            className="px-5 py-2 rounded-full text-xs font-semibold bg-white border border-border-subtle hover:border-emerald text-luxury-ink transition-colors"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>

      {/* Admin Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-border-subtle">
        {[
          { id: "overview", label: "Tổng quan", icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: "events", label: `Quản lý Show bán vé (${events.length})`, icon: <Ticket className="w-4 h-4" /> },
          { id: "articles", label: `Bài viết (${articles.length})`, icon: <FileText className="w-4 h-4" /> },
          { id: "users", label: `Người dùng (${users.length})`, icon: <Users className="w-4 h-4" /> },
          { id: "supabase", label: "Cấu hình Supabase", icon: <Database className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all select-none shrink-0 ${
              activeTab === tab.id
                ? "bg-emerald text-white shadow-sm"
                : "bg-white text-luxury-ink/70 border border-border-subtle hover:border-emerald/40 hover:text-emerald"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-2">
              <div className="flex items-center justify-between text-luxury-sage text-xs font-medium uppercase tracking-wider">
                <span>Tổng doanh thu</span>
                <DollarSign className="w-4 h-4 text-emerald" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
                {formatVND(18450000000)}
              </div>
              <div className="text-xs text-emerald font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.5% so với tháng trước</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-2">
              <div className="flex items-center justify-between text-luxury-sage text-xs font-medium uppercase tracking-wider">
                <span>Show đang mở bán</span>
                <Ticket className="w-4 h-4 text-emerald" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
                {events.filter((e) => e.status === "on_sale").length}{" "}
                <span className="text-sm font-sans font-normal text-luxury-sage">/ {events.length} shows</span>
              </div>
              <div className="text-xs text-emerald font-semibold">
                {events.filter((e) => e.isHero).length} sự kiện ghim Hero
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-2">
              <div className="flex items-center justify-between text-luxury-sage text-xs font-medium uppercase tracking-wider">
                <span>Bài viết Tạp chí</span>
                <FileText className="w-4 h-4 text-emerald" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
                {articles.length} <span className="text-sm font-sans font-normal text-luxury-sage">bài</span>
              </div>
              <div className="text-xs text-emerald font-semibold">
                {articles.filter((a) => a.isPublished).length} bài đã xuất bản
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-2">
              <div className="flex items-center justify-between text-luxury-sage text-xs font-medium uppercase tracking-wider">
                <span>Tổng người dùng</span>
                <Users className="w-4 h-4 text-emerald" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
                {users.length} <span className="text-sm font-sans font-normal text-luxury-sage">tài khoản</span>
              </div>
              <div className="text-xs text-luxury-sage">
                {users.filter((u) => u.status === "active").length} đang hoạt động
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Shows */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-luxury-ink">
                  Show diễn mới nhất
                </h3>
                <button
                  onClick={() => handleOpenEventModal()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm show mới</span>
                </button>
              </div>
              <div className="divide-y divide-border-subtle">
                {events.slice(0, 3).map((evt) => (
                  <div key={evt.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 max-w-md">
                      <span className="text-[11px] font-semibold text-emerald uppercase tracking-wider">
                        {evt.artist.name}
                      </span>
                      <h4 className="text-sm font-semibold text-luxury-ink line-clamp-1">
                        {evt.title}
                      </h4>
                      <span className="text-[11px] text-luxury-sage">
                        {formatEventDate(evt.dateDisplay)} • Giá từ: {formatVND(evt.startingPrice)}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        evt.status === "on_sale"
                          ? "bg-emerald/10 text-emerald"
                          : evt.status === "sold_out"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {evt.status === "on_sale"
                        ? "Đang mở bán"
                        : evt.status === "sold_out"
                        ? "Hết vé"
                        : "Sắp mở bán"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Articles */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-luxury-ink">
                  Bài viết Tạp chí
                </h3>
                <button
                  onClick={() => handleOpenArticleModal()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Viết bài mới</span>
                </button>
              </div>
              <div className="divide-y divide-border-subtle">
                {articles.slice(0, 3).map((art) => (
                  <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 max-w-md">
                      <span className="text-[11px] font-semibold text-emerald uppercase tracking-wider">
                        {art.category}
                      </span>
                      <h4 className="text-sm font-semibold text-luxury-ink line-clamp-1">
                        {art.title}
                      </h4>
                      <span className="text-[11px] text-luxury-sage">
                        {art.authorName || "Ban Biên Tập"} • {formatEventDate((art.publishedAt || art.createdAt || "2026-08-23").slice(0, 10))}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        art.isPublished
                          ? "bg-emerald/10 text-emerald"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {art.isPublished ? "Đã đăng" : "Bản nháp"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: EVENTS & TICKET PRICING MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "events" && (
        <div className="space-y-6 animate-fade-in">
          {/* Actions & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Tìm show, nghệ sĩ, thành phố..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-full bg-white border border-border-subtle focus:border-emerald text-xs text-luxury-ink outline-none"
                />
                <Search className="w-3.5 h-3.5 text-luxury-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={eventStatusFilter}
                onChange={(e) => setEventStatusFilter(e.target.value)}
                className="h-10 px-4 rounded-full bg-white border border-border-subtle text-xs text-luxury-ink outline-none font-medium cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="on_sale">Đang mở bán (On Sale)</option>
                <option value="selling_soon">Sắp mở bán (Selling Soon)</option>
                <option value="sold_out">Đã hết vé (Sold Out)</option>
                <option value="past">Đã diễn ra (Past)</option>
              </select>
            </div>

            <button
              onClick={() => handleOpenEventModal()}
              className="px-6 py-2.5 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-all shadow-sm inline-flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Show mới</span>
            </button>
          </div>

          {/* Events Master Table */}
          <div className="bg-white rounded-3xl border border-border-subtle shadow-sm overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] uppercase tracking-wider text-luxury-sage">
                    <th className="py-3 px-4">Show & Nghệ sĩ</th>
                    <th className="py-3 px-4">Thời gian / Địa điểm</th>
                    <th className="py-3 px-4">Giá vé từ</th>
                    <th className="py-3 px-4">Hạng vé (Tiers)</th>
                    <th className="py-3 px-4 text-center">Trạng thái mở bán</th>
                    <th className="py-3 px-4 text-center">Hero / Featured</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-luxury-ivory/40 transition-colors">
                      {/* Show Title & Artist */}
                      <td className="py-4 px-4 font-semibold text-luxury-ink">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-luxury-dark/10">
                            <Image
                              src={evt.heroImage || mockEvents[0].heroImage}
                              alt={evt.title || "Show"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-0.5 max-w-xs">
                            <span className="line-clamp-1 block text-sm font-semibold">{evt.title || "Sự kiện"}</span>
                            <span className="text-xs text-emerald font-medium block">
                              {evt.artist?.name || "Nghệ sĩ"} • {evt.category || "Liveshow"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Venue */}
                      <td className="py-4 px-4 text-luxury-sage whitespace-nowrap text-xs">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-luxury-ink block">
                            {formatEventDate(evt.dateDisplay || "31.12.2026")} ({evt.timeDisplay || "20:00"})
                          </span>
                          <span className="text-luxury-sage block line-clamp-1">
                            {evt.venue?.name || "Địa điểm"} ({evt.venue?.city || "Toàn quốc"})
                          </span>
                        </div>
                      </td>

                      {/* Starting Price */}
                      <td className="py-4 px-4 font-bold text-luxury-ink whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="text-sm text-emerald block">
                            {formatVND(evt.startingPrice || 650000)}
                          </span>
                          <span className="text-[11px] text-luxury-muted font-normal">
                            {(evt.ticketTiers || []).length} hạng vé
                          </span>
                        </div>
                      </td>

                      {/* Ticket Tiers Manager Button */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenTierManager(evt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-luxury-ivory border border-border-subtle hover:border-emerald hover:text-emerald text-luxury-ink transition-colors shadow-sm"
                        >
                          <Layers className="w-3.5 h-3.5 text-emerald" />
                          <span>Sửa giá {(evt.ticketTiers || []).length} hạng vé</span>
                        </button>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <select
                          value={evt.status}
                          onChange={(e) =>
                            handleChangeEventStatus(evt, e.target.value as EventStatus)
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider outline-none cursor-pointer border ${
                            evt.status === "on_sale"
                              ? "bg-emerald/10 text-emerald border-emerald/30"
                              : evt.status === "selling_soon"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : evt.status === "sold_out"
                              ? "bg-rose-100 text-rose-700 border-rose-300"
                              : "bg-gray-100 text-gray-600 border-gray-300"
                          }`}
                        >
                          <option value="on_sale">🟢 Đang mở bán</option>
                          <option value="selling_soon">🟡 Sắp mở bán</option>
                          <option value="sold_out">🔴 Đã hết vé</option>
                          <option value="past">⚪ Đã kết thúc</option>
                        </select>
                      </td>

                      {/* Hero & Featured Toggles */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleEventHero(evt.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              evt.isHero
                                ? "bg-emerald text-white shadow-sm"
                                : "bg-gray-100 text-luxury-muted hover:text-luxury-ink"
                            }`}
                            title="Ghim lên 2 Banner Hero đầu trang chủ"
                          >
                            {evt.isHero ? "Hero ON" : "Hero Off"}
                          </button>
                          <button
                            onClick={() => handleToggleEventFeatured(evt.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              evt.isFeatured
                                ? "bg-champagne text-luxury-ink shadow-sm"
                                : "bg-gray-100 text-luxury-muted hover:text-luxury-ink"
                            }`}
                            title="Đánh dấu sự kiện Featured"
                          >
                            {evt.isFeatured ? "Featured" : "Normal"}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/event/${evt.slug}`}
                            target="_blank"
                            className="p-1.5 text-luxury-sage hover:text-emerald hover:bg-emerald/5 rounded-lg transition-colors"
                            title="Xem trang đặt vé"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEventModal(evt)}
                            className="p-1.5 text-luxury-sage hover:text-emerald hover:bg-emerald/5 rounded-lg transition-colors"
                            title="Chỉnh sửa toàn bộ Show"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa Show"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ARTICLES MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "articles" && (
        <div className="space-y-6 animate-fade-in">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Tìm bài viết, tác giả..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-full bg-white border border-border-subtle focus:border-emerald text-xs text-luxury-ink outline-none"
                />
                <Search className="w-3.5 h-3.5 text-luxury-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={articleCategoryFilter}
                onChange={(e) => setArticleCategoryFilter(e.target.value)}
                className="h-10 px-4 rounded-full bg-white border border-border-subtle text-xs text-luxury-ink outline-none font-medium cursor-pointer"
              >
                <option value="all">Tất cả chuyên mục</option>
                <option value="Phong cách & Nghệ thuật">Phong cách & Nghệ thuật</option>
                <option value="Hậu trường sân khấu">Hậu trường sân khấu</option>
                <option value="Phỏng vấn nghệ sĩ">Phỏng vấn nghệ sĩ</option>
                <option value="Review đêm nhạc">Review đêm nhạc</option>
              </select>
            </div>

            <button
              onClick={() => handleOpenArticleModal()}
              className="px-6 py-2.5 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-all shadow-sm inline-flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm bài viết mới</span>
            </button>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-3xl border border-border-subtle shadow-sm overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] uppercase tracking-wider text-luxury-sage">
                    <th className="py-3 px-4">Bài viết</th>
                    <th className="py-3 px-4">Chuyên mục</th>
                    <th className="py-3 px-4">Tác giả</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Lượt xem</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-luxury-ivory/40 transition-colors">
                      <td className="py-4 px-4 font-semibold text-luxury-ink">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-luxury-dark/10">
                            <Image
                              src={art.coverImage}
                              alt={art.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-0.5 max-w-sm">
                            <span className="line-clamp-1 block">{art.title}</span>
                            <span className="text-xs text-luxury-sage font-mono">
                              /journal/{art.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-luxury-sage whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald/5 text-emerald border border-emerald/10">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-luxury-sage whitespace-nowrap">
                        {art.authorName}
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleArticlePublish(art)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            art.isPublished
                              ? "bg-emerald text-white shadow-sm"
                              : "bg-gray-100 text-gray-500 hover:text-luxury-ink"
                          }`}
                        >
                          {art.isPublished ? "Đã đăng" : "Bản nháp"}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center text-luxury-sage whitespace-nowrap font-mono">
                        {art.viewCount.toLocaleString("vi-VN")}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/journal/${art.slug}`}
                            target="_blank"
                            className="p-1.5 text-luxury-sage hover:text-emerald hover:bg-emerald/5 rounded-lg transition-colors"
                            title="Xem trước bài viết"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenArticleModal(art)}
                            className="p-1.5 text-luxury-sage hover:text-emerald hover:bg-emerald/5 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: USERS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-fade-in">
          {/* Actions & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Tìm theo họ tên hoặc email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-full bg-white border border-border-subtle focus:border-emerald text-xs text-luxury-ink outline-none"
                />
                <Search className="w-3.5 h-3.5 text-luxury-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="h-10 px-4 rounded-full bg-white border border-border-subtle text-xs text-luxury-ink outline-none font-medium cursor-pointer"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="customer">Khách hàng (Customer)</option>
                <option value="admin">Quản trị viên (Admin)</option>
                <option value="editor">Biên tập viên (Editor)</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-all shadow-sm inline-flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm người dùng</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-border-subtle shadow-sm overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] uppercase tracking-wider text-luxury-sage">
                    <th className="py-3 px-4">Người dùng</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Số điện thoại</th>
                    <th className="py-3 px-4">Vai trò (Role)</th>
                    <th className="py-3 px-4">Đơn hàng / Chi tiêu</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-luxury-ivory/60 transition-colors group">
                      {/* User Name & Clickable Trigger */}
                      <td className="py-4 px-4 font-semibold text-luxury-ink whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenUserDetail(usr)}
                          className="flex items-center gap-3 text-left group-hover:text-emerald transition-colors"
                          title="Bấm để xem lịch sử và thông tin chi tiết vé đã mua"
                        >
                          <div className="w-9 h-9 rounded-full bg-emerald/10 text-emerald flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald group-hover:text-white transition-all shadow-sm">
                            {(usr.fullName || "User").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-luxury-ink group-hover:text-emerald block transition-colors">
                              {usr.fullName || "Khách hàng"}
                            </span>
                            <span className="text-[11px] text-luxury-sage block group-hover:text-emerald/80">
                              Xem chi tiết vé đã mua →
                            </span>
                          </div>
                        </button>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-luxury-sage font-mono text-xs whitespace-nowrap">
                        {usr.email}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-luxury-sage whitespace-nowrap">
                        {usr.phone || "—"}
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={usr.role}
                          onChange={(e) => handleChangeUserRole(usr, e.target.value as UserRole)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-luxury-ivory border border-border-subtle text-luxury-ink outline-none cursor-pointer"
                        >
                          <option value="customer">Customer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Orders & Total Spent */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenUserDetail(usr)}
                          className="text-left group/btn"
                          title="Bấm để xem danh sách vé đã mua của người này"
                        >
                          <span className="font-bold text-luxury-ink group-hover/btn:text-emerald group-hover/btn:underline block">
                            {usr.totalOrdersCount} đơn hàng
                          </span>
                          <span className="text-emerald font-semibold block text-[11px]">
                            {formatVND(usr.totalSpent)}
                          </span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                            usr.status === "active"
                              ? "bg-emerald/10 text-emerald"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {usr.status === "active" ? "Hoạt động" : "Tạm khóa"}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenUserDetail(usr)}
                            className="p-2 rounded-lg text-emerald bg-emerald/5 hover:bg-emerald hover:text-white transition-all text-xs font-semibold inline-flex items-center gap-1"
                            title="Xem lịch sử mua vé"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>Xem vé</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(usr)}
                            className={`p-2 rounded-lg transition-colors ${
                              usr.status === "active"
                                ? "text-amber-600 hover:bg-amber-50"
                                : "text-emerald hover:bg-emerald/10"
                            }`}
                            title={usr.status === "active" ? "Tạm khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {usr.status === "active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(usr.id, usr.fullName)}
                            className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-all text-xs font-semibold"
                            title="Xóa người dùng này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: SUPABASE CONFIGURATION */}
      {/* ======================================================== */}
      {activeTab === "supabase" && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald">
                  <Database className="w-4 h-4" />
                  <span>SUPABASE CLOUD INTEGRATION</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-luxury-ink">
                  Trạng thái kết nối Database Supabase
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-5 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-all shadow-sm disabled:opacity-50"
                >
                  {isTestingConnection ? "Đang kiểm tra..." : "Kiểm tra kết nối Live"}
                </button>
                <button
                  onClick={handleSeedData}
                  disabled={isSeedingData}
                  className="px-5 py-2.5 rounded-full bg-white border border-emerald/30 text-emerald text-xs font-semibold hover:bg-emerald hover:text-white transition-all shadow-sm disabled:opacity-50"
                >
                  {isSeedingData ? "Đang nạp..." : "Nạp dữ liệu mẫu lên Supabase"}
                </button>
              </div>
            </div>

            {/* Test Status Banner */}
            {supabaseTestStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
                  supabaseTestStatus.success
                    ? "bg-emerald/10 border-emerald/30 text-emerald"
                    : "bg-amber-50 border-amber-300 text-amber-800"
                }`}
              >
                {supabaseTestStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">
                    {supabaseTestStatus.success ? "Thành công!" : "Thông báo kết nối:"}
                  </span>
                  <span>{supabaseTestStatus.message}</span>
                </div>
              </div>
            )}

            <p className="text-sm text-luxury-sage leading-relaxed">
              TICKETSHOW đã được lập trình sẵn kiến trúc tích hợp toàn diện với Supabase cho bảng <code>profiles</code>, <code>articles</code>, <code>events</code>, <code>ticket_types</code>, <code>orders</code>. Để kết nối với project Supabase Cloud của bạn, vui lòng thực hiện 3 bước đơn giản dưới đây:
            </p>

            {/* Step 1: Create Project & Get Keys */}
            <div className="p-6 rounded-2xl bg-luxury-ivory border border-border-subtle space-y-3">
              <h4 className="font-semibold text-sm text-luxury-ink">
                Bước 1: Lấy URL và Anon Key từ Supabase Dashboard
              </h4>
              <p className="text-xs text-luxury-sage">
                Truy cập <a href="https://supabase.com/dashboard" target="_blank" className="text-emerald underline font-semibold">supabase.com/dashboard</a> &gt; Chọn project của bạn &gt; vào <strong>Project Settings</strong> &gt; <strong>API</strong> &gt; Sao chép <strong>Project URL</strong> và <strong>anon / public key</strong>.
              </p>
            </div>

            {/* Step 2: Env */}
            <div className="p-6 rounded-2xl bg-luxury-ivory border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-luxury-ink">
                  Bước 2: Cấu hình biến môi trường trong file <code>.env.local</code>
                </h4>
                {isSupabaseConfigured && (
                  <span className="px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã cấu hình xong!</span>
                  </span>
                )}
              </div>
              <pre className="p-4 rounded-xl bg-luxury-dark text-emerald-300 text-xs font-mono overflow-x-auto">
{isSupabaseConfigured
  ? `# Thông tin dự án của bạn (Đã điền sẵn trong .env.local):
NEXT_PUBLIC_SUPABASE_URL=https://iqepkfuzjwyxuohoqqzm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_NTkPZVcSnQ9C8cNOMjbZug_cxvV_Vou`
  : `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key`}
              </pre>
              {isSupabaseConfigured && (
                <p className="text-xs text-emerald font-medium">
                  ✓ Bạn không cần thao tác thêm ở bước này vì hệ thống đã tự động lưu đúng URL và API Key của bạn.
                </p>
              )}
            </div>

            {/* Step 3: SQL Script */}
            <div className="p-6 rounded-2xl bg-luxury-ivory border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-luxury-ink">
                  Bước 3: Khởi tạo bảng dữ liệu trên Supabase SQL Editor
                </h4>
                <button
                  onClick={copySqlCode}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors shadow-sm"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? "Đã sao chép!" : "Sao chép mã SQL"}</span>
                </button>
              </div>
              <p className="text-xs text-luxury-sage">
                Mã nguồn SQL hoàn chỉnh đã được lưu sẵn tại tệp <code>supabase/schema.sql</code>. Bạn chỉ cần dán vào Supabase Dashboard &gt; <strong>SQL Editor</strong> &gt; <strong>New query</strong> và nhấn <strong>Run</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TICKET TIERS & PRICES MANAGER */}
      {/* ======================================================== */}
      {isTierModalOpen && managingTiersEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-2xl overflow-hidden my-8">
            <div className="px-6 sm:px-8 py-5 border-b border-border-subtle flex items-center justify-between bg-luxury-ivory/60">
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-emerald">
                  TICKET TIERS & PRICING
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-luxury-ink">
                  Quản lý giá tiền & hạng vé: {managingTiersEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setIsTierModalOpen(false)}
                className="p-2 text-luxury-muted hover:text-luxury-ink rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs text-luxury-sage">
                  Điều chỉnh giá vé từng hạng, số lượng vé mở bán và tình trạng vé.
                </span>
                <button
                  type="button"
                  onClick={handleAddNewTier}
                  className="px-4 py-2 rounded-full bg-emerald/10 text-emerald text-xs font-semibold hover:bg-emerald hover:text-white transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm hạng vé mới</span>
                </button>
              </div>

              <div className="space-y-4">
                {managingTiersEvent.ticketTiers.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className="p-5 rounded-2xl border border-border-subtle bg-luxury-ivory/40 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-luxury-ink">
                          #{idx + 1}. {tier.name}
                        </span>
                        {tier.isPopular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-champagne text-luxury-ink uppercase">
                            VIP Choice
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTier(idx)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa hạng</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Tier Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-ink">
                          Tên hạng vé
                        </label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => {
                            const updated = [...managingTiersEvent.ticketTiers];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setManagingTiersEvent({
                              ...managingTiersEvent,
                              ticketTiers: updated,
                            });
                          }}
                          className="w-full h-10 px-3 rounded-xl bg-white border border-border-subtle text-xs font-semibold text-luxury-ink outline-none"
                        />
                      </div>

                      {/* Tier Price */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-emerald">
                          Giá vé (VNĐ) *
                        </label>
                        <input
                          type="number"
                          step="10000"
                          value={tier.price}
                          onChange={(e) =>
                            handleUpdateTierPrice(idx, Number(e.target.value) || 0)
                          }
                          className="w-full h-10 px-3 rounded-xl bg-white border border-emerald/40 text-xs font-bold text-emerald outline-none"
                        />
                      </div>

                      {/* Quantity: Available / Total */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-ink">
                          Vé còn lại / Tổng số vé
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tier.availableQuantity}
                            onChange={(e) =>
                              handleUpdateTierQuantity(
                                idx,
                                Number(e.target.value) || 0,
                                tier.totalQuantity
                              )
                            }
                            className="w-1/2 h-10 px-3 rounded-xl bg-white border border-border-subtle text-xs font-semibold text-luxury-ink outline-none"
                            placeholder="Còn lại"
                          />
                          <span className="text-luxury-muted">/</span>
                          <input
                            type="number"
                            value={tier.totalQuantity}
                            onChange={(e) =>
                              handleUpdateTierQuantity(
                                idx,
                                tier.availableQuantity,
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-1/2 h-10 px-3 rounded-xl bg-white border border-border-subtle text-xs font-semibold text-luxury-ink outline-none"
                            placeholder="Tổng vé"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tier Description */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-luxury-sage">
                        Mô tả quyền lợi hạng vé
                      </label>
                      <input
                        type="text"
                        value={tier.description}
                        onChange={(e) => {
                          const updated = [...managingTiersEvent.ticketTiers];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setManagingTiersEvent({
                            ...managingTiersEvent,
                            ticketTiers: updated,
                          });
                        }}
                        className="w-full h-9 px-3 rounded-xl bg-white border border-border-subtle text-xs text-luxury-ink outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-border-subtle bg-luxury-ivory/50 flex items-center justify-between">
              <div className="text-xs text-luxury-sage">
                Giá khởi điểm cập nhật tự động:{" "}
                <strong className="text-emerald font-bold">
                  {formatVND(managingTiersEvent.startingPrice)}
                </strong>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTierModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-luxury-sage hover:text-luxury-ink"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveTiers}
                  className="px-7 py-2.5 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover shadow-sm active:scale-95 transition-all"
                >
                  Lưu thay đổi giá vé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT FULL SHOW */}
      {/* ======================================================== */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-2xl overflow-hidden my-8">
            <div className="px-6 sm:px-8 py-5 border-b border-border-subtle flex items-center justify-between bg-luxury-ivory/60">
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-emerald">
                  SHOW & EVENT BUILDER
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-luxury-ink">
                  {editingEvent ? "Chỉnh sửa toàn bộ thông tin Show" : "Tạo Show bán vé mới"}
                </h3>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-2 text-luxury-muted hover:text-luxury-ink rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Tên sự kiện / Show diễn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: THE NIGHT WE REMEMBER..."
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none font-semibold text-luxury-ink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Phụ đề (Subtitle)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Acoustic & Symphony Grand Live Experience"
                    value={eventForm.subtitle}
                    onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Nghệ sĩ biểu diễn chính *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hà Anh Tuấn, Vũ., Hoàng Dũng..."
                    value={eventForm.artistName}
                    onChange={(e) => setEventForm({ ...eventForm, artistName: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Thể loại sự kiện
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, category: e.target.value as EventCategory })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink cursor-pointer"
                  >
                    <option value="Liveshow">Liveshow</option>
                    <option value="Âm nhạc">Âm nhạc</option>
                    <option value="Festival">Festival</option>
                    <option value="Theater">Theater</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Trạng thái mở bán vé
                  </label>
                  <select
                    value={eventForm.status}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, status: e.target.value as EventStatus })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm font-semibold outline-none text-luxury-ink cursor-pointer"
                  >
                    <option value="on_sale">🟢 Đang mở bán (On Sale)</option>
                    <option value="selling_soon">🟡 Sắp mở bán (Selling Soon)</option>
                    <option value="sold_out">🔴 Đã hết vé (Sold Out)</option>
                    <option value="past">⚪ Đã kết thúc (Past)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Địa điểm tổ chức (Venue) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nhà Hát Lớn Hà Nội"
                    value={eventForm.venueName}
                    onChange={(e) => setEventForm({ ...eventForm, venueName: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Thành phố
                  </label>
                  <select
                    value={eventForm.venueCity}
                    onChange={(e) => setEventForm({ ...eventForm, venueCity: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink cursor-pointer"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Đà Lạt">Đà Lạt</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Ngày biểu diễn (VD: 31.12.2026)
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.dateDisplay}
                    onChange={(e) => setEventForm({ ...eventForm, dateDisplay: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Giờ biểu diễn (VD: 20:00 - 23:30)
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.timeDisplay}
                    onChange={(e) => setEventForm({ ...eventForm, timeDisplay: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Ảnh bìa sự kiện (Hero Image URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={eventForm.heroImage}
                    onChange={(e) => setEventForm({ ...eventForm, heroImage: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Giới thiệu chi tiết sự kiện
                  </label>
                  <textarea
                    rows={4}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full p-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none text-luxury-ink resize-none"
                  />
                </div>
              </div>

              {/* Toggles Strip */}
              <div className="p-4 rounded-2xl bg-luxury-ivory border border-border-subtle flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={eventForm.isHero}
                    onChange={(e) => setEventForm({ ...eventForm, isHero: e.target.checked })}
                    className="accent-emerald w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-luxury-ink">
                    Ghim lên 2 Banner Hero trang chủ
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={eventForm.isFeatured}
                    onChange={(e) => setEventForm({ ...eventForm, isFeatured: e.target.checked })}
                    className="accent-emerald w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-luxury-ink">
                    Ghim nhãn Featured nổi bật
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={eventForm.isSellingFast}
                    onChange={(e) => setEventForm({ ...eventForm, isSellingFast: e.target.checked })}
                    className="accent-emerald w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-luxury-ink">
                    Nhãn cảnh báo &quot;Sắp hết vé&quot;
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-luxury-sage hover:text-luxury-ink"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-all shadow-sm active:scale-95"
                >
                  <span>{editingEvent ? "Lưu thông tin Show" : "Tạo Show mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT ARTICLE */}
      {/* ======================================================== */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-2xl overflow-hidden my-8">
            <div className="px-6 sm:px-8 py-5 border-b border-border-subtle flex items-center justify-between bg-luxury-ivory/60">
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-emerald">
                  EDITORIAL ARTICLE CREATOR
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-luxury-ink">
                  {editingArticle ? "Chỉnh sửa bài viết" : "Soạn thảo bài viết mới"}
                </h3>
              </div>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-2 text-luxury-muted hover:text-luxury-ink rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 sm:p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề ấn tượng..."
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Chuyên mục
                  </label>
                  <select
                    value={articleForm.category}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        category: e.target.value as ArticleCategory,
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all cursor-pointer"
                  >
                    <option value="Phong cách & Nghệ thuật">Phong cách & Nghệ thuật</option>
                    <option value="Hậu trường sân khấu">Hậu trường sân khấu</option>
                    <option value="Phỏng vấn nghệ sĩ">Phỏng vấn nghệ sĩ</option>
                    <option value="Review đêm nhạc">Review đêm nhạc</option>
                    <option value="Thông báo mở bán">Thông báo mở bán</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                    Tác giả / Bút danh
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ban Biên Tập TICKETSHOW"
                    value={articleForm.authorName}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, authorName: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Đường dẫn ảnh bìa (Cover Image URL)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={articleForm.coverImage}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, coverImage: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Tóm tắt ngắn (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tóm tắt 1-2 câu nội dung chính của bài viết..."
                  value={articleForm.excerpt}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, excerpt: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Nội dung chi tiết bài viết (Markdown / Text) *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Nhập nội dung bài viết chi tiết tại đây..."
                  value={articleForm.content}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, content: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald focus:bg-white text-sm outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={articleForm.isPublished}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, isPublished: e.target.checked })
                    }
                    className="accent-emerald w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-luxury-ink">
                    Xuất bản công khai ngay (Publish to Journal)
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-luxury-sage hover:text-luxury-ink"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full bg-emerald text-white text-xs sm:text-sm font-semibold hover:bg-emerald-hover transition-all shadow-sm active:scale-95"
                  >
                    <span>{editingArticle ? "Cập nhật bài viết" : "Lưu bài viết"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD USER */}
      {/* ======================================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-border-subtle shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between bg-luxury-ivory/60">
              <h3 className="font-serif text-xl font-semibold text-luxury-ink">
                Thêm người dùng mới
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-2 text-luxury-muted hover:text-luxury-ink rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Email tài khoản *
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-luxury-ink">
                  Phân quyền (Role)
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })
                  }
                  className="w-full h-12 px-4 rounded-xl bg-luxury-ivory/60 border border-border-subtle focus:border-emerald text-sm outline-none cursor-pointer"
                >
                  <option value="customer">Khách hàng (Customer)</option>
                  <option value="editor">Biên tập viên (Editor)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-luxury-sage"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: USER DETAIL & PURCHASED TICKETS HISTORY */}
      {/* ======================================================== */}
      {isUserDetailModalOpen && selectedUserForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-border-subtle flex items-center justify-between bg-luxury-ivory/70">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {(selectedUserForDetail.fullName || "User").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-emerald">
                      HỒ SƠ KHÁCH HÀNG & LỊCH SỬ MUA VÉ
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        selectedUserForDetail.status === "active"
                          ? "bg-emerald/10 text-emerald"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {selectedUserForDetail.status === "active" ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-luxury-ink">
                    {selectedUserForDetail.fullName}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserDetailModalOpen(false)}
                className="p-2.5 text-luxury-muted hover:text-luxury-ink rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
              {/* User Overview Profile Card */}
              <div className="p-6 rounded-3xl bg-luxury-ivory/50 border border-border-subtle space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-luxury-sage uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald" />
                      <span>Email liên hệ</span>
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-luxury-ink font-mono block break-all">
                      {selectedUserForDetail.email}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-luxury-sage uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald" />
                      <span>Số điện thoại</span>
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-luxury-ink block">
                      {selectedUserForDetail.phone || "Chưa cập nhật"}
                    </span>
                  </div>

                  {/* Role Switcher */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-luxury-sage uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald" />
                      <span>Phân quyền (Role)</span>
                    </span>
                    <select
                      value={selectedUserForDetail.role}
                      onChange={(e) =>
                        handleChangeUserRole(selectedUserForDetail, e.target.value as UserRole)
                      }
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-border-subtle text-luxury-ink outline-none cursor-pointer w-full"
                    >
                      <option value="customer">Customer (Khách hàng)</option>
                      <option value="editor">Editor (Biên tập viên)</option>
                      <option value="admin">Admin (Quản trị viên)</option>
                    </select>
                  </div>

                  {/* Created At */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-luxury-sage uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-emerald" />
                      <span>Ngày tham gia</span>
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-luxury-ink block">
                      {new Date(selectedUserForDetail.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                {/* KPI Metrics Ribbon */}
                <div className="pt-4 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-border-subtle">
                    <span className="text-[11px] font-medium text-luxury-sage uppercase block">
                      Tổng tiền đã chi tiêu
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-emerald">
                      {formatVND(selectedUserForDetail.totalSpent)}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-border-subtle">
                    <span className="text-[11px] font-medium text-luxury-sage uppercase block">
                      Số đơn hàng đã mua
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-luxury-ink">
                      {selectedUserOrders.length > 0
                        ? selectedUserOrders.length
                        : selectedUserForDetail.totalOrdersCount}{" "}
                      đơn
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-border-subtle">
                    <span className="text-[11px] font-medium text-luxury-sage uppercase block">
                      Tổng số vé phát hành
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-champagne-dark">
                      {selectedUserOrders.reduce((sum, o) => sum + o.quantity, 0)} vé
                    </span>
                  </div>
                </div>
              </div>

              {/* Tickets & Orders History Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-emerald" />
                    <h4 className="font-serif text-lg sm:text-xl font-semibold text-luxury-ink">
                      Danh sách vé & Thời gian đã mua ({selectedUserOrders.length})
                    </h4>
                  </div>
                  <span className="text-xs text-luxury-sage">
                    Chi tiết từng sự kiện, thời điểm đặt vé & vị trí ghế
                  </span>
                </div>

                {isLoadingUserOrders ? (
                  <div className="py-12 text-center text-sm text-luxury-sage">
                    Đang tải dữ liệu vé...
                  </div>
                ) : selectedUserOrders.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-luxury-ivory/40 border border-dashed border-border-subtle text-center space-y-2">
                    <Ticket className="w-8 h-8 text-luxury-muted mx-auto" />
                    <p className="font-serif text-base font-semibold text-luxury-ink">
                      Chưa có đơn mua vé nào
                    </p>
                    <p className="text-xs text-luxury-sage">
                      Người dùng này chưa phát sinh giao dịch đặt vé nào trên hệ thống.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedUserOrders.map((ord, idx) => (
                      <div
                        key={ord.id || idx}
                        className="p-5 sm:p-6 rounded-3xl bg-white border border-border-subtle shadow-sm hover:border-emerald/40 transition-all space-y-4"
                      >
                        {/* Order Top Bar: Purchase Time & Order Number */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-bold font-mono">
                              #{ord.orderNumber}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-luxury-ivory border border-border-subtle text-xs font-semibold text-luxury-ink">
                              <Clock className="w-3.5 h-3.5 text-emerald" />
                              <span>
                                Thời gian mua:{" "}
                                <strong className="text-emerald">
                                  {new Date(ord.createdAt).toLocaleString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </strong>
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Đã thanh toán</span>
                            </span>
                            <span className="text-xs font-medium text-luxury-sage capitalize">
                              (Qua {ord.paymentMethod.replace("_", " ")})
                            </span>
                          </div>
                        </div>

                        {/* Event Details & Thumbnail */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-luxury-dark/10">
                              <Image
                                src={ord.eventImage}
                                alt={ord.eventTitle}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald">
                                {ord.venueCity} • {ord.ticketTierName}
                              </span>
                              <h5 className="font-serif text-base sm:text-lg font-bold text-luxury-ink">
                                {ord.eventTitle}
                              </h5>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-luxury-sage">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-emerald" />
                                  <span>
                                    {formatEventDate(ord.eventDate)} ({ord.eventTime})
                                  </span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-emerald" />
                                  <span>{ord.venueName}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Quantity Box */}
                          <div className="text-left sm:text-right space-y-0.5 shrink-0 bg-luxury-ivory/60 p-3 sm:p-0 rounded-2xl sm:bg-transparent w-full sm:w-auto">
                            <span className="text-xs text-luxury-sage block">
                              {formatVND(ord.unitPrice)} × {ord.quantity} vé
                            </span>
                            <span className="font-serif text-xl font-bold text-emerald block">
                              {formatVND(ord.totalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Seat Numbers & QR Ticket Action */}
                        <div className="p-4 rounded-2xl bg-luxury-ivory/70 border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-sage block">
                              Vị trí ghế ngồi / Check-in:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {ord.seatNumbers && ord.seatNumbers.length > 0 ? (
                                ord.seatNumbers.map((seat, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2.5 py-1 rounded-lg bg-white border border-border-subtle text-xs font-semibold text-luxury-ink"
                                  >
                                    {seat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-luxury-sage">Vé vào cửa tự do</span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedOrderForQr(ord)}
                            className="px-4 py-2 rounded-full bg-luxury-ink text-white hover:bg-emerald transition-all text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                          >
                            <QrCode className="w-3.5 h-3.5 text-champagne" />
                            <span>Xem mã QR vé điện tử</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-border-subtle bg-luxury-ivory/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-luxury-sage">
                Mã định danh khách hàng: <code className="font-mono">{selectedUserForDetail.id}</code>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteUser(selectedUserForDetail.id, selectedUserForDetail.fullName)
                  }
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa người dùng</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleUserStatus(selectedUserForDetail)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    selectedUserForDetail.status === "active"
                      ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                      : "bg-emerald/10 text-emerald hover:bg-emerald hover:text-white"
                  }`}
                >
                  {selectedUserForDetail.status === "active"
                    ? "Tạm khóa tài khoản"
                    : "Mở khóa tài khoản"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsUserDetailModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DIGITAL QR BOARDING PASS PREVIEW */}
      {/* ======================================================== */}
      {selectedOrderForQr && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-[32px] border border-border-subtle shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-emerald text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-champagne font-bold block">
                  TICKETSHOW LUXURY PASS
                </span>
                <h4 className="font-serif text-lg font-bold">{selectedOrderForQr.eventTitle}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForQr(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-center">
              {/* Real Scannable QR Box */}
              <div className="p-4 rounded-3xl bg-luxury-ivory border border-border-subtle inline-block mx-auto shadow-sm">
                <div className="bg-white border border-border-subtle rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 shadow-inner">
                  <QRCodeSVG
                    value={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/verify/${selectedOrderForQr.orderNumber}`
                        : `https://ticketshow.vn/verify/${selectedOrderForQr.orderNumber}`
                    }
                    size={170}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#062319"
                    includeMargin={false}
                  />
                  <span className="font-mono text-xs font-bold text-emerald tracking-wider pt-1">
                    #{selectedOrderForQr.orderNumber}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quét bằng Camera điện thoại hoặc Zalo</span>
                </p>
                <p className="text-[11px] text-luxury-sage">
                  Điện thoại sẽ tự động mở trang xác thực thông tin show, giá tiền, thời gian và địa điểm.
                </p>
              </div>

              {/* Complete Event & Price Details Box */}
              <div className="space-y-2.5 text-left bg-luxury-ivory/60 p-4 rounded-2xl border border-border-subtle text-xs">
                <div className="flex justify-between items-start pb-2 border-b border-border-subtle">
                  <span className="text-luxury-sage">Show diễn:</span>
                  <span className="font-bold text-luxury-ink text-right max-w-[200px]">
                    {selectedOrderForQr.eventTitle}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                  <span className="text-luxury-sage">Giá tiền đã mua:</span>
                  <span className="font-serif text-sm font-bold text-emerald">
                    {formatVND(selectedOrderForQr.totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between items-start pb-2 border-b border-border-subtle">
                  <span className="text-luxury-sage">Thời gian diễn:</span>
                  <span className="font-semibold text-luxury-ink text-right">
                    {formatEventDate(selectedOrderForQr.eventDate)} ({selectedOrderForQr.eventTime})
                  </span>
                </div>

                <div className="flex justify-between items-start pb-2 border-b border-border-subtle">
                  <span className="text-luxury-sage">Địa điểm:</span>
                  <span className="font-semibold text-luxury-ink text-right max-w-[200px]">
                    {selectedOrderForQr.venueName} ({selectedOrderForQr.venueCity})
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                  <span className="text-luxury-sage">Hạng vé & Số lượng:</span>
                  <span className="font-semibold text-emerald">
                    {selectedOrderForQr.ticketTierName} ({selectedOrderForQr.quantity} vé)
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                  <span className="text-luxury-sage">Vị trí ghế ngồi:</span>
                  <span className="font-bold text-luxury-ink">
                    {selectedOrderForQr.seatNumbers?.join(", ") || "Tự do"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-luxury-sage">Người sở hữu:</span>
                  <span className="font-semibold text-luxury-ink">{selectedOrderForQr.customerName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href={`/verify/${selectedOrderForQr.orderNumber}`}
                  target="_blank"
                  className="w-full py-3 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
                >
                  <span>Mở trang xác thực vé trên trình duyệt</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedOrderForQr(null)}
                  className="w-full py-2.5 rounded-full text-xs font-semibold text-luxury-sage hover:text-luxury-ink transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
