// Formulário da newsletter: limites e validação, usados no HTML e no servidor.
// Sem Zod pelo mesmo motivo do de contato (src/contato/formulario.ts).

export const LIMITES_NEWSLETTER = {
  email: { max: 254 },
  // O token do Turnstile tem ~2 KB; o de confirmação, menos de 1 KB.
  corpoBytes: 4_096,
} as const;

export type Inscricao = {
  email: string;
  /** Honeypot: campo invisível. Gente não preenche; robô preenche. */
  site: string;
  token: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const texto = (valor: unknown) =>
  typeof valor === "string" ? valor.trim() : "";

type Resultado = { ok: true; dados: Inscricao } | { ok: false; erro: string };

export function validarInscricao(bruto: unknown): Resultado {
  if (typeof bruto !== "object" || bruto === null)
    return { ok: false, erro: "Formato inválido." };
  const b = bruto as Record<string, unknown>;
  // Minúsculo: o mesmo endereço digitado de dois jeitos é uma pessoa só.
  const dados: Inscricao = {
    email: texto(b.email).toLowerCase(),
    site: texto(b.site),
    token: texto(b.token),
  };

  if (
    dados.email.length > LIMITES_NEWSLETTER.email.max ||
    !EMAIL.test(dados.email)
  )
    return { ok: false, erro: "Confira o e-mail." };
  if (!dados.token)
    return { ok: false, erro: "Confirme que você não é um robô." };

  return { ok: true, dados };
}
