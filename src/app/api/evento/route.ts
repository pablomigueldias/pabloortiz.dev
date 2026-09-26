import {
  eventoValido,
  limparCaminho,
  limparUtm,
  registrarEvento,
} from "@/servidor/eventos";
import { dentroDoLimite, erro, ipDe, lerCorpo } from "@/servidor/protecao";

// Recebe os cliques que o navegador anuncia (navigator.sendBeacon, em
// src/components/layout/MedicaoCliques.tsx). A inscrição na newsletter não
// passa por aqui: ela é contada no servidor, na confirmação.
export async function POST(request: Request) {
  const corpo = await lerCorpo(request, 1_024);
  if ("resposta" in corpo) return corpo.resposta;

  if (!(await dentroDoLimite("LIMITE_EVENTOS", ipDe(request))))
    return new Response(null, { status: 204 });

  const b = (corpo.bruto ?? {}) as Record<string, unknown>;
  // A inscrição só conta quando confirmada, no servidor; aqui, só cliques.
  if (!eventoValido(b.nome) || b.nome === "newsletter_inscricao")
    return erro(400, "Evento inválido.");

  registrarEvento(b.nome, limparCaminho(b.caminho), {
    source: limparUtm(b.utm_source),
    medium: limparUtm(b.utm_medium),
    campaign: limparUtm(b.utm_campaign),
  });
  return new Response(null, { status: 204 });
}
