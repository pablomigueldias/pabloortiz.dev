import { ConfirmarInscricao } from "@/components/newsletter/ConfirmarInscricao";
import { site } from "@/config/site";
import { metadataDaPagina } from "@/seo/metadata";

// Fora do Google: é uma página de passagem, só faz sentido com o link do e-mail.
export const metadata = metadataDaPagina({
  titulo: "Confirmar inscrição",
  descricao: `Confirme a inscrição na newsletter "${site.newsletter.nome}".`,
  caminho: "/newsletter/confirmar",
  rascunho: true,
});

export default function Confirmar() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground mb-6 text-4xl font-bold">
        Confirmar inscrição
      </h1>
      <ConfirmarInscricao />
    </section>
  );
}
