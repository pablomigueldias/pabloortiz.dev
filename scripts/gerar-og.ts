// Gera as imagens de compartilhamento (LinkedIn, WhatsApp, X) em public/og/, fora
// do git. Roda no postbuild, em Node: com rotas opengraph-image, o WebAssembly do
// next/og ia junto no Worker (+970 KiB, acima do limite do plano grátis).
// Só gera imagem de página que existe neste build: rascunho não vaza pelo título.
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og.js";
import { createElement as h, type CSSProperties, type ReactNode } from "react";
import { site } from "../src/config/site.ts";
import { dataPorExtenso, ROTULO_PILAR } from "../src/content/formatar.ts";
import {
  postsIndexados,
  projetosIndexados,
} from "../src/content/index.generated.ts";
import { perfil } from "../src/content/perfil.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const DIR_HTML = path.join(RAIZ, ".next", "server", "app");
const SAIDA = path.join(RAIZ, "public", "og");
const TAMANHO = { width: 1200, height: 630 };

// Inter (licença OFL) do @fontsource. O next/og aceita woff, não woff2.
const fonte = (peso: 400 | 700) =>
  readFile(
    path.join(
      RAIZ,
      "node_modules/@fontsource/inter/files",
      `inter-latin-${peso}-normal.woff`,
    ),
  );
const [inter400, inter700] = await Promise.all([fonte(400), fonte(700)]);

// Cores do tema escuro (globals.css).
const COR = {
  fundo: "#09090b",
  texto: "#fafafa",
  suave: "#a1a1aa",
  verde: "#10b981",
};

type Cartao = {
  /** Linha pequena acima do título (pilar, "Case", cargo). */
  rotulo: string;
  titulo: string;
  /** Texto menor logo abaixo do título (o resumo de um case). */
  subtitulo?: string;
  /** Linha de baixo (data e tempo de leitura, stack...). */
  detalhe?: string;
};

const div = (style: CSSProperties, ...filhos: ReactNode[]) =>
  h("div", { style: { display: "flex", ...style } }, ...filhos);

async function gerar(arquivo: string, c: Cartao) {
  const tamanhoTitulo =
    c.titulo.length > 60 ? 56 : c.titulo.length > 35 ? 66 : 76;

  const imagem = new ImageResponse(
    div(
      {
        width: "100%",
        height: "100%",
        background: COR.fundo,
        fontFamily: "Inter",
      },
      div({ width: 16, height: "100%", background: COR.verde }),
      div(
        {
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
        },
        div(
          {
            fontSize: 26,
            color: COR.verde,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          },
          c.rotulo,
        ),
        div(
          { flexDirection: "column", gap: 24 },
          div(
            {
              fontSize: tamanhoTitulo,
              lineHeight: 1.15,
              color: COR.texto,
              fontWeight: 700,
            },
            c.titulo,
          ),
          c.subtitulo
            ? div(
                { fontSize: 32, lineHeight: 1.35, color: COR.suave },
                c.subtitulo,
              )
            : null,
        ),
        div(
          {
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: COR.suave,
          },
          h("span", null, c.detalhe ?? ""),
          h(
            "span",
            { style: { color: COR.texto, fontWeight: 700 } },
            site.url.replace("https://", ""),
          ),
        ),
      ),
    ),
    {
      ...TAMANHO,
      fonts: [
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
        { name: "Inter", data: inter700, weight: 700, style: "normal" },
      ],
    },
  );

  const destino = path.join(SAIDA, arquivo);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, Buffer.from(await imagem.arrayBuffer()));
}

const construida = (rota: string) =>
  existsSync(path.join(DIR_HTML, `${rota}.html`));

await rm(SAIDA, { recursive: true, force: true });
let total = 0;

await gerar("site.png", {
  rotulo: `${perfil.nome} · ${perfil.titulo}`,
  titulo: perfil.frase,
  detalhe: "Blog, projetos e serviços",
});
total++;

for (const p of postsIndexados) {
  if (!construida(`blog/${p.slug}`)) continue;
  await gerar(`blog/${p.slug}.png`, {
    rotulo: ROTULO_PILAR[p.pilar],
    titulo: p.titulo,
    detalhe: `${dataPorExtenso(p.data)} · ${p.minutosDeLeitura} min de leitura`,
  });
  total++;
}

for (const p of projetosIndexados) {
  if (!construida(`projetos/${p.slug}`)) continue;
  await gerar(`projetos/${p.slug}.png`, {
    rotulo: "Case",
    titulo: p.titulo,
    subtitulo: p.resumo,
    detalhe: p.stack.slice(0, 4).join(" · "),
  });
  total++;
}

console.log(`✓ ${total} imagem(ns) de compartilhamento em public/og`);
