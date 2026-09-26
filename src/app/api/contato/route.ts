import { site } from "@/config/site";
import { LIMITES, validarMensagem, type Mensagem } from "@/contato/formulario";
import {
  dentroDoLimite,
  dev,
  erro,
  ipDe,
  lerCorpo,
  turnstileValido,
} from "@/servidor/protecao";

// Recebe o formulário de /contato e manda um e-mail para contato@ pelo Resend.
// Nada é guardado: a mensagem existe só no e-mail que chega na caixa.

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
  const corpo = await lerCorpo(request, LIMITES.corpoBytes);
  if ("resposta" in corpo) return corpo.resposta;

  const ip = ipDe(request);
  if (!(await dentroDoLimite("LIMITE_CONTATO", ip)))
    return erro(
      429,
      "Muitas mensagens em pouco tempo. Tente de novo em 1 minuto.",
    );

  const resultado = validarMensagem(corpo.bruto);
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
