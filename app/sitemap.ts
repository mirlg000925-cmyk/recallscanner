import { MetadataRoute } from "next";
import { vehicles } from "@/lib/vehicles";
import { getAvailableYears } from "@/lib/recalls";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://recallscanner.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  for (const v of vehicles) {
    entries.push({
      url: `${SITE_URL}/recall/${v.manufacturerSlug}/${v.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    const years = getAvailableYears(v.manufacturerSlug, v.slug);
    for (const y of years) {
      entries.push({
        url: `${SITE_URL}/recall/${v.manufacturerSlug}/${v.slug}/${y}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
