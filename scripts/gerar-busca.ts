// Gera o índice de busca (Pagefind) a partir do HTML pré-renderizado de posts e
// cases. Roda no postbuild. O índice vai para public/pagefind/ (fora do git), e a
// OpenNext copia a public/ para os assets depois do next build.
import { existsSync } from "node:fs";
import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import * as pagefind from "pagefind";

const RAIZ = path.resolve(import.meta.dirname, "..");
const DIR_HTML = path.join(RAIZ, ".next", "server", "app");
const SAIDA = path.join(RAIZ, "public", "pagefind");

// Só estas seções entram na busca: o resto do site já está a um clique no menu.
const SECOES = ["blog", "projetos"];

async function falhar(mensagem: string): Promise<never> {
  console.error(`\n✗ Busca: ${mensagem}\n`);
  await pagefind.close();
  process.exit(1);
}

await rm(SAIDA, { recursive: true, force: true });

const { index, errors } = await pagefind.createIndex();
if (!index) await falhar(errors.join("; "));

let total = 0;
for (const secao of SECOES) {
  const dir = path.join(DIR_HTML, secao);
  if (!existsSync(dir)) continue;
  // Só o primeiro nível (blog/<slug>.html). Categorias e afins não são conteúdo.
  for (const arquivo of await readdir(dir)) {
    if (!arquivo.endsWith(".html")) continue;
    const resposta = await index!.addHTMLFile({
      url: `/${secao}/${arquivo.replace(/\.html$/, "")}`,
      content: await readFile(path.join(dir, arquivo), "utf8"),
    });
    if (resposta.errors.length > 0)
      await falhar(`${secao}/${arquivo}: ${resposta.errors.join("; ")}`);
    total++;
  }
}

const escrita = await index!.writeFiles({ outputPath: SAIDA });
if (escrita.errors.length > 0) await falhar(escrita.errors.join("; "));
await pagefind.close();

console.log(`✓ ${total} página(s) no índice de busca (public/pagefind)`);
