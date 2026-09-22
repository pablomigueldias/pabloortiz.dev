import Link from "next/link";
import { ROTULO_PILAR } from "@/content/formatar";
import { agruparPorAno, getAllPosts } from "@/content/posts";
import { PILARES } from "@/content/pilares";
import type { PostIndexado } from "@/content/schema";
import { CartaoPost } from "./CartaoPost";

type Props = {
  posts: PostIndexado[];
  /** Pilar da página atual. Sem ele, o filtro marca "Todos". */
  pilar?: PostIndexado["pilar"];
};

// Filtro por pilar (links para /blog/categoria/…, sem JS) e os posts agrupados por ano.
export function ArquivoPosts({ posts, pilar }: Props) {
  const todos = getAllPosts();
  const filtros = [
    { href: "/blog", rotulo: "Todos", total: todos.length, ativo: !pilar },
    ...PILARES.map((p) => ({
      href: `/blog/categoria/${p}`,
      rotulo: ROTULO_PILAR[p],
      total: todos.filter((post) => post.pilar === p).length,
      ativo: p === pilar,
    })),
  ];

  return (
    <>
      <nav aria-label="Filtrar por categoria" className="mt-10">
        <ul className="flex flex-wrap gap-2">
          {filtros.map((f) => (
            <li key={f.href}>
              <Link
                href={f.href}
                aria-current={f.ativo ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  f.ativo
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {f.rotulo}
                <span className="font-mono text-xs opacity-75">{f.total}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-12">
          Nenhum post publicado aqui ainda.
        </p>
      ) : (
        agruparPorAno(posts).map(([ano, doAno]) => (
          <section key={ano} aria-labelledby={`ano-${ano}`} className="mt-12">
            <h2
              id={`ano-${ano}`}
              className="text-muted-foreground mb-4 font-mono text-sm font-bold"
            >
              {ano}
            </h2>
            <ul className="flex flex-col gap-6">
              {doAno.map((p) => (
                <li key={p.slug}>
                  <CartaoPost post={p} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
