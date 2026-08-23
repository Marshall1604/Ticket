import { MetadataRoute } from "next";
import { mockEvents } from "@/data/mockEvents";
import { mockArtists } from "@/data/mockArtists";
import { mockArticles } from "@/data/mockArticles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ticketshow.vn";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shows`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/my-tickets`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const eventPages: MetadataRoute.Sitemap = mockEvents.map((evt) => ({
    url: `${baseUrl}/event/${evt.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.95,
  }));

  const artistPages: MetadataRoute.Sitemap = mockArtists.map((artist) => ({
    url: `${baseUrl}/artist/${artist.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = mockArticles.map((art) => ({
    url: `${baseUrl}/journal/${art.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...eventPages, ...artistPages, ...articlePages];
}
