import type { Metadata } from "next";
import { site } from "@/config/site";

type Opcoes = {
  /** Título curto. O layout completa com " · Pablo Ortiz". */
  titulo: string;
  descricao: string;
  /** Caminho da página, vira a URL canônica ("/blog"). */
  caminho: string;
  /** Dados de artigo (posts). */
  artigo?: {
    publicado: string;
    atualizado?: string;
    secao: string;
    tags: readonly string[];
  };
  /** Imagem de compartilhamento gerada pelo scripts/gerar-og.ts. */
  imagem?: { caminho: string; alt: string };
  /** Rascunho: fora do Google mesmo que a página vaze num build. */
  rascunho?: boolean;
};

export const IMAGEM_PADRAO = {
  caminho: "/og/site.png",
  alt: `${site.nome}: IA aplicada, LLMs e dados`,
};

// O openGraph de uma página substitui o do layout inteiro (não mescla), então
// siteName, locale e imagem vão aqui em toda página.
export function metadataDaPagina({
  titulo,
  descricao,
  caminho,
  artigo,
  imagem = IMAGEM_PADRAO,
  rascunho,
}: Opcoes): Metadata {
  const tituloCompleto = `${titulo} · ${site.nome}`;
  const imagens = [
    { url: imagem.caminho, width: 1200, height: 630, alt: imagem.alt },
  ];
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      title: tituloCompleto,
      description: descricao,
      url: caminho,
      siteName: site.nome,
      locale: "pt_BR",
      images: imagens,
      ...(artigo
        ? {
            type: "article",
            publishedTime: artigo.publicado,
            modifiedTime: artigo.atualizado ?? artigo.publicado,
            authors: [`${site.url}/sobre`],
            section: artigo.secao,
            tags: [...artigo.tags],
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: tituloCompleto,
      description: descricao,
      images: imagens,
    },
    ...(rascunho ? { robots: { index: false, follow: false } } : {}),
  };
}
