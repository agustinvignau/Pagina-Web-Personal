import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // El panel ya se declara noindex en su propio layout; esto lo saca
    // además del rastreo, para no gastar presupuesto de crawl en una
    // pantalla de login.
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: "https://www.agustinvignau.com/sitemap.xml",
  };
}
