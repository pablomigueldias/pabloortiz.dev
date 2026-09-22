import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArquivoPosts } from "@/components/blog/ArquivoPosts";
import { DESCRICAO_PILAR, ROTULO_PILAR } from "@/content/formatar";
import { getPostsDoPilar } from "@/content/posts";
import { PILARES, type PostIndexado } from "@/content/schema";

function pilarValido(p: string): p is PostIndexado["pilar"] {
  return (PILARES as readonly string[]).includes(p);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/categoria/[pilar]">): Promise<Metadata> {
  const { pilar } = await params;
  return pilarValido(pilar)
    ? {
        title: `${ROTULO_PILAR[pilar]} · Blog · Pablo Ortiz`,
        description: DESCRICAO_PILAR[pilar],
      }
    : {};
}

export default async function Categoria({
  params,
}: PageProps<"/blog/categoria/[pilar]">) {
  const { pilar } = await params;
  if (!pilarValido(pilar)) notFound();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-primary text-sm font-medium tracking-wider uppercase"
      >
        ← Blog
      </Link>
      <h1 className="text-foreground mt-8 text-4xl font-bold">
        {ROTULO_PILAR[pilar]}
      </h1>
      <p className="text-muted-foreground mt-4 text-lg">
        {DESCRICAO_PILAR[pilar]}
      </p>
      <ArquivoPosts posts={getPostsDoPilar(pilar)} pilar={pilar} />
    </section>
  );
}

export function generateStaticParams() {
  return PILARES.map((pilar) => ({ pilar }));
}

export const dynamicParams = false;
