// Roda depois do `next build` e falha se o HTML gerado tiver algum problema
// que o próprio build deixa passar em silêncio.
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { postsIndexados } from "../src/content/index.generated.ts";

const DIR_HTML = path.resolve(
  import.meta.dirname,
  "..",
  ".next",
  "server",
  "app",
);

const CHECAGENS = [
  {
    nome: "fórmula KaTeX inválida",
    // O rehype-katex desenha o erro em vermelho em vez de falhar.
    padrao: /class="katex-error"/,
  },
];

async function* arquivosHtml(dir: string): AsyncGenerator<string> {
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const caminho = path.join(dir, entrada.name);
    if (entrada.isDirectory()) yield* arquivosHtml(caminho);
    else if (entrada.name.endsWith(".html")) yield caminho;
  }
}

const problemas: string[] = [];
let total = 0;

for await (const arquivo of arquivosHtml(DIR_HTML)) {
  total++;
  const html = await readFile(arquivo, "utf8");
  for (const { nome, padrao } of CHECAGENS) {
    if (padrao.test(html))
      problemas.push(`${path.relative(DIR_HTML, arquivo)}: ${nome}`);
  }
}

// O sumário é calculado do MDX (scripts/gerar-indice-conteudo.ts) e os ids vêm do
// plugin rehype. Se os dois divergirem, o link do sumário não leva a lugar nenhum.
for (const post of postsIndexados) {
  const arquivo = path.join(DIR_HTML, "blog", `${post.slug}.html`);
  if (!existsSync(arquivo)) continue; // rascunho fora deste build
  const html = await readFile(arquivo, "utf8");
  for (const item of post.sumario) {
    if (!html.includes(`id="${item.id}"`))
      problemas.push(
        `blog/${post.slug}.html: o sumário aponta para #${item.id} ("${item.texto}"), que não existe na página`,
      );
  }
}

if (problemas.length > 0) {
  console.error(`\n✗ Build com problemas (${problemas.length}):\n`);
  for (const p of problemas) console.error(`  ${p}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ ${total} página(s) HTML verificada(s)`);
