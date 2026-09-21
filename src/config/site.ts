// Dados públicos do site num lugar só (§10.4 do plano: o número comercial é público).
// Na Etapa 12 isto passa a vir do export do perfil do Copiloto.
export const site = {
  nome: "Pablo Ortiz",
  url: "https://pabloortiz.dev",
  whatsapp: "5511925848819",
  linkedin: "https://www.linkedin.com/in/pablo-miguel-dias-ortiz/",
  github: "https://github.com/pablomigueldias",
} as const;

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
