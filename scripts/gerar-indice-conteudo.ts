// Lê content/blog/*.mdx, valida o frontmatter e grava src/content/index.generated.ts.
// Roda antes do dev e do build. Qualquer erro interrompe o build com a lista completa.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import {
  frontmatterSchema,
  SLUG,
  type PostIndexado,
} from "../src/content/schema.ts";
import { criarVerificador } from "./privacidade.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const DIR_BLOG = path.join(RAIZ, "content", "blog");
const SAIDA = path.join(RAIZ, "src", "content", "index.generated.ts");
const PALAVRAS_POR_MINUTO = 200;

z.config(z.locales.ptBR());

const verificarPrivacidade = criarVerificador(RAIZ);

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

const arquivos = (await readdir(DIR_BLOG))
  .filter((a) => a.endsWith(".mdx"))
  .sort();
const erros: string[] = [];
const posts: PostIndexado[] = [];

for (const arquivo of arquivos) {
  const rel = `content/blog/${arquivo}`;
  const slug = arquivo.replace(/\.mdx$/, "");
  if (!SLUG.test(slug)) {
    erros.push(
      `${rel}: nome do arquivo deve ser minúsculo, sem acento e com hífens`,
    );
    continue;
  }

  const fonte = await readFile(path.join(DIR_BLOG, arquivo), "utf8");
  const partes = separarFrontmatter(fonte);
  if (!partes) {
    erros.push(`${rel}: falta o frontmatter (bloco --- no início do arquivo)`);
    continue;
  }

  const bruto: unknown = parse(partes.yaml) ?? {};

  const problemas = verificarPrivacidade(fonte, bruto);
  for (const p of problemas) erros.push(`${rel}: privacidade: ${p}`);
  if (problemas.length > 0) continue;
  const resultado = frontmatterSchema.safeParse(bruto);
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

  posts.push({
    ...resultado.data,
    slug,
    minutosDeLeitura: minutosDeLeitura(partes.corpo),
  });
}

if (erros.length > 0) {
  console.error(`\n✗ Conteúdo inválido (${erros.length}):\n`);
  for (const e of erros) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}

posts.sort(
  (a, b) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug),
);

await writeFile(
  SAIDA,
  `// GERADO por scripts/gerar-indice-conteudo.ts. Não editar.\n` +
    `import type { PostIndexado } from "./schema";\n\n` +
    `export const postsIndexados: PostIndexado[] = ${JSON.stringify(posts, null, 2)};\n`,
);

console.log(
  `✓ ${posts.length} post(s) indexado(s) em src/content/index.generated.ts`,
);
