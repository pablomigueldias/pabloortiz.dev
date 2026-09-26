// Fora do schema.ts de propósito: as páginas importam os pilares, e o schema
// puxa o Zod, que só roda no build. Importar dali colocava o Zod inteiro no Worker.

// Pilares abertos. "hardware" só entra quando existir o 1º projeto documentado.
// "automacao-negocio" é o do dono de negócio (passo 8.1 do motor comercial): o
// mesmo trabalho dos outros dois, contado para quem compra e não para quem constrói.
export const PILARES = ["ia-llms", "dados-ml", "automacao-negocio"] as const;
