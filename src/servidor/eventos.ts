import { getCloudflareContext } from "@opennextjs/cloudflare";
import { dev } from "@/servidor/protecao";

// Contagem agregada de três ações, no Workers Analytics Engine (binding EVENTOS
// no wrangler.jsonc): clique em "marcar o raio-x", clique para o WhatsApp e
// inscrição confirmada na newsletter. Passo 6.4 do motor comercial.
//
// Sem cookie e sem identificar ninguém: o ponto gravado é só o nome do evento,
// a página e a origem da campanha (utm_*). Nada de IP, navegador ou e-mail.

export const EVENTOS = [
  "raiox_clique",
  "whatsapp_clique",
  "newsletter_inscricao",
] as const;
export type Evento = (typeof EVENTOS)[number];

export type Origem = { source?: string; medium?: string; campaign?: string };

type Dataset = {
  writeDataPoint: (ponto: { blobs?: string[]; indexes?: string[] }) => void;
};

export function eventoValido(nome: unknown): nome is Evento {
  return (
    typeof nome === "string" && (EVENTOS as readonly string[]).includes(nome)
  );
}

// utm_* e caminho viram rótulo de agrupamento: só o que é curto e previsível.
const UTM = /^[a-z0-9_.-]{1,40}$/i;
export function limparUtm(valor: unknown): string {
  return typeof valor === "string" && UTM.test(valor)
    ? valor.toLowerCase()
    : "";
}
export function limparCaminho(valor: unknown): string {
  return typeof valor === "string" && /^\/[a-z0-9/_-]{0,120}$/i.test(valor)
    ? valor
    : "";
}

export function registrarEvento(
  nome: Evento,
  caminho = "",
  origem: Origem = {},
): void {
  let dataset: Dataset | undefined;
  try {
    const { env } = getCloudflareContext();
    dataset = (env as { EVENTOS?: Dataset }).EVENTOS;
  } catch {
    dataset = undefined;
  }
  if (!dataset) {
    // No `next dev` não há binding: mostra no log.
    if (dev) console.log("[evento]", nome, caminho, origem);
    return;
  }
  dataset.writeDataPoint({
    blobs: [
      nome,
      caminho,
      origem.source ?? "",
      origem.medium ?? "",
      origem.campaign ?? "",
    ],
    indexes: [nome],
  });
}
