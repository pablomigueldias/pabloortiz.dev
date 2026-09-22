import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// O site é todo pré-renderizado no build e não revalida. As páginas com
// generateStaticParams (posts e projetos) ficam no cache incremental: sem ele,
// o Worker responde 404 para elas. Este cache lê direto dos assets estáticos.
//
// Sem `enableCacheInterception`: com ela, o prefetch de segmento do Next
// (header Next-Router-Segment-Prefetch) recebia a página RSC inteira, o cliente
// descartava e pedia de novo, em loop. Medido no preview: 4.296 requisições em
// 15 s só com a Home aberta, contra 18 sem a interceptação.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
