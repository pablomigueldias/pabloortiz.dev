import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/content/posts";

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Conteudo } = (await import(`@content/blog/${slug}.mdx`)) as {
    default: React.ComponentType;
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      {post.draft && <p>[rascunho]</p>}
      <p>
        <time dateTime={post.data}>{post.data}</time> · {post.minutosDeLeitura}{" "}
        min de leitura
      </p>
      <Conteudo />
    </article>
  );
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
