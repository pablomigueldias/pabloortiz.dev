import Link from "next/link";
import { dataPorExtenso, ROTULO_PILAR } from "@/content/formatar";
import type { PostIndexado } from "@/content/schema";

export function CartaoPost({ post }: { post: PostIndexado }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-card border-border hover:border-primary/50 block rounded-xl border p-6 transition-colors"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-primary text-xs font-bold tracking-wider uppercase">
          {ROTULO_PILAR[post.pilar]}
        </span>
        {post.draft && (
          <span className="text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
            · Rascunho
          </span>
        )}
      </div>
      <h3 className="text-card-foreground group-hover:text-primary text-xl font-bold transition-colors">
        {post.titulo}
      </h3>
      <p className="text-muted-foreground mt-2 leading-relaxed">
        {post.descricao}
      </p>
      <p className="text-muted-foreground mt-4 font-mono text-xs">
        <time dateTime={post.data}>{dataPorExtenso(post.data)}</time> ·{" "}
        {post.minutosDeLeitura} min
      </p>
    </Link>
  );
}
