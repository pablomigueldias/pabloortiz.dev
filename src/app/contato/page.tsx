import { FormularioContato } from "@/components/contato/FormularioContato";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { site } from "@/config/site";
import { TURNSTILE_TESTE } from "@/contato/formulario";
import { metadataDaPagina } from "@/seo/metadata";

export const metadata = metadataDaPagina({
  titulo: "Contato",
  descricao: "Fale comigo pelo WhatsApp, e-mail, LinkedIn ou GitHub.",
  caminho: "/contato",
});

// Sem a site key real, produção não mostra o formulário (o envio falharia).
// No `next dev`, a chave de teste do Turnstile (sempre passa).
const siteKey =
  site.turnstileSiteKey ??
  (process.env.NODE_ENV === "development" ? TURNSTILE_TESTE.siteKey : null);

export default function Contato() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground text-4xl font-bold">Contato</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        Vaga, projeto ou uma dúvida sobre algo que eu escrevi. O caminho mais
        rápido é o WhatsApp.
      </p>

      <BotaoWhatsApp
        mensagem="Olá, Pablo! Vim pela página de contato."
        className="mt-10"
      />

      {siteKey && (
        <section aria-labelledby="escreva-aqui" className="mt-14">
          <h2
            id="escreva-aqui"
            className="text-foreground mb-6 text-2xl font-bold"
          >
            Ou escreva aqui
          </h2>
          <FormularioContato siteKey={siteKey} />
        </section>
      )}

      <ul className="mt-12 flex flex-col gap-4">
        {[
          {
            rotulo: "E-mail",
            href: `mailto:${site.email}`,
            detalhe: site.email,
          },
          {
            rotulo: "LinkedIn",
            href: site.linkedin,
            detalhe: "perfil profissional e currículo",
          },
          {
            rotulo: "GitHub",
            href: site.github,
            detalhe: "o código de todos os projetos",
          },
        ].map((c) => (
          <li key={c.rotulo}>
            <a
              href={c.href}
              {...(c.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="bg-card border-border hover:border-primary/50 flex items-center justify-between rounded-xl border p-5 transition-colors"
            >
              <span>
                <span className="text-foreground block font-bold">
                  {c.rotulo}
                </span>
                <span className="text-muted-foreground text-sm">
                  {c.detalhe}
                </span>
              </span>
              <span className="text-primary" aria-hidden>
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
