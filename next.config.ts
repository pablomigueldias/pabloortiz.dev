import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Só a produção de verdade é indexada. Sem SITE_ENV=production (preview,
// *.workers.dev, build local), tudo sai com noindex.
const isProduction = process.env.SITE_ENV === "production";

// Bloqueante desde a Etapa 4 (testado com Mermaid, KaTeX, Shiki, tema e next/image).
// Sem nonce: o site é estático, e nonce obrigaria renderizar cada página no servidor.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProduction
    ? []
    : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

// Plugins pelo nome (string): o Turbopack não aceita função como opção.
// O MDX vira módulo no build, sem eval em tempo de execução (Workers bloqueiam eval).
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      "remark-gfm",
      "remark-math",
    ],
    rehypePlugins: [
      // id nos headings (a TOC da Etapa 6 usa) e o próprio heading vira link para a âncora.
      // Plugin local: id sem acento (ver o arquivo). Caminho absoluto, calculado no
      // build: o relativo é resolvido a partir de uma pasta interna do Turbopack.
      path.resolve("src/mdx/rehype-slug-ascii.mjs"),
      [
        "rehype-autolink-headings",
        { behavior: "wrap", properties: { className: ["ancora"] } },
      ],
      // Matemática renderizada no build. O rehype-katex não lança erro (desenha a fórmula
      // em vermelho com .katex-error); quem quebra o build é o scripts/verificar-build.ts.
      ["rehype-katex", { strict: true }],
      // Highlight no build (zero JS no cliente). Temas por nome: opção serializável.
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
