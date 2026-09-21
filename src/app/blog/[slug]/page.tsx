// Prova de conceito (3.1). A lista de slugs vem do índice gerado no 3.3.
const slugs = ["exemplo-recursos"];

type Frontmatter = { titulo: string; descricao: string };

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { default: Conteudo, frontmatter } = (await import(
    `@content/blog/${slug}.mdx`
  )) as {
    default: React.ComponentType;
    frontmatter: Frontmatter;
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <p data-teste="frontmatter">{frontmatter.descricao}</p>
      <Conteudo />
    </article>
  );
}

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
