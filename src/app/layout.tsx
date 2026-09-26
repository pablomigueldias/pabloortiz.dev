import type { Metadata } from "next";
import { MedicaoCliques } from "@/components/layout/MedicaoCliques";
import { Rodape } from "@/components/layout/Rodape";
import { Sidebar } from "@/components/layout/Sidebar";
import { site } from "@/config/site";
import { perfil } from "@/content/perfil";
import { IMAGEM_PADRAO } from "@/seo/metadata";
import "./globals.css";

// Padrão do site. Cada página define o próprio título, descrição e canônica com
// metadataDaPagina (src/seo/metadata.ts).
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} · ${perfil.titulo}`,
    template: `%s · ${site.nome}`,
  },
  description: perfil.frase,
  authors: [{ name: perfil.nomeCompleto, url: `${site.url}/sobre` }],
  creator: perfil.nomeCompleto,
  openGraph: {
    siteName: site.nome,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: IMAGEM_PADRAO.caminho,
        width: 1200,
        height: 630,
        alt: IMAGEM_PADRAO.alt,
      },
    ],
  },
  twitter: { card: "summary_large_image", images: [IMAGEM_PADRAO.caminho] },
};

// Aplica o tema antes de pintar a página (sem "flash" branco). Escolha salva > preferência
// do sistema. Sem localStorage (aba privada), fica o escuro, que é o padrão do site.
const scriptTema = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("tema");var e=t?t==="escuro":window.matchMedia("(prefers-color-scheme: dark)").matches;d.classList.toggle("dark",e)}catch(_){d.classList.add("dark")}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${site.nome} · Blog`}
          href="/rss.xml"
        />
      </head>
      <body className="min-h-full">
        <a
          href="#conteudo"
          className="bg-primary text-primary-foreground sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Pular para o conteúdo
        </a>
        <Sidebar />
        <div className="flex min-h-screen flex-col lg:ml-72">
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Rodape />
        </div>
        <MedicaoCliques />
      </body>
    </html>
  );
}
