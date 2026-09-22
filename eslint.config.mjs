import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Gerados pelo build da Cloudflare (centenas de MB: o lint estoura a memória).
    ".open-next/**",
    ".wrangler/**",
    // Índice de busca gerado no build.
    "public/pagefind/**",
    "public/og/**",
  ]),
]);

export default eslintConfig;
