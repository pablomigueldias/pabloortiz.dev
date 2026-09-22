import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROTULO_PILAR } from "@/content/formatar";
import { getProjeto, getProjetos } from "@/content/projetos";

export async function generateMetadata({
  params,
}: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const projeto = getProjeto((await params).slug);
  return projeto
    ? { title: `${projeto.titulo} · Pablo Ortiz`, description: projeto.resumo }
    : {};
}

export default async function Projeto({
  params,
}: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const projeto = getProjeto(slug);
  if (!projeto) notFound();

  const { default: Conteudo } = (await import(
    `@content/projetos/${slug}.mdx`
  )) as {
    default: React.ComponentType;
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <Link
        href="/projetos"
        className="text-muted-foreground hover:text-primary text-sm font-medium tracking-wider uppercase"
      >
        ← Projetos
      </Link>

      <header className="mt-8 mb-12">
        <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
          {ROTULO_PILAR[projeto.pilar]}
        </span>
        <h1 className="text-foreground mt-6 text-3xl leading-tight font-bold md:text-5xl">
          {projeto.titulo}
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
          {projeto.resumo}
        </p>

        {projeto.metricas.length > 0 && (
          <dl className="border-border mt-8 grid grid-cols-2 gap-6 border-y py-6 sm:grid-cols-4">
            {projeto.metricas.map((m) => (
              <div key={m.rotulo} className="flex flex-col">
                <dt className="text-muted-foreground text-xs">{m.rotulo}</dt>
                <dd className="text-primary order-first font-mono text-2xl font-bold">
                  {m.valor}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {projeto.stack.map((s) => (
            <span
              key={s}
              className="bg-muted text-muted-foreground border-border rounded-md border px-2 py-0.5 font-mono text-xs"
            >
              {s}
            </span>
          ))}
        </div>
        <a
          href={projeto.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary mt-6 inline-block text-sm font-semibold hover:underline"
        >
          Código no GitHub →
        </a>
      </header>

      <div className="post prose prose-lg dark:prose-invert max-w-none">
        <Conteudo />
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return getProjetos().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
