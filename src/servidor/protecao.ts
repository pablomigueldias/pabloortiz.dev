import { getCloudflareContext } from "@opennextjs/cloudflare";
import { site } from "@/config/site";
import { TURNSTILE_TESTE } from "@/contato/formulario";

// O que toda rota que recebe formulário confere antes de fazer qualquer coisa:
// origem, tipo e tamanho do corpo, limite por IP e o Turnstile. Usado por
// /api/contato e /api/newsletter.

type LimitadorDeTaxa = {
  limit: (opcoes: { key: string }) => Promise<{ success: boolean }>;
};

// Chaves de teste e envio "só no log" valem apenas no `next dev`. Não usar SITE_ENV
// aqui: ele é variável de build e não existe no Worker em execução, então qualquer
// regra baseada nele liberaria as chaves de teste em produção.
export const dev = process.env.NODE_ENV === "development";

export function erro(status: number, mensagem: string) {
  return Response.json({ ok: false, erro: mensagem }, { status });
}

/**
 * Lê o corpo JSON de um POST do próprio site. Devolve o objeto, ou a resposta
 * de erro pronta. Só o próprio site envia: o navegador sempre manda Origin
 * num POST com fetch.
 */
export async function lerCorpo(
  request: Request,
  limiteBytes: number,
): Promise<{ bruto: unknown } | { resposta: Response }> {
  const origem = request.headers.get("origin");
  if (origem !== new URL(request.url).origin && origem !== site.url)
    return { resposta: erro(403, "Origem não permitida.") };

  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return { resposta: erro(415, "Envie JSON.") };

  const grande = { resposta: erro(413, "Mensagem grande demais.") };
  if (Number(request.headers.get("content-length") ?? 0) > limiteBytes)
    return grande;
  const texto = await request.text();
  if (texto.length > limiteBytes) return grande;

  try {
    return { bruto: JSON.parse(texto) };
  } catch {
    return { resposta: erro(400, "Formato inválido.") };
  }
}

export function ipDe(request: Request): string {
  return request.headers.get("cf-connecting-ip") ?? "";
}

// Binding de Rate Limiting do Worker (wrangler.jsonc). No `next dev` não existe.
export async function dentroDoLimite(
  binding: "LIMITE_CONTATO" | "LIMITE_NEWSLETTER" | "LIMITE_EVENTOS",
  ip: string,
): Promise<boolean> {
  let limitador: LimitadorDeTaxa | undefined;
  try {
    const { env } = getCloudflareContext();
    limitador = (env as Record<string, LimitadorDeTaxa | undefined>)[binding];
  } catch {
    return true;
  }
  if (!limitador) return true;
  return (await limitador.limit({ key: ip || "sem-ip" })).success;
}

export async function turnstileValido(
  token: string,
  ip: string,
): Promise<boolean> {
  const secret =
    process.env.TURNSTILE_SECRET_KEY ??
    (dev ? TURNSTILE_TESTE.secret : undefined);
  if (!secret) return false;

  const corpo = new FormData();
  corpo.set("secret", secret);
  corpo.set("response", token);
  if (ip) corpo.set("remoteip", ip);
  const resposta = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: corpo },
  );
  if (!resposta.ok) return false;
  const { success } = (await resposta.json()) as { success?: boolean };
  return success === true;
}
