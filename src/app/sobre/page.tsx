import type { Metadata } from "next";
import { site } from "@/config/site";
import { perfil } from "@/content/perfil";

export const metadata: Metadata = {
  title: "Sobre · Pablo Ortiz",
  description: perfil.resumo,
};

export default function Sobre() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground text-4xl font-bold">Sobre</h1>
      <p className="text-primary mt-4 font-semibold">{perfil.titulo}</p>
      <p className="text-foreground mt-6 text-lg leading-relaxed">
        {perfil.resumo}
      </p>
      <p className="text-muted-foreground mt-4">{perfil.cidade}</p>

      <h2 className="text-foreground mt-16 text-2xl font-bold">
        Especialidades
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {perfil.especialidades.map((e) => (
          <div
            key={e.area}
            className="bg-card border-border rounded-xl border p-5"
          >
            <h3 className="text-primary text-sm font-bold tracking-wider uppercase">
              {e.area}
            </h3>
            <ul className="text-muted-foreground mt-3 flex flex-col gap-1.5 text-sm">
              {e.itens.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-foreground mt-16 text-2xl font-bold">Experiência</h2>
      <ol className="border-border mt-6 flex flex-col gap-8 border-l pl-6">
        {perfil.experiencias.map((x) => (
          <li key={x.cargo} className="relative">
            <span
              aria-hidden
              className="bg-primary absolute top-2 -left-[29px] h-2 w-2 rounded-full"
            />
            <p className="text-muted-foreground font-mono text-xs">
              {x.periodo}
            </p>
            <h3 className="text-foreground mt-1 font-bold">
              {x.cargo} ·{" "}
              <span className="text-muted-foreground font-normal">
                {x.empresa}
              </span>
            </h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {x.resumo}
            </p>
          </li>
        ))}
      </ol>

      <h2 className="text-foreground mt-16 text-2xl font-bold">Formação</h2>
      {perfil.formacao.map((f) => (
        <div key={f.curso} className="mt-6">
          <p className="text-foreground font-bold">{f.curso}</p>
          <p className="text-muted-foreground">
            {f.instituicao} ·{" "}
            <span className="font-mono text-sm">{f.periodo}</span>
          </p>
        </div>
      ))}

      <h2 className="text-foreground mt-16 text-2xl font-bold">
        Certificações
      </h2>
      <ul className="mt-6 flex flex-col gap-3">
        {perfil.certificacoes.map((c) => (
          <li
            key={c.nome}
            className="border-border flex flex-wrap justify-between gap-2 border-b pb-3"
          >
            <span className="text-foreground">{c.nome}</span>
            <span className="text-muted-foreground font-mono text-sm">
              {c.emissor} · {c.carga}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-4 text-sm">
        Lista completa no LinkedIn.
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Ver currículo no LinkedIn
        </a>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border text-foreground hover:border-primary rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
