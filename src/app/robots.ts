import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sitemint.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/api/", "/builder"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
