import { site } from "@/config/site";
import { ROTULO_PILAR } from "@/content/formatar";
import { perfil } from "@/content/perfil";
import { getAllPosts } from "@/content/posts";

// Gerado no build, como o resto do site.
export const dynamic = "force-static";

const MAX_ITENS = 20;

function xml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// "2026-09-21" → data RFC 822, ao meio-dia de São Paulo (não "volta um dia").
const dataRss = (data: string) =>
  new Date(`${data}T12:00:00-03:00`).toUTCString();

export function GET() {
  const posts = getAllPosts().slice(0, MAX_ITENS);
  const itens = posts
    .map((p) => {
      const link = `${site.url}/blog/${p.slug}`;
      return `    <item>
      <title>${xml(p.titulo)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${xml(p.descricao)}</description>
      <pubDate>${dataRss(p.data)}</pubDate>
      <category>${xml(ROTULO_PILAR[p.pilar])}</category>
    </item>`;
    })
    .join("\n");

  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${site.nome} · Blog`)}</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xml(perfil.frase)}</description>
    <language>pt-BR</language>
${posts[0] ? `    <lastBuildDate>${dataRss(posts[0].atualizado ?? posts[0].data)}</lastBuildDate>\n` : ""}${itens}
  </channel>
</rss>
`;

  return new Response(corpo, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
