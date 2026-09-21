import Link from "next/link";
import { getAllPosts } from "@/content/posts";

// Listagem mínima e sem estilo: o visual vem nas Etapas 2 e 6.
export default function Blog() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>Nenhum post publicado ainda.</p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`}>{p.titulo}</Link>
              {p.draft && " [rascunho]"} ·{" "}
              <time dateTime={p.data}>{p.data}</time>
              <p>{p.descricao}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
