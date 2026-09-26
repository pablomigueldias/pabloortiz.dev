import { site } from "@/config/site";
import { metadataDaPagina } from "@/seo/metadata";

export const metadata = metadataDaPagina({
  titulo: "Privacidade",
  descricao:
    "O que este site coleta (quase nada) e como pedir a remoção dos seus dados.",
  caminho: "/privacidade",
});

// Manter fiel ao que o site realmente faz. Mudou o site (analytics, formulário,
// newsletter)? Atualize esta página e a data no mesmo PR.
const ATUALIZADO_EM = "26 de setembro de 2026";

export default function Privacidade() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground text-4xl font-bold">Privacidade</h1>
      <p className="text-muted-foreground mt-4 font-mono text-sm">
        Atualizado em {ATUALIZADO_EM}
      </p>

      <div className="post prose prose-lg dark:prose-invert mt-10 max-w-none">
        <p>
          Resumo: este site <strong>não usa cookies</strong> e{" "}
          <strong>não identifica você</strong>. Ele só conta visitas de forma
          agregada, sem saber quem é quem. Esta página segue a Lei Geral de
          Proteção de Dados (LGPD, Lei nº 13.709/2018).
        </p>

        <h2>O que fica no seu navegador</h2>
        <p>
          Só a sua escolha de tema (claro ou escuro), no{" "}
          <code>localStorage</code>, com a chave <code>tema</code>. Ela nunca
          sai do seu navegador e você pode apagá-la limpando os dados do site.
        </p>

        <h2>Estatísticas de visita</h2>
        <p>
          Uso o{" "}
          <a href="https://www.cloudflare.com/pt-br/web-analytics/">
            Cloudflare Web Analytics
          </a>{" "}
          para saber quais páginas são lidas. Ele não usa cookies, não guarda
          nada no seu navegador e não cria um identificador seu. Eu vejo só
          totais: páginas visitadas, de onde as visitas vieram (o site que
          trouxe o link), país, navegador e o tempo de carregamento das páginas.
          Não vejo seu endereço IP nem consigo separar uma pessoa da outra.
        </p>

        <h2>Formulário de contato</h2>
        <p>
          Se você usar o formulário da página de contato, ele envia o seu{" "}
          <strong>nome, e-mail e mensagem</strong> para a minha caixa{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. O site não guarda
          nada: a mensagem existe só como e-mail. Uso esses dados só para
          responder e apago a conversa quando ela não for mais necessária, ou
          antes, se você pedir.
        </p>
        <p>
          O envio passa pelo{" "}
          <a href="https://resend.com/legal/privacy-policy">Resend</a>, serviço
          de e-mail que pode processar os dados fora do Brasil, e o formulário
          usa o{" "}
          <a href="https://www.cloudflare.com/pt-br/turnstile-privacy-policy/">
            Cloudflare Turnstile
          </a>{" "}
          para barrar robôs, sem cookies de rastreamento. O Turnstile só é
          carregado nas páginas de contato e da newsletter.
        </p>

        <h2>Newsletter</h2>
        <p>
          Se você se inscrever na{" "}
          <a href="/newsletter">{site.newsletter.nome}</a>, o site pede só o seu{" "}
          <strong>e-mail</strong>, para uma finalidade: mandar as edições. A
          inscrição tem duas etapas. Primeiro vai um e-mail com um link de
          confirmação, e até você clicar nele seu endereço não fica guardado em
          lugar nenhum: ele viaja dentro do próprio link, assinado para não ser
          falsificado, e o link vence em 48 horas.
        </p>
        <p>
          Depois da confirmação, o e-mail fica na lista de contatos do{" "}
          <a href="https://resend.com/legal/privacy-policy">Resend</a>, que
          envia as edições e guarda os dados nos Estados Unidos. Ele fica lá
          enquanto você estiver inscrito. Toda edição tem um link para sair em
          um clique, e quem sai não recebe mais nada. Para apagar o seu endereço
          também da lista, escreva para{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Hospedagem</h2>
        <p>
          O site é hospedado na Cloudflare, que processa dados técnicos da
          conexão (como o endereço IP) para entregar as páginas e proteger
          contra ataques, conforme a{" "}
          <a href="https://www.cloudflare.com/pt-br/privacypolicy/">
            política da Cloudflare
          </a>
          . Eu não tenho acesso a esses dados para identificar visitantes.
        </p>

        <h2>Links para outros serviços</h2>
        <p>
          Os botões de WhatsApp, LinkedIn e GitHub levam para esses serviços,
          que têm as próprias políticas. Se você me mandar mensagem ou e-mail,
          uso o seu contato só para responder.
        </p>

        <h2>Seus direitos</h2>
        <p>
          Você pode pedir acesso, correção ou remoção de qualquer dado seu que
          eu tenha, por exemplo, uma conversa. Basta escrever para{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> ou falar comigo pelo{" "}
          <a href={site.linkedin}>LinkedIn</a> ou pelo WhatsApp da página de
          contato.
        </p>
      </div>
    </article>
  );
}
