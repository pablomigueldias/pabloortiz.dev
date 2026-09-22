// Linter de privacidade do conteúdo (Etapa 4). O repo é público: o que passar daqui
// é publicado para sempre. Complementa o gitleaks (segredos, telefone, e-mail, CPF,
// caminho local), com o que é específico de post.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// Pastas do vault que nunca viram post (§10.3 C do plano).
const PASTAS_BLOQUEADAS = [
  "Curriculos",
  "Certificados",
  "Concurso",
  "Planos",
  "Provas",
  "Livros",
  "_inbox",
];

const REGRAS: { nome: string; padrao: RegExp; dica: string }[] = [
  {
    nome: "IP de rede interna",
    padrao:
      /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g,
    dica: "use um IP de documentação, como 192.0.2.10 (RFC 5737)",
  },
  {
    nome: "wikilink do Obsidian",
    padrao: /!?\[\[[^\]\n]+\]\]/g,
    dica: "nota colada sem revisão? troque por link normal ou texto",
  },
  {
    nome: "marca de tempo de transcrição",
    padrao: /⏱\s*\d{1,2}:\d{2}/g,
    dica: "transcrição não sai crua: reescreva o trecho",
  },
];

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Denylist pessoal: arquivo local (fora do git) ou secret do CI. Uma linha por termo.
function carregarDenylist(raiz: string): string[] {
  const arquivo = path.join(raiz, "privacidade.denylist.txt");
  const bruto =
    process.env.PRIVACIDADE_DENYLIST ??
    (existsSync(arquivo) ? readFileSync(arquivo, "utf8") : "");
  return bruto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map(normalizar);
}

function linhaDe(fonte: string, indice: number): number {
  return fonte.slice(0, indice).split("\n").length;
}

export function criarVerificador(raiz: string) {
  const denylist = carregarDenylist(raiz);

  return function verificar(fonte: string, frontmatter: unknown): string[] {
    const problemas: string[] = [];

    for (const { nome, padrao, dica } of REGRAS) {
      for (const m of fonte.matchAll(padrao)) {
        problemas.push(`linha ${linhaDe(fonte, m.index)}: ${nome} (${dica})`);
      }
    }

    // O termo nunca aparece na mensagem: o log do CI é público.
    const texto = normalizar(fonte);
    denylist.forEach((termo, i) => {
      const indice = texto.indexOf(termo);
      if (indice >= 0) {
        problemas.push(
          `linha ${linhaDe(texto, indice)}: termo nº ${i + 1} da denylist de privacidade`,
        );
      }
    });

    const origem = (frontmatter as { origem?: { vault?: unknown }[] } | null)
      ?.origem;
    for (const item of Array.isArray(origem) ? origem : []) {
      const vault = typeof item?.vault === "string" ? item.vault : "";
      const pasta = PASTAS_BLOQUEADAS.find((p) =>
        vault.split("/").some((parte) => normalizar(parte) === normalizar(p)),
      );
      if (pasta) {
        problemas.push(
          `"origem": a pasta "${pasta}" do vault nunca vira post (dado pessoal ou de terceiros)`,
        );
      }
    }

    return problemas;
  };
}
