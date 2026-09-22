import { site } from "@/config/site";
import { perfil } from "@/content/perfil";

// Um @id por entidade: as páginas referenciam a mesma pessoa em vez de repeti-la.
export const ID_PESSOA = `${site.url}/#pessoa`;
export const ID_SITE = `${site.url}/#site`;

export const url = (caminho: string) =>
  caminho === "/" ? `${site.url}/` : `${site.url}${caminho}`;

export function pessoa() {
  return {
    "@type": "Person",
    "@id": ID_PESSOA,
    name: perfil.nomeCompleto,
    alternateName: site.nome,
    url: url("/sobre"),
    image: url("/images/perfil.webp"),
    jobTitle: perfil.titulo,
    description: perfil.resumo,
    email: `mailto:${site.email}`,
    sameAs: [site.linkedin, site.github],
    knowsAbout: perfil.especialidades.flatMap((e) => e.itens),
    alumniOf: perfil.formacao.map((f) => ({
      "@type": "CollegeOrUniversity",
      name: f.instituicao,
    })),
  };
}

export function siteWeb() {
  return {
    "@type": "WebSite",
    "@id": ID_SITE,
    name: site.nome,
    url: url("/"),
    inLanguage: "pt-BR",
    author: { "@id": ID_PESSOA },
  };
}

// Trilha de navegação: [["Blog", "/blog"], ["Título", "/blog/slug"]].
export function trilha(itens: [nome: string, caminho: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Início", "/"] as const, ...itens].map(
      ([name, caminho], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name,
        item: url(caminho),
      }),
    ),
  };
}
