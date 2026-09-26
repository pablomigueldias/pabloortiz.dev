import Link from "next/link";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { site } from "@/config/site";
import { metadataDaPagina } from "@/seo/metadata";

// Texto tirado da base comercial do Copiloto (data/comercial/base/: servicos.md,
// precos.md e publico.md, revisados em 26/09/2026). Nada aqui que a base não
// diga: preço só em "a partir de", sem promessa de resultado, e as regras do
// CFP que o atendente segue. Foco em psicologia (D13 do motor comercial).

export const metadata = metadataDaPagina({
  titulo: "Serviços",
  descricao:
    "Atendimento automático no WhatsApp para clínicas de psicologia: marca, confirma e remarca, e passa para uma pessoa o que não é de agenda.",
  caminho: "/servicos",
});

const MENSAGEM_RAIOX = "Olá, Pablo! Quero marcar o raio-x do atendimento.";

const FAZ = [
  "Responde na hora, 24 horas, com o nome da clínica e o aviso de privacidade dela.",
  "Marca, confirma, lembra e remarca sessão; trata falta e retorno.",
  "Informa horário, endereço e convênio.",
  "Passa para uma pessoa, com o resumo da conversa, quando pedem, quando é reclamação ou quando o assunto sai da agenda.",
  "Respeita o pedido de parar, na hora.",
];

const NAO_FAZ = [
  "Não pergunta o motivo da consulta nem conversa sobre sintoma.",
  "Não faz acolhimento, escuta nem triagem: isso é do psicólogo.",
  "Não oferece preço, desconto ou pacote; informa o valor só se a clínica quiser e só a quem perguntar.",
  "Não inicia conversa com quem não escreveu.",
  "Não pede CPF nem documento.",
];

const NIVEIS = [
  {
    nome: "Essencial",
    itens: [
      "Responde na hora, com as regras do CFP",
      "Passa para uma pessoa com o resumo",
      "Registra o pedido de horário e avisa a recepção",
    ],
    prazo: "completo em até 5 dias úteis",
  },
  {
    nome: "Recomendado",
    itens: [
      "Tudo do Essencial",
      "Marca e remarca direto na agenda da clínica",
      "Lembrete e confirmação de sessão",
    ],
    prazo: "completo em até 3 semanas",
  },
  {
    nome: "Completo",
    itens: ["Tudo do Recomendado", "CRM com quem ainda não virou paciente"],
    prazo: "completo em até 4 semanas",
  },
];

const PROCESSO = [
  [
    "Raio-x gratuito",
    "30 minutos, com você mostrando como a mensagem chega e é respondida hoje. No dia útil seguinte, 3 pontos por escrito com o que eu faria primeiro.",
  ],
  [
    "Proposta e demonstração",
    "Escopo, prazo e valor por escrito. Antes de assinar, você conversa com o atendente já montado com o caso da sua clínica, num número de teste.",
  ],
  [
    "Implantação",
    "No ar em até 5 dias úteis depois que você aprova os textos. Os textos fixos, inclusive o de crise, são aprovados pelo responsável técnico.",
  ],
  [
    "Acompanhamento",
    "Ajuste de texto e de regra sem limite de horas, relatório mensal com as métricas combinadas e suporte com resposta no mesmo dia útil.",
  ],
] as const;

const CONDICOES = [
  ["Implantação", "a partir de R$ 1.500"],
  ["Mensal", "a partir de R$ 300"],
  ["Pagamento", "50% no aceite, 50% quando entra no ar"],
  ["Fidelidade", "nenhuma: cancela com 30 dias de aviso"],
  ["Garantia", "30 dias depois do aceite"],
  ["Conta do WhatsApp", "no nome da clínica, e continua dela se cancelar"],
  [
    "Onde a equipe responde",
    "numa caixa de entrada, no computador ou no celular: o número passa a ser atendido pelo sistema e sai do app WhatsApp Business",
  ],
] as const;

export default function Servicos() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <p className="text-primary font-mono text-sm">
        Para clínicas de psicologia
      </p>
      <h1 className="text-foreground mt-2 text-4xl font-bold text-balance">
        Nenhum paciente sem resposta, e o psicólogo só faz a terapia
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
        Um atendente automático no WhatsApp da clínica cuida da parte
        administrativa: marca, confirma, lembra e remarca. O que não é de agenda
        vai para uma pessoa da equipe.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <BotaoWhatsApp
          mensagem={MENSAGEM_RAIOX}
          texto="Marcar o raio-x gratuito"
        />
        <Link
          href="#como-funciona"
          className="text-primary text-sm font-semibold hover:underline"
        >
          Como funciona ↓
        </Link>
      </div>

      <h2 className="text-foreground mt-16 text-2xl font-bold">
        O que está em jogo
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border-border rounded-xl border p-5">
          <p className="text-primary font-mono text-3xl font-bold">51%</p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            dos consumidores dizem que o ideal é receber retorno em até 5
            minutos, e o WhatsApp é o canal preferido (CX Trends 2026, Octadesk
            e Opinion Box).
          </p>
        </div>
        <div className="border-border rounded-xl border p-5">
          <p className="text-primary font-mono text-3xl font-bold">34%</p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            dos estabelecimentos de saúde do país oferecem agendamento online
            (TIC Saúde 2023, Cetic.br). Nos outros, quem escreve às 22h espera
            até a manhã seguinte.
          </p>
        </div>
      </div>

      <h2 className="text-foreground mt-16 text-2xl font-bold">
        O que o atendente faz, e o que nunca faz
      </h2>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        A cartilha de IA do CFP diz que, nas atividades administrativas, como
        agendamento e lembrete, a IA pode ser usada sem restrições. O atendente
        fica exatamente aí.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="bg-card border-border rounded-xl border p-6">
          <h3 className="text-card-foreground font-bold">Faz</h3>
          <ul className="text-foreground mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
            {FAZ.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="bg-card border-border rounded-xl border p-6">
          <h3 className="text-card-foreground font-bold">Nunca faz</h3>
          <ul className="text-foreground mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
            {NAO_FAZ.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-muted-foreground border-primary/40 mt-4 border-l-2 pl-4 text-sm leading-relaxed">
        <strong className="text-foreground">Mensagem de crise:</strong> se
        aparecer sinal de risco, o atendente para, avisa o profissional na hora
        e responde com o CVV (188) e o SAMU (192). O texto dessa mensagem é
        aprovado pelo responsável técnico da clínica.
      </p>

      <h2 className="text-foreground mt-16 text-2xl font-bold">Três níveis</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {NIVEIS.map((n) => (
          <li
            key={n.nome}
            className="bg-card border-border flex flex-col rounded-xl border p-6"
          >
            <h3 className="text-card-foreground text-lg font-bold">{n.nome}</h3>
            <ul className="text-foreground mt-3 flex flex-1 list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
              {n.itens.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-4 font-mono text-xs">
              {n.prazo}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-4 text-sm">
        O prazo começa quando a clínica passa os acessos e aprova os textos. A
        aprovação do número pela Meta não depende de mim.
      </p>

      <h2
        id="como-funciona"
        className="text-foreground mt-16 scroll-mt-20 text-2xl font-bold"
      >
        Como funciona
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2">
        {PROCESSO.map(([etapa, descricao], i) => (
          <li key={etapa} className="border-border rounded-xl border p-5">
            <p className="text-primary font-mono text-sm font-bold">0{i + 1}</p>
            <p className="text-foreground mt-2 font-bold">{etapa}</p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {descricao}
            </p>
          </li>
        ))}
      </ol>

      <h2 className="text-foreground mt-16 text-2xl font-bold">Condições</h2>
      <dl className="border-border mt-6 grid gap-x-6 gap-y-3 rounded-xl border p-6 text-sm sm:grid-cols-[10rem_1fr]">
        {CONDICOES.map(([rotulo, valor]) => (
          <div key={rotulo} className="contents">
            <dt className="text-muted-foreground font-semibold">{rotulo}</dt>
            <dd className="text-foreground">{valor}</dd>
          </div>
        ))}
      </dl>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
        O valor fechado sai na proposta, depois do raio-x: depende do número de
        profissionais, das integrações e do volume de conversas. As mensagens
        que a Meta cobra (lembrete fora da janela de 24 horas) são pagas pela
        clínica direto à Meta: uns R$ 15 por mês para 4 psicólogos.
      </p>

      <h2 className="text-foreground mt-16 text-2xl font-bold">
        E o sistema de contatos que ninguém usa?
      </h2>
      <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
        Se a clínica tem um CRM que a equipe não abre, ou controla pacientes
        novos em planilha, eu configuro o que vocês já usam (ou implanto um, se
        não houver), importo a base e ligo ao atendente. De 2 a 4 semanas, a
        partir de R$ 1.500 de implantação.
      </p>

      <div className="bg-primary/5 border-primary/30 mt-16 rounded-xl border p-6 md:p-8">
        <h2 className="text-foreground text-xl font-bold">
          Comece pelo raio-x
        </h2>
        <p className="text-muted-foreground mt-2">
          30 minutos, gratuito, e no dia útil seguinte você recebe 3 pontos por
          escrito. Vira proposta ou não, e os dois são resultado.
        </p>
        <BotaoWhatsApp
          mensagem={MENSAGEM_RAIOX}
          texto="Marcar o raio-x pelo WhatsApp"
          className="mt-6"
        />
        <p className="text-muted-foreground mt-4 text-sm">
          Prefere ler antes?{" "}
          <Link
            href="/newsletter"
            className="text-primary font-semibold hover:underline"
          >
            A newsletter &ldquo;{site.newsletter.nome}&rdquo;
          </Link>{" "}
          traz uma automação pronta para copiar a cada 15 dias.
        </p>
      </div>
    </section>
  );
}
