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

export function getPostsDoPilar(pilar: PostIndexado["pilar"]): PostIndexado[] {
  return getAllPosts().filter((p) => p.pilar === pilar);
}

// Até `limite` posts parecidos: cada tag em comum vale 2, o mesmo pilar vale 1.
// Empate fica com o mais recente (a lista já vem ordenada por data).
export function getRelacionados(
  post: PostIndexado,
  limite = 3,
): PostIndexado[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      pontos:
        2 * p.tags.filter((t) => post.tags.includes(t)).length +
        (p.pilar === post.pilar ? 1 : 0),
    }))
    .filter(({ pontos }) => pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite)
    .map(({ p }) => p);
}

// Posts agrupados por ano, do mais recente para o mais antigo.
export function agruparPorAno(
  posts: PostIndexado[],
): [ano: string, posts: PostIndexado[]][] {
  const grupos = new Map<string, PostIndexado[]>();
  for (const p of posts) {
    const ano = p.data.slice(0, 4);
    grupos.set(ano, [...(grupos.get(ano) ?? []), p]);
  }
  return [...grupos];
}
