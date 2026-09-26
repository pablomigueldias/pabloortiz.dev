import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BioAutor } from "@/components/blog/BioAutor";
import { CartaoPost } from "@/components/blog/CartaoPost";
import { ConviteNewsletter } from "@/components/blog/ConviteNewsletter";
import { Sumario } from "@/components/blog/Sumario";
import { CTA } from "@/components/mdx/CTA";
import { dataPorExtenso, ROTULO_PILAR } from "@/content/formatar";
import { getAllPosts, getPost, getRelacionados } from "@/content/posts";
import type { PostIndexado } from "@/content/schema";
import { JsonLd } from "@/seo/JsonLd";
import { metadataDaPagina } from "@/seo/metadata";
import { ID_PESSOA, ID_SITE, trilha, url } from "@/seo/schema-org";

// CTA do fim do post, quando o autor não pôs um <CTA> no meio do texto.
const TEXTO_CTA: Record<PostIndexado["pilar"], string> = {
  "ia-llms": "Quer um RAG ou LLM rodando de verdade no seu time?",
  "dados-ml": "Precisa transformar os seus dados em decisão?",
  "automacao-negocio": "Quer saber onde o seu WhatsApp está perdendo cliente?",
};

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return metadataDaPagina({
    titulo: post.titulo,
    descricao: post.descricao,
    caminho: `/blog/${post.slug}`,
    artigo: {
      publicado: post.data,
      atualizado: post.atualizado,
      secao: ROTULO_PILAR[post.pilar],
      tags: post.tags,
    },
    imagem: {
      caminho: `/og/blog/${post.slug}.png`,
      alt: `Capa do post "${post.titulo}"`,
    },
    rascunho: post.draft,
  });
}

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Conteudo } = (await import(`@content/blog/${slug}.mdx`)) as {
    default: React.ComponentType;
  };
  const relacionados = getRelacionados(post);

  return (
    <>
      <JsonLd
        dados={{
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.titulo,
              description: post.descricao,
              url: url(`/blog/${post.slug}`),
              mainEntityOfPage: url(`/blog/${post.slug}`),
              image: url(`/og/blog/${post.slug}.png`),
              datePublished: post.data,
              dateModified: post.atualizado ?? post.data,
              inLanguage: post.lang,
              articleSection: ROTULO_PILAR[post.pilar],
              keywords: post.tags,
              timeRequired: `PT${post.minutosDeLeitura}M`,
              author: { "@id": ID_PESSOA },
              publisher: { "@id": ID_PESSOA },
              isPartOf: { "@id": ID_SITE },
            },
            trilha([
              ["Blog", "/blog"],
              [ROTULO_PILAR[post.pilar], `/blog/categoria/${post.pilar}`],
              [post.titulo, `/blog/${post.slug}`],
            ]),
          ],
        }}
      />
      <div aria-hidden className="barra-progresso" />
      <article
        data-pagefind-body
        data-pagefind-meta="tipo:Post"
        className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16"
      >
        <Link
          href="/blog"
          data-pagefind-ignore
          className="text-muted-foreground hover:text-primary text-sm font-medium tracking-wider uppercase"
        >
          ← Blog
        </Link>

        <header className="mt-8 mb-12">
          <div
            data-pagefind-ignore
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <Link
              href={`/blog/categoria/${post.pilar}`}
              className="bg-primary/10 text-primary border-primary/20 hover:border-primary/60 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors"
            >
              {ROTULO_PILAR[post.pilar]}
            </Link>
            {post.draft && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase dark:text-amber-400">
                Rascunho
              </span>
            )}
          </div>
          <h1 className="text-foreground text-3xl leading-tight font-bold text-balance md:text-5xl">
            {post.titulo}
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            {post.descricao}
          </p>
          <div
            data-pagefind-ignore
            className="text-muted-foreground border-border mt-8 flex flex-wrap gap-x-6 gap-y-2 border-y py-4 font-mono text-sm"
          >
            <time dateTime={post.data}>{dataPorExtenso(post.data)}</time>
            <span>{post.minutosDeLeitura} min de leitura</span>
            {post.atualizado && (
              <span>
                Atualizado em{" "}
                <time dateTime={post.atualizado}>
                  {dataPorExtenso(post.atualizado)}
                </time>
              </span>
            )}
          </div>
          {post.tags.length > 0 && (
            <ul
              aria-label="Tags"
              className="text-muted-foreground mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs"
            >
              {post.tags.map((t) => (
                <li key={t}>#{t}</li>
              ))}
            </ul>
          )}
        </header>

        <Sumario itens={post.sumario} />

        <div className="post prose prose-lg dark:prose-invert max-w-none">
          <Conteudo />
        </div>

        {!post.temCTA && (
          <div data-pagefind-ignore>
            <CTA assunto={`"${post.titulo}"`} texto={TEXTO_CTA[post.pilar]} />
          </div>
        )}

        {post.pilar === "automacao-negocio" && <ConviteNewsletter />}

        <BioAutor />

        {relacionados.length > 0 && (
          <section
            aria-labelledby="leia-tambem"
            data-pagefind-ignore
            className="mt-16"
          >
            <h2
              id="leia-tambem"
              className="text-foreground mb-6 text-2xl font-bold"
            >
              Leia também
            </h2>
            <ul className="flex flex-col gap-6">
              {relacionados.map((p) => (
                <li key={p.slug}>
                  <CartaoPost post={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
