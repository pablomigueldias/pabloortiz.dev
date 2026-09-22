import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Só o build com SITE_ENV=production (variável de build do Worker na Cloudflare)
// libera o Google. Preview, *.workers.dev e build local ficam bloqueados.
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
