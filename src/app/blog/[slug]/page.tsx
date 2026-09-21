import "katex/dist/katex.min.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dataPorExtenso, ROTULO_PILAR } from "@/content/formatar";
import { getAllPosts, getPost } from "@/content/posts";

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Conteudo } = (await import(`@content/blog/${slug}.mdx`)) as {
    default: React.ComponentType;
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-primary text-sm font-medium tracking-wider uppercase"
      >
        ← Blog
      </Link>

      <header className="mt-8 mb-12">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
            {ROTULO_PILAR[post.pilar]}
          </span>
          {post.draft && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
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
        <p className="text-muted-foreground border-border mt-8 flex flex-wrap gap-x-6 gap-y-2 border-y py-4 font-mono text-sm">
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
        </p>
      </header>

      <div className="post prose prose-lg dark:prose-invert max-w-none">
        <Conteudo />
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
