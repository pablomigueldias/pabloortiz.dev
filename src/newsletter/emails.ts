import { site } from "@/config/site";

// Os dois e-mails automáticos da newsletter, em texto puro (como o do contato):
// sem HTML, nada para renderizar errado e nada que pareça marketing.
// Voz: prompts/voz.md do Copiloto (frase curta, um pedido só, sem enchimento).

type Email = { assunto: string; texto: string };

const { nome } = site.newsletter;

export function emailConfirmacao(link: string): Email {
  return {
    assunto: `Confirme sua inscrição: ${nome}`,
    texto: [
      `Alguém, espero que você, pediu para receber a "${nome}" neste endereço.`,
      `Para confirmar, abra o link e clique em "Confirmar inscrição":\n${link}`,
      "O link vale por 48 horas. Se não foi você, é só ignorar este e-mail: sem a confirmação, seu endereço não fica guardado em lugar nenhum.",
      `Pablo Ortiz\n${site.url}`,
    ].join("\n\n"),
  };
}

export function emailBoasVindas(): Email {
  const { isca, promessa } = site.newsletter;
  return {
    assunto: `Obrigado por se inscrever na "${nome}"`,
    texto: [
      `Obrigado por se inscrever. ${promessa}`,
      ...(isca
        ? [
            `Como prometido, o checklist "O WhatsApp da sua clínica está perdendo paciente?": dez perguntas de sim ou não, para responder em 5 minutos.\n${isca}`,
          ]
        : []),
      "Antes da primeira edição, uma pergunta: qual mensagem mais fica sem resposta hoje no WhatsApp do seu negócio? Responda este e-mail. Eu leio todas as respostas.",
      `Pablo Ortiz\n${site.url}`,
      `--\nPara sair da lista, use o link no rodapé de qualquer edição ou escreva para ${site.email}. Como seus dados são tratados: ${site.url}/privacidade`,
    ].join("\n\n"),
  };
}
