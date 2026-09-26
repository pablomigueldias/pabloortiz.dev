import { FormularioNewsletter } from "@/components/newsletter/FormularioNewsletter";
import { site } from "@/config/site";
import { TURNSTILE_TESTE } from "@/contato/formulario";
import { metadataDaPagina } from "@/seo/metadata";

const { nome, promessa } = site.newsletter;

export const metadata = metadataDaPagina({
  titulo: nome,
  descricao: promessa,
  caminho: "/newsletter",
});

// Mesma regra de /contato: sem a site key real, produção não mostra o formulário.
const siteKey =
  site.turnstileSiteKey ??
  (process.env.NODE_ENV === "development" ? TURNSTILE_TESTE.siteKey : null);

export default function Newsletter() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <p className="text-primary font-mono text-sm">Newsletter</p>
      <h1 className="text-foreground mt-2 text-4xl font-bold">{nome}</h1>
      <p className="text-muted-foreground mt-4 text-lg">{promessa}</p>

      <ul className="text-muted-foreground mt-8 flex flex-col gap-2">
        <li>Uma automação para copiar, que você faz sozinho, no mesmo dia.</li>
        <li>O post da quinzena, em duas frases.</li>
        <li>
          Um bastidor: o que eu testei, com número, inclusive o que deu errado.
        </li>
      </ul>
      <p className="text-muted-foreground mt-4">
        Leitura de 3 minutos. Sem promoção, sem preço.
      </p>

      <div className="mt-10">
        {siteKey ? (
          <FormularioNewsletter siteKey={siteKey} />
        ) : (
          <p className="text-muted-foreground">
            As inscrições abrem em breve. Enquanto isso, escreva para{" "}
            <a
              href={`mailto:${site.email}`}
              className="hover:text-primary underline"
            >
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
