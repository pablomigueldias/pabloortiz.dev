import type { Metadata } from "next";
import { ArquivoPosts } from "@/components/blog/ArquivoPosts";
import { Busca } from "@/components/blog/Busca";
import { getAllPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog · Pablo Ortiz",
  description:
    "IA aplicada, LLMs e dados: o que eu medi, o que errei e o que funcionou.",
};

export default function Blog() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground text-4xl font-bold">Blog</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        IA aplicada, LLMs e dados: o que eu medi, o que errei e o que funcionou.
      </p>
      <Busca />
      <ArquivoPosts posts={getAllPosts()} />
    </section>
  );
}
