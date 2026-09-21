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
    <aside className="my-8 border px-4 py-4">
      <p>{texto}</p>
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
