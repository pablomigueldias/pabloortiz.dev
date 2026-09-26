import { site } from "@/config/site";
import { assinar } from "@/newsletter/assinatura";
import { emailConfirmacao } from "@/newsletter/emails";
import { LIMITES_NEWSLETTER, validarInscricao } from "@/newsletter/formulario";
import { enviar, situacao } from "@/newsletter/resend";
import { segredoDaNewsletter } from "@/newsletter/segredo";
import {
  dentroDoLimite,
  dev,
  erro,
  ipDe,
  lerCorpo,
  turnstileValido,
} from "@/servidor/protecao";

// Inscrição na newsletter, primeiro passo do double opt-in: manda o e-mail com
// o link de confirmação e não guarda nada. O e-mail vai dentro do link assinado
// (src/newsletter/assinatura.ts), e o contato só é criado quando a pessoa confirma.

export async function POST(request: Request) {
  const corpo = await lerCorpo(request, LIMITES_NEWSLETTER.corpoBytes);
  if ("resposta" in corpo) return corpo.resposta;

  const ip = ipDe(request);
  if (!(await dentroDoLimite("LIMITE_NEWSLETTER", ip)))
    return erro(
      429,
      "Muitas tentativas em pouco tempo. Tente de novo em 1 minuto.",
    );

  const resultado = validarInscricao(corpo.bruto);
  if (!resultado.ok) return erro(400, resultado.erro);
  const { email, site: honeypot, token } = resultado.dados;

  // Robô preencheu o campo invisível: responde "ok" e não faz nada.
  if (honeypot) return Response.json({ ok: true });

  // O Turnstile é o que impede alguém de usar este formulário para mandar
  // e-mails de confirmação em massa para endereços de terceiros.
  if (!(await turnstileValido(token, ip)))
    return erro(
      400,
      "Não deu para confirmar que você não é um robô. Recarregue a página e tente de novo.",
    );

  const segredo = segredoDaNewsletter();
  if (!segredo)
    return erro(503, "A inscrição está fora do ar. Tente mais tarde.");

  // Já inscrito: responde igual e não manda nada. A resposta não diz quem
  // está na lista, e a pessoa não recebe uma confirmação que não pediu de novo.
  if ((await situacao(email)) === "inscrito")
    return Response.json({ ok: true });

  const base = dev ? new URL(request.url).origin : site.url;
  const link = `${base}/newsletter/confirmar?t=${await assinar(email, segredo)}`;
  if (!(await enviar(email, emailConfirmacao(link))))
    return erro(
      503,
      "O envio do e-mail de confirmação falhou. Tente de novo em alguns minutos.",
    );

  return Response.json({ ok: true });
}
