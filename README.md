# pabloortiz.dev

Blog e portfólio de Pablo Ortiz: IA aplicada, LLMs e dados.

> Em construção. O site no ar em `pabloortiz.dev` ainda é a versão antiga.

## Stack

Next.js 16 (App Router) · TypeScript estrito · Tailwind CSS 4 · Cloudflare Workers (via OpenNext, em breve)

## Rodando local

Requer Node 24 (`.nvmrc`).

```bash
npm ci        # instala e liga o hook de pre-commit (gitleaks)
npm run dev   # http://localhost:3000
```

| Comando             | O que faz                            |
| ------------------- | ------------------------------------ |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | gera os tipos de rota e roda o `tsc` |
| `npm run format`    | Prettier                             |
| `npm run build`     | build de produção                    |

## Como escrever um post

1. Crie `content/blog/<slug>.mdx`. O nome do arquivo é a URL: minúsculas, sem acento, com hífens (`busca-hibrida-pgvector.mdx` → `/blog/busca-hibrida-pgvector`).
2. Comece pelo frontmatter:

   ```yaml
   ---
   titulo: "Busca híbrida no pgvector" # 10 a 70 caracteres
   descricao: "Por que só a busca vetorial não acha a palavra exata, e como a fusão RRF resolve." # 50 a 160
   data: 2026-10-01 # AAAA-MM-DD. Data futura = agendado
   pilar: ia-llms # ia-llms | dados-ml
   tags: [rag, pgvector] # até 5, da lista em src/content/schema.ts
   draft: true # tire quando for publicar
   origem: # opcional: de onde veio (caminho relativo)
     - copiloto: "docs/fase02.md"
   ---
   ```

3. Escreva em Markdown. Rode `npm run dev`: os rascunhos aparecem em `/blog` com a marca `[rascunho]`.
4. Abra um PR. O CI valida o frontmatter, as fórmulas e a privacidade. Merge = publicado.

Frontmatter errado para o build com a lista de todos os erros, em português.

### Recursos

| Recurso             | Como usar                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Código com destaque | ` ```python title="busca.py" {3-4} ` (nome do arquivo e linhas destacadas são opcionais)                               |
| Matemática          | `$inline$` e `$$` em bloco (KaTeX). Fórmula inválida quebra o build                                                    |
| Diagrama            | `<Mermaid titulo="descrição para leitor de tela">` com o código entre `` {` `` e `` `} ``                              |
| Destaque            | `<Callout tipo="nota \| dica \| cuidado" titulo="opcional">texto</Callout>`                                            |
| Imagem              | `<Figure src="/blog/<slug>/imagem.webp" alt="o que a imagem mostra" largura={1200} altura={630} legenda="opcional" />` |
| Chamada no fim      | `<CTA assunto="busca híbrida" />` (um por post, abre o WhatsApp com a mensagem pronta)                                 |

Imagens ficam em `public/blog/<slug>/`, com as dimensões reais e sem metadados (EXIF).

> **`draft: true` não é segredo.** O repositório é público: rascunho commitado já pode ser lido no GitHub. Texto que ainda não pode ser visto fica fora do repo.

## Segurança e privacidade

O repositório é público. Três barreiras impedem que segredo ou dado pessoal entre:

1. `.gitignore` bloqueia `.env*`, chaves e dumps.
2. Pre-commit roda o [gitleaks](https://github.com/gitleaks/gitleaks) com as regras de [`.gitleaks.toml`](./.gitleaks.toml): as padrão, mais telefone, e-mail pessoal, CPF, caminho local e URL de banco com senha.
3. O CI roda o gitleaks de novo, no histórico inteiro. A `main` só aceita merge com o CI verde.

O site só é indexado com `SITE_ENV=production`. Preview e build local saem com `noindex`.

Achou um problema de segurança? Veja [SECURITY.md](./SECURITY.md).

## Licença

- Código: [MIT](./LICENSE)
- Conteúdo dos posts (`content/`): [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.pt_BR). Pode reaproveitar citando a fonte, sem uso comercial.
