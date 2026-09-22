// Mede o Worker que vai para a Cloudflare e falha se passar do teto. O plano grátis
// aceita 3 MiB (3.072 KiB) comprimido, e o deploy só quebra na hora de publicar.
// Duas vezes uma dependência (next/og, Zod) passou do limite sem ninguém ver.
// Uso: depois de `opennextjs-cloudflare build`.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Folga abaixo do limite real, para o aviso chegar antes do problema.
const TETO_KIB = 3000;
const LIMITE_KIB = 3072;

const saida = mkdtempSync(path.join(tmpdir(), "worker-"));
let log: string;
try {
  log = execFileSync(
    "npx",
    ["wrangler", "deploy", "--dry-run", "--outdir", saida],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
} finally {
  rmSync(saida, { recursive: true, force: true });
}

const m = /gzip:\s*([\d.]+)\s*KiB/.exec(log);
if (!m?.[1]) {
  console.error("✗ Não achei o tamanho no resultado do wrangler:\n" + log);
  process.exit(1);
}
const kib = Number(m[1]);
const resumo = `${kib.toFixed(0)} KiB de ${LIMITE_KIB} (teto do CI: ${TETO_KIB})`;

if (kib > TETO_KIB) {
  console.error(`\n✗ Worker grande demais: ${resumo}.`);
  console.error(
    "  Procure dependência nova no servidor. Página que importa valor de\n" +
      "  src/content/schema.ts leva o Zod junto (ver o README, seção Deploy).\n",
  );
  process.exit(1);
}
console.log(`✓ Worker: ${resumo}`);
