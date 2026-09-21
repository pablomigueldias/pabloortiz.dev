import { z } from "zod";

// Pilares abertos. "hardware" só entra quando existir o 1º projeto documentado.
export const PILARES = ["ia-llms", "dados-ml"] as const;

// Tags curadas: tag nova entra aqui antes de ser usada num post.
export const TAGS = [
  "rag",
  "llm",
  "llm-local",
  "agentes",
  "avaliacao",
  "observabilidade",
  "pgvector",
  "postgresql",
  "sql",
  "python",
  "fastapi",
  "machine-learning",
  "redes-neurais",
  "analise-de-dados",
  "pipeline-de-dados",
  "whisper",
  "fundamentos",
  "carreira",
] as const;

// Slug = nome do arquivo: minúsculas, sem acento, palavras separadas por hífen.
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const DATA = /^\d{4}-\d{2}-\d{2}$/;

// Caminho absoluto no "origem" expõe a estrutura da minha máquina (§10 do plano).
const caminhoRelativo = z
  .string()
  .min(1)
  .refine((c) => !/^(?:\/|[A-Za-z]:\\|~)/.test(c), {
    message: "use caminho relativo (sem /home, /mnt, C:\\ ou ~)",
  });

export const frontmatterSchema = z
  .object({
    titulo: z.string().min(10).max(70),
    descricao: z.string().min(50).max(160),
    data: z.string().regex(DATA, "use AAAA-MM-DD"),
    atualizado: z.string().regex(DATA, "use AAAA-MM-DD").optional(),
    pilar: z.enum(PILARES),
    tags: z.array(z.enum(TAGS)).max(5).default([]),
    draft: z.boolean().default(false),
    lang: z.literal("pt-BR").default("pt-BR"),
    capa: z.string().optional(),
    origem: z
      .array(
        z.object({
          vault: caminhoRelativo.optional(),
          copiloto: caminhoRelativo.optional(),
        }),
      )
      .optional(),
  })
  .strict()
  .refine((f) => !f.atualizado || f.atualizado >= f.data, {
    message: "atualizado não pode ser antes de data",
    path: ["atualizado"],
  });

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type PostIndexado = Frontmatter & {
  slug: string;
  minutosDeLeitura: number;
};
