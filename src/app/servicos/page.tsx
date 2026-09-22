import type { Metadata } from "next";
import Link from "next/link";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";

export const metadata: Metadata = {
  title: "Serviços · Pablo Ortiz",
  description:
    "Assistentes que respondem sobre os documentos da sua empresa, automação com LLM e aprovação humana, APIs e pipelines de dados em Python.",
};

const OFERTAS = [
  {
    titulo: "Assistente que responde sobre os documentos da sua empresa",
    paraQuem:
      "Empresa com manual, contrato, base de conhecimento ou suporte repetitivo.",
    entrega:
      'Busca que responde citando a fonte e diz "não sei" quando não sabe. Pode rodar localmente, sem mandar dado para fora.',
    prova: { rotulo: "Copiloto", href: "/projetos/copiloto" },
  },
  {
    titulo: "Automação de processo com LLM e aprovação humana",
    paraQuem:
      "Time que copia dado de e-mail, PDF ou formulário para planilha ou CRM.",
    entrega:
      "Extração estruturada, uma fila onde uma pessoa aprova antes de gravar, e registro de cada chamada com custo.",
    prova: { rotulo: "Copiloto", href: "/projetos/copiloto" },
  },
  {
    titulo: "API e pipeline de dados em Python",
    paraQuem:
      "Quem precisa de um backend ou de uma ingestão de dados que não quebre.",
    entrega: "FastAPI e PostgreSQL, com migrations, testes e deploy.",
    prova: { rotulo: "Projetos", href: "/projetos" },
  },
];

const PROCESSO = [
  [
    "Conversa",
    "30 minutos pelo WhatsApp ou por vídeo: qual é o problema e como medir o sucesso.",
  ],
  ["Proposta", "Escopo, prazo e a métrica combinada, por escrito."],
  ["Protótipo", "Uma primeira versão medida, em uma a duas semanas."],
  ["Entrega", "Com testes, documentação e passagem de conhecimento."],
] as const;

export default function Servicos() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-foreground text-4xl font-bold">Serviços</h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
        Três coisas que eu já construí e sei medir. Nada que eu não tenha feito.
      </p>

      <ul className="mt-12 flex flex-col gap-6">
        {OFERTAS.map((o) => (
          <li
            key={o.titulo}
            className="bg-card border-border rounded-xl border p-6 md:p-8"
          >
            <h2 className="text-card-foreground text-xl font-bold">
              {o.titulo}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
              <dt className="text-muted-foreground font-semibold">Para quem</dt>
              <dd className="text-foreground">{o.paraQuem}</dd>
              <dt className="text-muted-foreground font-semibold">
                O que entrega
              </dt>
              <dd className="text-foreground">{o.entrega}</dd>
              <dt className="text-muted-foreground font-semibold">Prova</dt>
              <dd>
                <Link
                  href={o.prova.href}
                  className="text-primary font-semibold hover:underline"
                >
                  {o.prova.rotulo} →
                </Link>
              </dd>
            </dl>
          </li>
        ))}
      </ul>

      <h2 className="text-foreground mt-16 text-2xl font-bold">
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

      <div className="bg-primary/5 border-primary/30 mt-16 rounded-xl border p-6 md:p-8">
        <h2 className="text-foreground text-xl font-bold">
          Valores sob consulta
        </h2>
        <p className="text-muted-foreground mt-2">
          Depende do escopo. Me conta o problema e eu respondo com uma proposta.
        </p>
        <BotaoWhatsApp
          mensagem="Olá, Pablo! Quero conversar sobre um projeto."
          texto="Descrever meu problema no WhatsApp"
          className="mt-6"
        />
      </div>
    </section>
  );
}
