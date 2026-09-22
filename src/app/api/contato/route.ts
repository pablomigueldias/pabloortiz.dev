import { getCloudflareContext } from "@opennextjs/cloudflare";
import { site } from "@/config/site";
import {
  LIMITES,
  TURNSTILE_TESTE,
  validarMensagem,
  type Mensagem,
} from "@/contato/formulario";

// Recebe o formulário de /contato e manda um e-mail para contato@ pelo Resend.
// Nada é guardado: a mensagem existe só no e-mail que chega na caixa.

type LimitadorDeTaxa = {
  limit: (opcoes: { key: string }) => Promise<{ success: boolean }>;
};

// Chaves de teste e envio "só no log" valem apenas no `next dev`. Não usar SITE_ENV
// aqui: ele é variável de build e não existe no Worker em execução, então qualquer
// regra baseada nele liberaria as chaves de teste em produção.
const dev = process.env.NODE_ENV === "development";

function erro(status: number, mensagem: string) {
  return Response.json({ ok: false, erro: mensagem }, { status });
}

// Binding de Rate Limiting do Worker (wrangler.jsonc). No `next dev` não existe.
async function dentroDoLimite(ip: string): Promise<boolean> {
  let limitador: LimitadorDeTaxa | undefined;
  try {
    const { env } = getCloudflareContext();
    limitador = (env as { LIMITE_CONTATO?: LimitadorDeTaxa }).LIMITE_CONTATO;
  } catch {
    return true;
  }
  if (!limitador) return true;
  return (await limitador.limit({ key: ip })).success;
}

async function turnstileValido(token: string, ip: string): Promise<boolean> {
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

async function enviarEmail(m: Mensagem): Promise<boolean> {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) {
    // No `next dev`, sem chave: mostra no log em vez de enviar.
    if (dev) {
      console.log("[contato] sem RESEND_API_KEY, e-mail não enviado:", m.nome);
      return true;
    }
    return false;
  }

  // Texto puro: nada que a pessoa escreveu vira HTML. Quebra de linha no nome
  // não entra no assunto (evita injeção de cabeçalho).
  const nome = m.nome.replace(/[\r\n]+/g, " ");
  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chave}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: site.remetenteFormulario,
      to: [site.email],
      reply_to: m.email,
      subject: `[pabloortiz.dev] Mensagem de ${nome}`,
      text: `${m.mensagem}\n\n--\n${nome} <${m.email}>\nEnviado pelo formulário de ${site.url}/contato`,
    }),
  });
  if (!resposta.ok) {
    // Só o status: o corpo pode ecoar dados da mensagem, e o log fica no painel.
    console.error("[contato] Resend respondeu", resposta.status);
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  // Só o próprio site envia (o navegador sempre manda Origin num POST com fetch).
  const origem = request.headers.get("origin");
  if (origem !== new URL(request.url).origin && origem !== site.url)
    return erro(403, "Origem não permitida.");

  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return erro(415, "Envie JSON.");

  const tamanho = Number(request.headers.get("content-length") ?? 0);
  if (tamanho > LIMITES.corpoBytes) return erro(413, "Mensagem grande demais.");

  const ip = request.headers.get("cf-connecting-ip") ?? "";
  if (!(await dentroDoLimite(ip || "sem-ip")))
    return erro(
      429,
      "Muitas mensagens em pouco tempo. Tente de novo em 1 minuto.",
    );

  const texto = await request.text();
  if (texto.length > LIMITES.corpoBytes)
    return erro(413, "Mensagem grande demais.");

  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return erro(400, "Formato inválido.");
  }

  const resultado = validarMensagem(bruto);
  if (!resultado.ok) return erro(400, resultado.erro);
  const mensagem = resultado.dados;

  // Robô preencheu o campo invisível: responde "ok" e não faz nada.
  if (mensagem.site) return Response.json({ ok: true });

  if (!(await turnstileValido(mensagem.token, ip)))
    return erro(
      400,
      "Não deu para confirmar que você não é um robô. Recarregue a página e tente de novo.",
    );

  if (!(await enviarEmail(mensagem)))
    return erro(503, `O envio falhou. Escreva direto para ${site.email}.`);

  return Response.json({ ok: true });
}
