import { linkWhatsApp } from "@/config/site";
import { IconeWhatsapp } from "@/components/layout/icones";

type Props = {
  mensagem: string;
  texto?: string;
  className?: string;
  /** Nome do evento medido no clique; sem ele, conta como "whatsapp_clique". */
  evento?: string;
};

// O CTA principal do site. A mensagem pré-preenchida diz de onde veio o contato.
export function BotaoWhatsApp({
  mensagem,
  texto = "Fale comigo no WhatsApp",
  className = "",
  evento,
}: Props) {
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      data-evento={evento}
      className={`bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${className}`}
    >
      <IconeWhatsapp width={18} height={18} />
      {texto}
    </a>
  );
}
