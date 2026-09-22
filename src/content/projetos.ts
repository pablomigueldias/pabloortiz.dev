import { projetosIndexados } from "./index.generated";
import type { ProjetoIndexado } from "./schema";

const incluirRascunhos =
  process.env.NODE_ENV !== "production" ||
  process.env.INCLUIR_RASCUNHOS === "1";

export function getProjetos(): ProjetoIndexado[] {
  return projetosIndexados.filter((p) => !p.draft || incluirRascunhos);
}

export function getProjeto(slug: string): ProjetoIndexado | undefined {
  return getProjetos().find((p) => p.slug === slug);
}
