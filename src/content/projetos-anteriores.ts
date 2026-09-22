import type { Frontmatter } from "./schema";

// Projetos antigos: cards simples, sem página própria. O foco hoje é o Copiloto;
// estes ganham case quando forem revisados.
export type ProjetoAnterior = {
  nome: string;
  descricao: string;
  pilar: Frontmatter["pilar"];
  stack: string[];
  repo: string;
};

export const projetosAnteriores: ProjetoAnterior[] = [
  {
    nome: "Churn Prediction",
    descricao:
      "Previsão de churn com o custo de cada erro modelado: perder um cliente custa 15 vezes mais que uma ação de retenção à toa, então o modelo prioriza o recall.",
    pilar: "dados-ml",
    stack: ["Python", "scikit-learn", "pandas"],
    repo: "https://github.com/pablomigueldias/churn-prediction",
  },
  {
    nome: "Prompt chaining na AWS",
    descricao:
      "Três chamadas encadeadas ao Claude 3 Haiku via Bedrock, orquestradas por Step Functions, sem Lambda e com o estado passado por JSONata.",
    pilar: "ia-llms",
    stack: ["AWS Step Functions", "Amazon Bedrock", "JSONata"],
    repo: "https://github.com/pablomigueldias/projeto-generative-aws",
  },
  {
    nome: "Analisador de Opiniões (PT-BR)",
    descricao:
      'Sentimento e aspectos ("bateria", "preço", "tela") em opiniões em português, com BERTweet PT-BR e spaCy, rodando offline.',
    pilar: "ia-llms",
    stack: ["Python", "spaCy", "Transformers"],
    repo: "https://github.com/pablomigueldias/analisador-opinioes",
  },
  {
    nome: "Fraude Pipeline",
    descricao:
      "Detecção de transações fraudulentas de ponta a ponta: ETL, Random Forest, API de predição e dashboard de alertas.",
    pilar: "dados-ml",
    stack: ["Python", "scikit-learn", "FastAPI", "Streamlit"],
    repo: "https://github.com/pablomigueldias/fraude-pipeline",
  },
];
