// Falha se alguma imagem tiver metadados (EXIF, XMP, IPTC, comentários): GPS da foto,
// modelo do celular, conta do Canva... Lê os blocos do arquivo direto, sem biblioteca.
// Uso: node scripts/verificar-imagens.ts [arquivos...]   (sem argumentos: todo o public/)
// Para limpar: npm run limpar-imagens
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const IGNORAR = new Set(["favicon.ico"]);

function jpeg(b: Buffer): string[] {
  const achados: string[] = [];
  let i = 2; // depois do SOI (FFD8)
  while (i + 4 <= b.length && b[i] === 0xff) {
    const marcador = b[i + 1]!;
    if (marcador === 0xda || marcador === 0xd9) break; // início dos dados / fim
    const tamanho = b.readUInt16BE(i + 2);
    const inicio = b.subarray(i + 4, i + 4 + 40).toString("latin1");
    if (marcador === 0xe1 && inicio.startsWith("Exif")) achados.push("EXIF");
    if (marcador === 0xe1 && inicio.includes("ns.adobe.com/xap"))
      achados.push("XMP");
    if (marcador === 0xed) achados.push("IPTC/Photoshop");
    if (marcador === 0xfe) achados.push("comentário");
    i += 2 + tamanho;
  }
  return achados;
}

function png(b: Buffer): string[] {
  const achados: string[] = [];
  const PROIBIDOS: Record<string, string> = {
    eXIf: "EXIF",
    tEXt: "texto",
    iTXt: "texto/XMP",
    zTXt: "texto",
  };
  let i = 8;
  while (i + 8 <= b.length) {
    const tamanho = b.readUInt32BE(i);
    const tipo = b.subarray(i + 4, i + 8).toString("latin1");
    if (PROIBIDOS[tipo]) achados.push(PROIBIDOS[tipo]);
    if (tipo === "IEND") break;
    i += 12 + tamanho;
  }
  return achados;
}

function webp(b: Buffer): string[] {
  const achados: string[] = [];
  let i = 12; // depois de "RIFF" + tamanho + "WEBP"
  while (i + 8 <= b.length) {
    const tipo = b.subarray(i, i + 4).toString("latin1");
    const tamanho = b.readUInt32LE(i + 4);
    if (tipo === "EXIF") achados.push("EXIF");
    if (tipo === "XMP ") achados.push("XMP");
    i += 8 + tamanho + (tamanho % 2);
  }
  return achados;
}

function svg(b: Buffer): string[] {
  const texto = b.toString("utf8");
  const achados: string[] = [];
  if (/<metadata[\s>]/i.test(texto)) achados.push("<metadata>");
  if (/(?:sodipodi:docname|inkscape:export-filename)/i.test(texto))
    achados.push("nome/caminho do arquivo do editor");
  return achados;
}

const LEITORES: Record<string, (b: Buffer) => string[]> = {
  ".jpg": jpeg,
  ".jpeg": jpeg,
  ".png": png,
  ".webp": webp,
  ".svg": svg,
};

async function* imagens(dir: string): AsyncGenerator<string> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const caminho = path.join(dir, e.name);
    if (e.isDirectory()) yield* imagens(caminho);
    else yield caminho;
  }
}

const args = process.argv.slice(2);
const arquivos: string[] = [];
if (args.length > 0) arquivos.push(...args.map((a) => path.resolve(a)));
else for await (const a of imagens(path.join(RAIZ, "public"))) arquivos.push(a);

const problemas: string[] = [];
let verificadas = 0;

for (const arquivo of arquivos) {
  const nome = path.basename(arquivo);
  if (IGNORAR.has(nome) || nome.startsWith(".") || nome === "_headers")
    continue;
  const rel = path.relative(RAIZ, arquivo);
  const leitor = LEITORES[path.extname(arquivo).toLowerCase()];
  if (!leitor) {
    problemas.push(
      `${rel}: formato não verificado (converta para WebP, PNG, JPEG ou SVG)`,
    );
    continue;
  }
  verificadas++;
  const achados = leitor(await readFile(arquivo));
  if (achados.length > 0) {
    problemas.push(`${rel}: metadados (${[...new Set(achados)].join(", ")})`);
  }
}

if (problemas.length > 0) {
  console.error(`\n✗ Imagens com problema (${problemas.length}):\n`);
  for (const p of problemas) console.error(`  ${p}`);
  console.error(`\n  Para limpar: npm run limpar-imagens\n`);
  process.exit(1);
}

console.log(`✓ ${verificadas} imagem(ns) sem metadados`);
