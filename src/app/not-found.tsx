import Link from "next/link";

export default function NaoEncontrada() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col justify-center px-4 py-24 md:px-8 lg:min-h-[70vh]">
      <p className="text-primary font-mono text-sm font-bold">404</p>
      <h1 className="text-foreground mt-4 text-4xl font-bold">
        Esta página não existe
      </h1>
      <p className="text-muted-foreground mt-4 text-lg">
        O link pode estar errado ou o conteúdo mudou de lugar.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/blog"
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Ir para o blog
        </Link>
        <Link
          href="/"
          className="border-border text-foreground hover:border-primary rounded-xl border px-6 py-3 text-sm font-semibold"
        >
          Página inicial
        </Link>
      </div>
    </section>
  );
}
