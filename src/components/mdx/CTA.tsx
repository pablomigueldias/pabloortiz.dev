import { linkWhatsApp } from "@/config/site";

type Props = {
  /** Assunto do post, entra na mensagem pré-preenchida do WhatsApp. */
  assunto: string;
  texto?: string;
};

// CTA contextual do post (um só por post). A mensagem pré-preenchida diz de onde
// veio o contato, sem cookie nem rastreador.
export function CTA({
  assunto,
  texto = "Precisa disso no seu time ou projeto?",
}: Props) {
  return (
    <aside className="not-prose border-primary/30 bg-primary/5 my-10 flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-foreground font-semibold">{texto}</p>
      <a
        href={linkWhatsApp(`Olá, Pablo! Vi seu post sobre ${assunto}.`)}
        rel="noopener noreferrer"
        target="_blank"
      >
        Me chama no WhatsApp
      </a>
    </aside>
  );
}
