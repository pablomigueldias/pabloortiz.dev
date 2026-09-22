import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Só a produção de verdade é indexada. Sem SITE_ENV=production (preview,
// *.workers.dev, build local), tudo sai com noindex.
const isProduction = process.env.SITE_ENV === "production";

// Bloqueante desde a Etapa 4 (testado com Mermaid, KaTeX, Shiki, tema e next/image).
// Sem nonce: o site é estático, e nonce obrigaria renderizar cada página no servidor.
// 'wasm-unsafe-eval' é para o WebAssembly da busca (Pagefind); não libera eval de JS.
// Cloudflare Web Analytics (sem cookie): a Cloudflare injeta o beacon de
// static.cloudflareinsights.com, que envia as métricas para cloudflareinsights.com.
const WEB_ANALYTICS = {
  script: "https://static.cloudflareinsights.com",
  envio: "https://cloudflareinsights.com",
};
// Turnstile (anti-robô do formulário de /contato): script e iframe do desafio.
const TURNSTILE = "https://challenges.cloudflare.com";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${WEB_ANALYTICS.script} ${TURNSTILE}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self' ${WEB_ANALYTICS.envio}`,
  `frame-src ${TURNSTILE}`,
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

// URLs do site antigo (SPA em React). Não havia nada indexado (2026-09-22), mas
// links antigos em perfis e mensagens continuam chegando. Posts antigos não foram
// migrados: /blog/<slug antigo> cai no 404, que aponta para o blog.
const redirecionamentosAntigos = [
  { source: "/projects", destination: "/projetos" },
  { source: "/projeto/:id", destination: "/projetos" },
  { source: "/contact", destination: "/contato" },
  { source: "/templates", destination: "/" },
  { source: "/login", destination: "/" },
  { source: "/admin/:caminho*", destination: "/" },
  // O currículo em PDF antigo (nome com erro de digitação) saiu do ar.
  { source: "/:arquivo(Pablo.*Otiz.*\\.pdf)", destination: "/sobre" },
].map((r) => ({ ...r, statusCode: 301 as const }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return redirecionamentosAntigos;
  },
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
