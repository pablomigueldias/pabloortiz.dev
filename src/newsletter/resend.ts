import { site } from "@/config/site";
import { dev } from "@/servidor/protecao";

// O que a newsletter usa da API do Resend: mandar e-mail e gravar o contato.
// Os contatos são a lista para onde as edições (Broadcasts) vão, e o Resend
// cuida do descadastro em um clique de cada edição.
//
// Segredos do Worker: RESEND_API_KEY (a mesma do contato) e, opcional,
// NEWSLETTER_SEGMENTO, o id do segmento da newsletter no Resend.

const API = "https://api.resend.com";

async function chamar(
  caminho: string,
  metodo: "GET" | "POST" | "PATCH",
  corpo?: unknown,
): Promise<Response> {
  return fetch(`${API}${caminho}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    ...(corpo === undefined ? {} : { body: JSON.stringify(corpo) }),
  });
}

// Só o status no log: o corpo pode ecoar o e-mail, e o log fica no painel.
function falhou(onde: string, resposta: Response): false {
  console.error(`[newsletter] Resend (${onde}) respondeu`, resposta.status);
  return false;
}

export async function enviar(
  para: string,
  email: { assunto: string; texto: string },
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    // No `next dev`, sem chave: mostra no log em vez de enviar.
    if (dev) {
      console.log(`[newsletter] sem RESEND_API_KEY:\n${email.texto}`);
      return true;
    }
    return false;
  }
  const resposta = await chamar("/emails", "POST", {
    from: site.newsletter.remetente,
    to: [para],
    reply_to: site.email,
    subject: email.assunto,
    text: email.texto,
  });
  return resposta.ok || falhou("envio", resposta);
}

export type Situacao = "inscrito" | "fora" | "desconhecida";

/** Se o e-mail já está na lista. "desconhecida" é falha da API. */
export async function situacao(email: string): Promise<Situacao> {
  if (!process.env.RESEND_API_KEY) return "fora";
  const resposta = await chamar(
    `/contacts/${encodeURIComponent(email)}`,
    "GET",
  );
  if (resposta.status === 404) return "fora";
  if (!resposta.ok) {
    falhou("consulta", resposta);
    return "desconhecida";
  }
  const { unsubscribed } = (await resposta.json()) as {
    unsubscribed?: boolean;
  };
  return unsubscribed ? "fora" : "inscrito";
}

/**
 * Inscreve de vez: cria o contato ou, se ele já existia desinscrito (saiu e
 * voltou), reativa. Só é chamado depois da confirmação.
 */
export async function inscrever(email: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return dev;

  const criado = await chamar("/contacts", "POST", {
    email,
    unsubscribed: false,
  });
  if (!criado.ok) {
    // Já existe: o contato é global na conta, então reativa pelo e-mail.
    const reativado = await chamar(
      `/contacts/${encodeURIComponent(email)}`,
      "PATCH",
      { unsubscribed: false },
    );
    if (!reativado.ok) return falhou("inscrição", reativado);
  }

  const segmento = process.env.NEWSLETTER_SEGMENTO;
  if (segmento) {
    const noSegmento = await chamar(
      `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmento)}`,
      "POST",
    );
    // Não derruba a confirmação: quem saiu e voltou pode já estar no segmento,
    // e a inscrição em si deu certo. O log no painel mostra se for outra coisa.
    if (!noSegmento.ok) falhou("segmento", noSegmento);
  }
  return true;
}
