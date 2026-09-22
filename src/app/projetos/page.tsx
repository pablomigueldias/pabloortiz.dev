import type { Metadata } from "next";
import Link from "next/link";
import { ROTULO_PILAR } from "@/content/formatar";
import { getProjetos } from "@/content/projetos";
import { projetosAnteriores } from "@/content/projetos-anteriores";

export const metadata: Metadata = {
  title: "Projetos · Pablo Ortiz",
  description:
    "Sistemas de IA e dados que eu construí, com o problema, as decisões e os números.",
};

export default function Projetos() {
  const projetos = getProjetos();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground text-4xl font-bold">Projetos</h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
        O que eu construí, com o problema, as decisões e os números. O código de
        todos é aberto.
      </p>

      <ul className="mt-12 flex flex-col gap-8">
        {projetos.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/projetos/${p.slug}`}
              className="group bg-card border-border hover:border-primary/50 block rounded-xl border p-6 transition-colors md:p-8"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-primary text-xs font-bold tracking-wider uppercase">
                  {ROTULO_PILAR[p.pilar]}
                </span>
                {p.destaque && (
                  <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-xs font-bold tracking-wider uppercase">
                    Em destaque
                  </span>
                )}
              </div>
              <h2 className="text-card-foreground group-hover:text-primary text-2xl font-bold transition-colors">
                {p.titulo}
              </h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {p.resumo}
              </p>
              {p.metricas.length > 0 && (
                <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {p.metricas.map((m) => (
                    <div key={m.rotulo}>
                      <dt className="text-muted-foreground text-xs">
                        {m.rotulo}
                      </dt>
                      <dd className="text-foreground order-first font-mono text-2xl font-bold">
                        {m.valor}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-foreground mt-20 text-2xl font-bold">
        Projetos anteriores
      </h2>
      <p className="text-muted-foreground mt-2">
        Projetos de estudo mais antigos. Ganham case completo quando forem
        revisados.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {projetosAnteriores.map((p) => (
          <li
            key={p.repo}
            className="border-border flex flex-col rounded-xl border p-5"
          >
            <span className="text-primary text-xs font-bold tracking-wider uppercase">
              {ROTULO_PILAR[p.pilar]}
            </span>
            <h3 className="text-foreground mt-2 font-bold">{p.nome}</h3>
            <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
              {p.descricao}
            </p>
            <p className="text-muted-foreground mt-4 font-mono text-xs">
              {p.stack.join(" · ")}
            </p>
            <a
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mt-3 text-sm font-semibold hover:underline"
            >
              Ver no GitHub →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
