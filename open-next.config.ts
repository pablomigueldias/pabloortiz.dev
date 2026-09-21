import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// O site é todo estático (SSG): não precisa de cache incremental (R2) por enquanto.
export default defineCloudflareConfig({});
