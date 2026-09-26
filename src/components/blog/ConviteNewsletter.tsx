import Link from "next/link";
import { site } from "@/config/site";

// O convite da newsletter no fim dos posts do pilar de negócio. Só nesse pilar:
// a newsletter fala com o dono de clínica (D5), e no fim de um post sobre RAG
// ela seria um convite para o leitor errado.
export function ConviteNewsletter() {
  return (
    <aside
      data-pagefind-ignore
      className="not-prose border-border mt-10 rounded-xl border p-6"
    >
      <p className="text-primary font-mono text-xs tracking-wider uppercase">
        Newsletter
      </p>
      <p className="text-foreground mt-2 font-semibold">
        {site.newsletter.nome}
      </p>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        {site.newsletter.promessa}
      </p>
      <Link
        href="/newsletter"
        className="text-primary mt-3 inline-block text-sm font-semibold hover:underline"
      >
        Quero receber →
      </Link>
    </aside>
  );
}
