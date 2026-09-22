import type { Metadata } from "next";
import Link from "next/link";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { site } from "@/config/site";
import { dataPorExtenso, ROTULO_PILAR } from "@/content/formatar";
import { perfil } from "@/content/perfil";
import { getAllPosts } from "@/content/posts";
import { getProjetos } from "@/content/projetos";
import { JsonLd } from "@/seo/JsonLd";
import { metadataDaPagina } from "@/seo/metadata";
import { pessoa, siteWeb } from "@/seo/schema-org";

const TITULO_HOME = `${site.nome} · ${perfil.titulo}`;

const base = metadataDaPagina({
  titulo: perfil.titulo,
  descricao: perfil.frase,
  caminho: "/",
});
export const metadata: Metadata = {
  ...base,
  title: { absolute: TITULO_HOME },
  openGraph: { ...base.openGraph, title: TITULO_HOME },
  twitter: { ...base.twitter, title: TITULO_HOME },
};

export default function Home() {
  const destaque = getProjetos().find((p) => p.destaque);
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-8">
      <JsonLd dados={{ "@graph": [siteWeb(), pessoa()] }} />
      <section className="flex flex-col justify-center py-20 lg:min-h-[70vh]">
        <p className="border-primary/30 bg-primary/10 text-primary mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
          <span aria-hidden className="bg-primary h-1.5 w-1.5 rounded-full" />
          Disponível para projetos e vagas
        </p>
        <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
          Olá, eu sou <span className="text-primary">{perfil.nome}</span>
        </h1>
        <p className="text-foreground mt-6 max-w-2xl text-xl leading-relaxed">
          {perfil.frase}
        </p>
        <p className="text-muted-foreground mt-4 max-w-2xl">{perfil.titulo}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <BotaoWhatsApp mensagem="Olá, Pablo! Vim pelo seu site." />
          <Link
            href="/projetos"
            className="border-border text-foreground hover:border-primary rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
          >
            Ver projetos
          </Link>
        </div>
      </section>

      {destaque && (
        <section className="border-border border-t py-16">
          <h2 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
            Projeto em destaque
          </h2>
          <Link
            href={`/projetos/${destaque.slug}`}
            className="group mt-6 block"
          >
            <p className="text-foreground group-hover:text-primary text-3xl font-bold transition-colors">
              {destaque.titulo} →
            </p>
            <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
              {destaque.resumo}
            </p>
          </Link>
          <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {destaque.metricas.map((m) => (
              <div
                key={m.rotulo}
                className="bg-card border-border flex flex-col rounded-xl border p-4"
              >
                <dt className="text-muted-foreground text-xs">{m.rotulo}</dt>
                <dd className="text-primary order-first font-mono text-2xl font-bold">
                  {m.valor}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="border-border border-t py-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
            Últimos posts
          </h2>
          <Link
            href="/blog"
            className="text-primary text-sm font-semibold hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground mt-6">
            Os primeiros posts saem em breve.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-4">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group bg-card border-border hover:border-primary/50 block rounded-xl border p-5 transition-colors"
                >
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">
                    {ROTULO_PILAR[p.pilar]}
                  </span>
                  <p className="text-card-foreground group-hover:text-primary mt-2 text-lg font-bold transition-colors">
                    {p.titulo}
                  </p>
                  <p className="text-muted-foreground mt-2 font-mono text-xs">
                    <time dateTime={p.data}>{dataPorExtenso(p.data)}</time> ·{" "}
                    {p.minutosDeLeitura} min
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-border border-t py-16">
        <h2 className="text-foreground text-2xl font-bold">Vamos conversar?</h2>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Vaga, projeto ou uma dúvida sobre algo que eu escrevi: me chama no
          WhatsApp.
        </p>
        <BotaoWhatsApp
          mensagem="Olá, Pablo! Vim pelo seu site."
          className="mt-6"
        />
      </section>
    </div>
  );
}
