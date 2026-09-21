import Link from "next/link";
import { linkWhatsApp } from "@/config/site";

// Provisória: a Home de verdade (posicionamento, prova, últimos posts) é da Etapa 5.
export default function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col justify-center px-4 py-24 md:px-8 lg:min-h-[80vh]">
      <p className="border-primary/30 bg-primary/10 text-primary mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
        <span aria-hidden className="bg-primary h-1.5 w-1.5 rounded-full" />
        Disponível para projetos
      </p>
      <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
        Olá, eu sou <span className="text-primary">Pablo Ortiz</span>
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
        Construo sistemas de IA que rodam todo dia: RAG, LLMs e pipelines de
        dados, medidos e testados.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/blog"
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Ler o blog
        </Link>
        <a
          href={linkWhatsApp("Olá, Pablo! Vim pelo seu site.")}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border text-foreground hover:border-primary rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
        >
          Fale comigo
        </a>
      </div>
    </section>
  );
}
