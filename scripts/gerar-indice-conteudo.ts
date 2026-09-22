// Lê content/blog e content/projetos, valida o frontmatter e a privacidade, e grava
// src/content/index.generated.ts. Roda antes do dev e do build. Qualquer erro
// interrompe o build com a lista completa.
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import {
  frontmatterSchema,
  projetoSchema,
  SLUG,
  type ItemSumario,
  type PostIndexado,
  type ProjetoIndexado,
} from "../src/content/schema.ts";
import { slugAscii } from "../src/mdx/rehype-slug-ascii.mjs";
import { criarVerificador } from "./privacidade.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SAIDA = path.join(RAIZ, "src", "content", "index.generated.ts");
const PALAVRAS_POR_MINUTO = 200;

z.config(z.locales.ptBR());

const verificarPrivacidade = criarVerificador(RAIZ);
const erros: string[] = [];

function valorEm(obj: unknown, caminho: PropertyKey[]): unknown {
  return caminho.reduce<unknown>(
    (atual, chave) =>
      (atual as Record<PropertyKey, unknown> | undefined)?.[chave],
    obj,
  );
}

function separarFrontmatter(
  fonte: string,
): { yaml: string; corpo: string } | null {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(fonte);
  return m ? { yaml: m[1] ?? "", corpo: m[2] ?? "" } : null;
}

function minutosDeLeitura(corpo: string): number {
  const texto = corpo
    .replace(/```[\s\S]*?```/g, " ") // código não conta como leitura corrida
    .replace(/<[^>]+>/g, " ");
  const palavras = texto.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / PALAVRAS_POR_MINUTO));
}

// Sumário com os h2 e h3. Os ids repetem o que o src/mdx/rehype-slug-ascii.mjs gera
// no HTML: contam todos os headings, em ordem (o scripts/verificar-build.ts confere).
function sumario(corpo: string): ItemSumario[] {
  const usados = new Map<string, number>();
  const itens: ItemSumario[] = [];
  const semCodigo = corpo.replace(/^(```|~~~)[\s\S]*?^\1/gm, "");

  for (const [, hashes = "", bruto = ""] of semCodigo.matchAll(
    /^(#{1,6})[ \t]+(.+?)[ \t#]*$/gm,
  )) {
    const texto = bruto
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // [texto](url) → texto
      .replace(/[`*_~]/g, "")
      .replace(/\$([^$]*)\$/g, "$1")
      .trim();
    const base = slugAscii(texto) || "secao";
    const n = usados.get(base) ?? 0;
    usados.set(base, n + 1);
    const nivel = hashes.length;
    if (nivel === 2 || nivel === 3)
      itens.push({ nivel, texto, id: n === 0 ? base : `${base}-${n}` });
  }
  return itens;
}

// Valida todos os .mdx de uma pasta com o schema dado. Erros vão para `erros`.
async function processar<T extends z.ZodType>(
  pasta: string,
  schema: T,
): Promise<{ slug: string; dados: z.infer<T>; corpo: string }[]> {
  const dir = path.join(RAIZ, "content", pasta);
  if (!existsSync(dir)) return [];
  const itens: { slug: string; dados: z.infer<T>; corpo: string }[] = [];

  for (const arquivo of (await readdir(dir))
    .filter((a) => a.endsWith(".mdx"))
    .sort()) {
    const rel = `content/${pasta}/${arquivo}`;
    const slug = arquivo.replace(/\.mdx$/, "");
    if (!SLUG.test(slug)) {
      erros.push(
        `${rel}: nome do arquivo deve ser minúsculo, sem acento e com hífens`,
      );
      continue;
    }

    const fonte = await readFile(path.join(dir, arquivo), "utf8");
    const partes = separarFrontmatter(fonte);
    if (!partes) {
      erros.push(
        `${rel}: falta o frontmatter (bloco --- no início do arquivo)`,
      );
      continue;
    }

    const bruto: unknown = parse(partes.yaml) ?? {};

    const problemas = verificarPrivacidade(fonte, bruto);
    for (const p of problemas) erros.push(`${rel}: privacidade: ${p}`);
    if (problemas.length > 0) continue;

    const resultado = schema.safeParse(bruto);
    if (!resultado.success) {
      for (const issue of resultado.error.issues) {
        const campo = issue.path.join(".") || "(frontmatter)";
        const recebido =
          issue.code === "invalid_value"
            ? ` (recebido: ${JSON.stringify(valorEm(bruto, issue.path))})`
            : "";
        erros.push(`${rel}: "${campo}" ${issue.message}${recebido}`);
      }
      continue;
    }

    itens.push({ slug, dados: resultado.data, corpo: partes.corpo });
  }
  return itens;
}

const posts: PostIndexado[] = (await processar("blog", frontmatterSchema)).map(
  ({ slug, dados, corpo }) => ({
    ...dados,
    slug,
    minutosDeLeitura: minutosDeLeitura(corpo),
    sumario: sumario(corpo),
    temCTA: /<CTA[\s/>]/.test(corpo),
  }),
);
const projetos: ProjetoIndexado[] = (
  await processar("projetos", projetoSchema)
).map(({ slug, dados }) => ({ ...dados, slug }));

if (erros.length > 0) {
  console.error(`\n✗ Conteúdo inválido (${erros.length}):\n`);
  for (const e of erros) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}

const maisRecente = (
  a: { data: string; slug: string },
  b: { data: string; slug: string },
) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug);
posts.sort(maisRecente);
projetos.sort(
  (a, b) => Number(b.destaque) - Number(a.destaque) || maisRecente(a, b),
);

await writeFile(
  SAIDA,
  `// GERADO por scripts/gerar-indice-conteudo.ts. Não editar.\n` +
    `import type { PostIndexado, ProjetoIndexado } from "./schema";\n\n` +
    `export const postsIndexados: PostIndexado[] = ${JSON.stringify(posts, null, 2)};\n\n` +
    `export const projetosIndexados: ProjetoIndexado[] = ${JSON.stringify(projetos, null, 2)};\n`,
);

console.log(
  `✓ ${posts.length} post(s) e ${projetos.length} projeto(s) indexado(s) em src/content/index.generated.ts`,
);
