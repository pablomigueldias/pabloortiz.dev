// Regrava as imagens de public/ sem metadados (o sharp não copia EXIF/XMP/IPTC se não
// for pedido) e reduz as maiores que LARGURA_MAXIMA. Aplica a rotação do EXIF antes de
// descartá-lo, para a foto não ficar deitada.
// Uso: npm run limpar-imagens [-- arquivos...]
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAIZ = path.resolve(import.meta.dirname, "..");
const LARGURA_MAXIMA = 2000;
const FORMATOS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* imagens(dir: string): AsyncGenerator<string> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const caminho = path.join(dir, e.name);
    if (e.isDirectory()) yield* imagens(caminho);
    else if (FORMATOS.has(path.extname(e.name).toLowerCase())) yield caminho;
  }
}

const args = process.argv.slice(2);
const arquivos: string[] = [];
if (args.length > 0) arquivos.push(...args.map((a) => path.resolve(a)));
else for await (const a of imagens(path.join(RAIZ, "public"))) arquivos.push(a);

for (const arquivo of arquivos) {
  const ext = path.extname(arquivo).toLowerCase();
  const antes = await readFile(arquivo);
  let img = sharp(antes)
    .rotate()
    .resize({ width: LARGURA_MAXIMA, withoutEnlargement: true });
  // Sem o filtro adaptativo, o PNG regravado chegava a dobrar de tamanho.
  if (ext === ".png")
    img = img.png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 });
  else if (ext === ".webp") img = img.webp({ quality: 85 });
  else img = img.jpeg({ quality: 85, mozjpeg: true });
  const depois = await img.toBuffer();
  await writeFile(arquivo, depois);
  const kb = (n: number) => `${Math.round(n / 1024)} KB`;
  console.log(
    `✓ ${path.relative(RAIZ, arquivo)}: ${kb(antes.length)} → ${kb(depois.length)}`,
  );
  if (ext === ".png" && depois.length > 300 * 1024) {
    console.log(
      "  dica: foto em PNG pesa muito. Em WebP costuma ficar 10x menor.",
    );
  }
}
