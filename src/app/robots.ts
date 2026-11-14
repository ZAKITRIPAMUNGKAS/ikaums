import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/app", "/direktori"],
      },
    ],
    sitemap: "https://ikaums.vercel.app/sitemap.xml",
  };
}
