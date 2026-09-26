import { site } from "@/config/site";
import { verificar } from "@/newsletter/assinatura";
import { emailBoasVindas } from "@/newsletter/emails";
import { LIMITES_NEWSLETTER } from "@/newsletter/formulario";
import { enviar, inscrever, situacao } from "@/newsletter/resend";
import { segredoDaNewsletter } from "@/newsletter/segredo";
import { dentroDoLimite, erro, ipDe, lerCorpo } from "@/servidor/protecao";

// Segundo passo do double opt-in: o botão de /newsletter/confirmar manda o
// token, e só aqui o e-mail vira contato no Resend.
//
// POST e não o GET do próprio link: antivírus de e-mail e pré-visualizador de
// link abrem tudo o que chega, e um GET que inscreve inscreveria sem a pessoa.

export async function POST(request: Request) {
  const corpo = await lerCorpo(request, LIMITES_NEWSLETTER.corpoBytes);
  if ("resposta" in corpo) return corpo.resposta;

  if (!(await dentroDoLimite("LIMITE_NEWSLETTER", ipDe(request))))
    return erro(
      429,
      "Muitas tentativas em pouco tempo. Tente de novo em 1 minuto.",
    );

  const bruto = corpo.bruto as { token?: unknown } | null;
  const token = typeof bruto?.token === "string" ? bruto.token.trim() : "";
  const segredo = segredoDaNewsletter();
  if (!segredo)
    return erro(503, "A confirmação está fora do ar. Tente mais tarde.");

  const verificacao = await verificar(token, segredo);
  if (!verificacao.ok)
    return erro(
      400,
      verificacao.motivo === "expirado"
        ? "Este link passou das 48 horas. Faça a inscrição de novo para receber outro."
        : "Este link não é válido. Confira se ele veio inteiro do e-mail.",
    );
  const { email } = verificacao;

  // Clicou duas vezes: já está dentro, e as boas-vindas não vão de novo.
  if ((await situacao(email)) === "inscrito")
    return Response.json({ ok: true });

  if (!(await inscrever(email)))
    return erro(
      503,
      `A confirmação falhou. Tente de novo em alguns minutos ou escreva para ${site.email}.`,
    );

  // A inscrição já valeu. Se o agradecimento não sair, o log mostra, e a
  // pessoa continua na lista: não é motivo para dizer que falhou.
  await enviar(email, emailBoasVindas());
  return Response.json({ ok: true });
}
