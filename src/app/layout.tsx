import type { Metadata } from "next";
import { Rodape } from "@/components/layout/Rodape";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pabloortiz.dev"),
  title: "Pablo Ortiz",
  description: "IA aplicada, LLMs e dados. Em construção.",
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
      </body>
    </html>
  );
}
