// Dados públicos do perfil: a lista branca da §10.4 do plano (nunca telefone ou
// e-mail pessoal). Na Etapa 12 este arquivo passa a ser gerado a partir do
// perfil_mestre.json do Copiloto.
import { site } from "@/config/site";

export const perfil = {
  nome: site.nome,
  nomeCompleto: "Pablo Miguel Dias Ortiz",
  titulo: "AI Engineer · Python, LLMs e Dados",
  frase:
    "Construo sistemas de IA que rodam todo dia: RAG, LLMs e pipelines de dados, medidos e testados.",
  resumo:
    "Desenvolvedor Python focado em LLMs, RAG e pipelines de dados. Meu projeto principal, o Copiloto, responde sobre tudo o que estudo citando a fonte e roda em 6 GB de VRAM. Escrevo aqui o que medi, o que errei e o que funcionou.",
  cidade: "Santo André, SP",
  especialidades: [
    {
      area: "IA aplicada & LLMs",
      itens: [
        "RAG e busca híbrida",
        "LLM local (Ollama) e APIs",
        "Agentes com aprovação humana",
        "Avaliação e observabilidade",
      ],
    },
    {
      area: "Dados & Backend",
      itens: [
        "Python, FastAPI, SQLAlchemy 2.0",
        "PostgreSQL e pgvector",
        "Pipelines de ingestão",
        "Machine learning (scikit-learn)",
      ],
    },
    {
      area: "Engenharia",
      itens: [
        "Testes (pytest, Playwright)",
        "Migrations (Alembic)",
        "Docker",
        "CI e deploy",
      ],
    },
  ],
  experiencias: [
    {
      cargo: "Desenvolvedor — Projetos de IA e Automação",
      empresa: "Autônomo",
      periodo: "10/2025 – atual",
      resumo:
        "Sistemas de IA de ponta a ponta. Criei o Copiloto (RAG local, gateway de LLM, observabilidade) e orquestrei agentes na AWS com Step Functions e Bedrock.",
    },
    {
      cargo: "Analista de Sistemas",
      empresa: "Sechat",
      periodo: "04/2025 – 09/2025",
      resumo:
        "Administrei o Zoho One de uma operação de 16 pessoas (CRM, contratos, permissões) e mantive 5 sites no ar, entre eles o principal em React/Next.js.",
    },
  ],
  formacao: [
    {
      curso: "Tecnologia em Análise e Desenvolvimento de Sistemas",
      instituicao: "Faculdade Impacta",
      periodo: "08/2024 – 12/2026",
    },
  ],
  // As mais ligadas aos pilares. Lista completa no LinkedIn.
  certificacoes: [
    {
      nome: "Formação Completa em Inteligência Artificial 2026",
      emissor: "Udemy",
      carga: "33h30",
    },
    {
      nome: "Bootcamp AWS — Agentes de IA em Campo",
      emissor: "AWS / DIO",
      carga: "18h",
    },
    {
      nome: "SQL 2016 — Programação em T-SQL",
      emissor: "Impacta",
      carga: "22h",
    },
    {
      nome: "SQL — Criando Sistemas de Banco de Dados",
      emissor: "Impacta",
      carga: "22h",
    },
    {
      nome: "Fundamentos de Machine Learning na Prática",
      emissor: "Impacta",
      carga: "6h",
    },
    {
      nome: "Como Criar Agentes de IA: Avançado",
      emissor: "LinkedIn Learning",
      carga: "1h14",
    },
  ],
} as const;
