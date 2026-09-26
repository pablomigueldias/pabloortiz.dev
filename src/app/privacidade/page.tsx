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
const ATUALIZADO_EM = "26 de setembro de 2026"; // trocar pela data do go-live do atendente (G2)

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

        <h2>Atendente virtual do WhatsApp comercial</h2>
        <p>
          Quem escreve no WhatsApp comercial deste site é atendido primeiro por
          um <strong>assistente virtual</strong>, que se apresenta como tal na
          primeira mensagem. Ele responde perguntas sobre os serviços, entende o
          que o seu negócio precisa, marca uma reunião e me avisa. Negociação e
          proposta são sempre comigo. O responsável pelos dados sou eu, Pablo
          Ortiz, pelo e-mail <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <p>
          <strong>O que ele guarda:</strong> o seu número e o nome do seu
          WhatsApp, o que você escreve na conversa (por exemplo, o nome e o ramo
          da sua empresa, o tamanho da equipe e o que você quer resolver) e, se
          você marcar reunião, o e-mail do convite. Ele não pede CPF, documento
          nem dado de saúde, e não pede dado de clientes seus.{" "}
          <strong>Imagens e arquivos não são abertos</strong>: ficam só no meu
          celular, como qualquer mensagem, e o assistente pede que você conte em
          texto. Áudio é transcrito no meu próprio computador e o arquivo é
          apagado em seguida.
        </p>
        <p>
          <strong>Para quê e com que base:</strong> para responder ao contato
          que você fez e preparar uma possível proposta (LGPD, art. 7º, V), e
          para no máximo um lembrete nas 24 horas depois da sua última mensagem,
          por legítimo interesse (art. 7º, IX). Nada de mensagem para quem não
          escreveu primeiro, e quem escreve &ldquo;parar&rdquo; não recebe mais
          nada.
        </p>
        <p>
          <strong>Quem mais trata esses dados:</strong> o WhatsApp (Meta), que
          leva as mensagens; o Google (Gemini), que gera as respostas do
          assistente, no plano gratuito, em que o Google pode usar o conteúdo
          para melhorar os produtos dele; o Groq, que só entra se o Gemini
          estiver fora do ar e não usa o conteúdo para treinar modelos; o
          Telegram, por onde o assistente me avisa de um contato novo; e o
          Cal.com, se você marcar reunião. Todos eles tratam dados fora do
          Brasil, principalmente nos Estados Unidos (LGPD, art. 33). O
          assistente roda no meu computador, no Brasil.
        </p>
        <p>
          <strong>Por quanto tempo:</strong> 90 dias sem mensagem, se a conversa
          parar antes de entender o que você precisa; 180 dias, se parar depois
          disso sem reunião marcada. Depois, tudo é apagado. Se você pedir para
          parar, o texto da conversa é apagado na hora, e fica só o seu número
          cifrado, para o assistente não voltar a falar com você. Se virarmos
          parceiros de trabalho, os dados passam para o registro do contrato.
        </p>
        <p>
          <strong>Seus direitos:</strong> escreva{" "}
          <strong>APAGAR MEUS DADOS</strong> na própria conversa, ou mande um
          e-mail para <a href={`mailto:${site.email}`}>{site.email}</a>, e eu
          apago em até 15 dias (na prática, no mesmo dia). Também pode pedir uma
          cópia do que o assistente guardou, ou a correção de algum dado.
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
