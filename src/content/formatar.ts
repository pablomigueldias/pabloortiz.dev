import type { Frontmatter } from "./schema";

export const ROTULO_PILAR: Record<Frontmatter["pilar"], string> = {
  "ia-llms": "IA aplicada & LLMs",
  "dados-ml": "Dados, Análise & ML",
};

// "2026-09-21" → "21 de setembro de 2026". UTC para a data não "voltar um dia".
export function dataPorExtenso(data: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}
