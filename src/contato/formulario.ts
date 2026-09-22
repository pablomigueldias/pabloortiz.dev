// Formulário de contato: limites (usados no HTML e no servidor) e a validação.
// Sem Zod de propósito: até o zod/mini põe ~370 KB no Worker, que tem limite de
// 3 MiB. Para quatro campos, validar à mão é pequeno e fácil de testar.

export const LIMITES = {
  nome: { min: 2, max: 80 },
  email: { max: 254 },
  mensagem: { min: 10, max: 4000 },
  // Corpo inteiro da requisição, com o token do Turnstile (~2 KB).
  corpoBytes: 16_384,
} as const;

export type Mensagem = {
  nome: string;
  email: string;
  mensagem: string;
  /** Honeypot: campo invisível. Gente não preenche; robô preenche. */
  site: string;
  token: string;
};

type Resultado = { ok: true; dados: Mensagem } | { ok: false; erro: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const texto = (valor: unknown) =>
  typeof valor === "string" ? valor.trim() : "";

export function validarMensagem(bruto: unknown): Resultado {
  if (typeof bruto !== "object" || bruto === null)
    return { ok: false, erro: "Formato inválido." };
  const b = bruto as Record<string, unknown>;
  const dados: Mensagem = {
    nome: texto(b.nome),
    email: texto(b.email),
    mensagem: texto(b.mensagem),
    site: texto(b.site),
    token: texto(b.token),
  };

  if (dados.nome.length < LIMITES.nome.min)
    return { ok: false, erro: "Escreva seu nome." };
  if (dados.nome.length > LIMITES.nome.max)
    return { ok: false, erro: "Nome longo demais." };
  if (dados.email.length > LIMITES.email.max || !EMAIL.test(dados.email))
    return { ok: false, erro: "Confira o e-mail." };
  if (dados.mensagem.length < LIMITES.mensagem.min)
    return { ok: false, erro: "Conte um pouco mais na mensagem." };
  if (dados.mensagem.length > LIMITES.mensagem.max)
    return { ok: false, erro: "Mensagem longa demais." };
  if (!dados.token)
    return { ok: false, erro: "Confirme que você não é um robô." };

  return { ok: true, dados };
}

// Chaves de teste oficiais do Turnstile: sempre passam. Só no `next dev`.
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
export const TURNSTILE_TESTE = {
  siteKey: "1x00000000000000000000AA",
  secret: "1x0000000000000000000000000000000AA",
};
