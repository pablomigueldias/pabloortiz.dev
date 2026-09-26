import type { Frontmatter } from "./schema";

export const ROTULO_PILAR: Record<Frontmatter["pilar"], string> = {
  "ia-llms": "IA aplicada & LLMs",
  "dados-ml": "Dados, Análise & ML",
  "automacao-negocio": "Automação para negócios",
};

// "2026-09-21" → "21 de setembro de 2026". UTC para a data não "voltar um dia".
export function dataPorExtenso(data: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}

export const DESCRICAO_PILAR: Record<Frontmatter["pilar"], string> = {
  "ia-llms":
    "RAG, LLMs locais e por API, agentes e avaliação: sistemas de IA que rodam todo dia, com o que eu medi.",
  "dados-ml":
    "Pipelines de dados, SQL, análise e machine learning, do dado bruto ao modelo em uso.",
  "automacao-negocio":
    "Para quem vive de agenda: atendimento no WhatsApp, lembrete, CRM e o que dá para automatizar sem perder o cliente, com número e sem jargão.",
};
