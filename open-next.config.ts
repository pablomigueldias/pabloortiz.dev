import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// O site é todo pré-renderizado no build e não revalida. As páginas com
// generateStaticParams (posts e projetos) ficam no cache incremental: sem ele,
// o Worker responde 404 para elas. Este cache lê direto dos assets estáticos.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
