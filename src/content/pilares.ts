// Fora do schema.ts de propósito: as páginas importam os pilares, e o schema
// puxa o Zod, que só roda no build. Importar dali colocava o Zod inteiro no Worker.

// Pilares abertos. "hardware" só entra quando existir o 1º projeto documentado.
export const PILARES = ["ia-llms", "dados-ml"] as const;
