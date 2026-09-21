import { postsIndexados } from "./index.generated";
import type { PostIndexado } from "./schema";

// Rascunhos só aparecem no `next dev` ou com INCLUIR_RASCUNHOS=1 (CI e preview local).
// Atenção: "draft" não é segredo. O repositório é público, então rascunho que ainda
// não pode ser visto fica fora do repo (Second-Brain/Pessoal/Blog/, no .gitignore).
const incluirRascunhos =
  process.env.NODE_ENV !== "production" ||
  process.env.INCLUIR_RASCUNHOS === "1";

// Data de hoje em São Paulo, AAAA-MM-DD. Post com data futura fica agendado.
function hoje(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

function visivel(post: PostIndexado): boolean {
  if (post.draft && !incluirRascunhos) return false;
  if (post.data > hoje() && !incluirRascunhos) return false;
  return true;
}

export function getAllPosts(): PostIndexado[] {
  return postsIndexados.filter(visivel);
}

export function getPost(slug: string): PostIndexado | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
