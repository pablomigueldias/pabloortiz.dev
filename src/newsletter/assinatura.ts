// O link de confirmação da newsletter carrega o próprio e-mail, assinado.
//
// Assim nada é guardado antes de a pessoa confirmar: quem se inscreve e não
// clica não deixa dado em lugar nenhum, nem no Resend. A assinatura (HMAC-SHA256
// com o segredo NEWSLETTER_SEGREDO do Worker) garante que só o site gera um
// link válido, e a validade curta limita o estrago de um link encaminhado.
//
// Web Crypto e não uma biblioteca: existe no Worker e no Node, e não pesa nada
// no limite de 3 MiB.

export const VALIDADE_MS = 48 * 60 * 60 * 1000;

const codificador = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let binario = "";
  for (const b of bytes) binario += String.fromCharCode(b);
  return btoa(binario)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function deBase64url(texto: string): Uint8Array<ArrayBuffer> | null {
  try {
    const binario = atob(texto.replaceAll("-", "+").replaceAll("_", "/"));
    return Uint8Array.from(binario, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

function chave(segredo: string, uso: KeyUsage) {
  return crypto.subtle.importKey(
    "raw",
    codificador.encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [uso],
  );
}

/** `<carga>.<assinatura>`, as duas partes em base64url. */
export async function assinar(
  email: string,
  segredo: string,
  agora = Date.now(),
): Promise<string> {
  const carga = base64url(
    codificador.encode(JSON.stringify({ e: email, x: agora + VALIDADE_MS })),
  );
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    await chave(segredo, "sign"),
    codificador.encode(carga),
  );
  return `${carga}.${base64url(new Uint8Array(assinatura))}`;
}

export type Verificacao =
  { ok: true; email: string } | { ok: false; motivo: "invalido" | "expirado" };

export async function verificar(
  token: string,
  segredo: string,
  agora = Date.now(),
): Promise<Verificacao> {
  const [carga, assinatura, ...resto] = token.split(".");
  const bytes = assinatura ? deBase64url(assinatura) : null;
  if (!carga || !bytes || resto.length > 0)
    return { ok: false, motivo: "invalido" };

  // `verify` compara em tempo constante.
  const valida = await crypto.subtle.verify(
    "HMAC",
    await chave(segredo, "verify"),
    bytes,
    codificador.encode(carga),
  );
  if (!valida) return { ok: false, motivo: "invalido" };

  const json = deBase64url(carga);
  if (!json) return { ok: false, motivo: "invalido" };
  const { e, x } = JSON.parse(new TextDecoder().decode(json)) as {
    e?: unknown;
    x?: unknown;
  };
  if (typeof e !== "string" || typeof x !== "number")
    return { ok: false, motivo: "invalido" };
  if (agora > x) return { ok: false, motivo: "expirado" };
  return { ok: true, email: e };
}
