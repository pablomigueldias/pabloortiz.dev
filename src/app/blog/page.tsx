import Link from "next/link";
import { dataPorExtenso, ROTULO_PILAR } from "@/content/formatar";
import { getAllPosts } from "@/content/posts";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground text-4xl font-bold">Blog</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        IA aplicada, LLMs e dados: o que eu medi, o que errei e o que funcionou.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-12">
          Nenhum post publicado ainda.
        </p>
      ) : (
        <ul className="mt-12 flex flex-col gap-6">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group bg-card border-border hover:border-primary/50 block rounded-xl border p-6 transition-colors"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">
                    {ROTULO_PILAR[p.pilar]}
                  </span>
                  {p.draft && (
                    <span className="text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                      · Rascunho
                    </span>
                  )}
                </div>
                <h2 className="text-card-foreground group-hover:text-primary text-xl font-bold transition-colors">
                  {p.titulo}
                </h2>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {p.descricao}
                </p>
                <p className="text-muted-foreground mt-4 font-mono text-xs">
                  <time dateTime={p.data}>{dataPorExtenso(p.data)}</time> ·{" "}
                  {p.minutosDeLeitura} min
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
