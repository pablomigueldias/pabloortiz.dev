// Dados públicos do site num lugar só (§10.4 do plano: o número comercial é público).
// Na Etapa 12 isto passa a vir do export do perfil do Copiloto.
export const site = {
  nome: "Pablo Ortiz",
  url: "https://pabloortiz.dev",
  // Único e-mail público (§10.4). Chega na caixa da Hostinger.
  email: "contato@pabloortiz.dev",
  whatsapp: "5511925848819",
  linkedin: "https://www.linkedin.com/in/pablo-miguel-dias-ortiz/",
  github: "https://github.com/pablomigueldias",
  // Formulário de contato. A site key do Turnstile é pública (vai no HTML); o
  // secret e a chave do Resend ficam só nos secrets do Worker.
  // Sem a site key (null), produção mostra WhatsApp e e-mail no lugar do formulário.
  turnstileSiteKey: "0x4AAAAAAFAAKjuRymGtfh4q" as string | null,
  // Remetente dos e-mails do formulário: precisa ser do domínio verificado no Resend.
  remetenteFormulario: "Site pabloortiz.dev <site@pabloortiz.dev>",
} as const;

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
