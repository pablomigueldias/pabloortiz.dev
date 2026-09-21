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
