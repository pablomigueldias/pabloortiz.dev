import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAllPosts } from "@/content/posts";
import { getProjetos } from "@/content/projetos";
import { PILARES } from "@/content/pilares";

// Só páginas publicadas: getAllPosts e getProjetos já deixam rascunho de fora
// no build de produção.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const ultimaAtualizacao = (datas: string[]) =>
    datas.length > 0 ? datas.sort().at(-1) : undefined;

  return [
    ...["/", "/sobre", "/servicos", "/contato", "/privacidade"].map(
      (caminho) => ({ url: `${site.url}${caminho === "/" ? "" : caminho}` }),
    ),
    {
      url: `${site.url}/blog`,
      lastModified: ultimaAtualizacao(posts.map((p) => p.atualizado ?? p.data)),
    },
    ...PILARES.map((pilar) => ({ url: `${site.url}/blog/categoria/${pilar}` })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.atualizado ?? p.data,
    })),
    { url: `${site.url}/projetos` },
    ...getProjetos().map((p) => ({
      url: `${site.url}/projetos/${p.slug}`,
      lastModified: p.data,
    })),
  ];
}
