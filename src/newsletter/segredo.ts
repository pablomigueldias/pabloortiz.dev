import { dev } from "@/servidor/protecao";

// Segredo do HMAC do link de confirmação (secret NEWSLETTER_SEGREDO do Worker).
// Trocar o segredo invalida os links ainda não clicados, e só isso: ninguém
// inscrito é afetado. No `next dev`, um fixo, para dar para testar sem configurar.
export function segredoDaNewsletter(): string | undefined {
  return (
    process.env.NEWSLETTER_SEGREDO ?? (dev ? "segredo-so-de-dev" : undefined)
  );
}
