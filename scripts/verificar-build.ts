// Roda depois do `next build` e falha se o HTML gerado tiver algum problema
// que o próprio build deixa passar em silêncio.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

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

if (problemas.length > 0) {
  console.error(`\n✗ Build com problemas (${problemas.length}):\n`);
  for (const p of problemas) console.error(`  ${p}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ ${total} página(s) HTML verificada(s)`);
