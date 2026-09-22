"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { linkWhatsApp, site } from "@/config/site";
import { AlternarTema } from "./AlternarTema";
import {
  IconeBlog,
  IconeContato,
  IconeProjetos,
  IconeServicos,
  IconeSobre,
  IconeCasa,
  IconeFechar,
  IconeGithub,
  IconeLinkedin,
  IconeMenu,
  IconeWhatsapp,
} from "./icones";

// Um item por página que existe: link para página inexistente é pior que menu curto.
const NAVEGACAO = [
  { href: "/", rotulo: "Home", Icone: IconeCasa },
  { href: "/blog", rotulo: "Blog", Icone: IconeBlog },
  { href: "/projetos", rotulo: "Projetos", Icone: IconeProjetos },
  { href: "/servicos", rotulo: "Serviços", Icone: IconeServicos },
  { href: "/sobre", rotulo: "Sobre", Icone: IconeSobre },
  { href: "/contato", rotulo: "Contato", Icone: IconeContato },
] as const;

function ativo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Conteudo({ aoNavegar }: { aoNavegar?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between p-8">
      <div className="text-center">
        <div className="relative mb-6 inline-block">
          <Image
            src="/images/perfil.webp"
            alt="Foto de Pablo Ortiz"
            width={128}
            height={128}
            priority
            className="border-muted hover:border-primary mx-auto h-32 w-32 rounded-full border-4 transition-colors duration-500"
          />
          <span
            aria-hidden
            className="bg-primary border-card absolute right-2 bottom-2 h-4 w-4 rounded-full border-2"
          />
        </div>
        <p className="text-foreground mb-2 text-2xl font-bold tracking-tight">
          {site.nome}
        </p>
        <p className="bg-muted text-muted-foreground border-border inline-block rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
          AI Engineer
        </p>
      </div>

      <nav
        aria-label="Principal"
        className="mt-8 flex flex-1 flex-col justify-center gap-2"
      >
        {NAVEGACAO.map(({ href, rotulo, Icone }) => {
          const atual = ativo(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={aoNavegar}
              aria-current={atual ? "page" : undefined}
              className={`flex items-center gap-4 rounded-xl border-l-4 px-4 py-3 transition-colors ${
                atual
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
              }`}
            >
              <Icone />
              <span className="tracking-wide">{rotulo}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-border mt-auto flex flex-col gap-6 border-t pt-6">
        <a
          href={linkWhatsApp("Olá, Pablo! Vim pelo seu site.")}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          <IconeWhatsapp />
          Fale comigo
        </a>
        <AlternarTema />
        <div className="flex justify-center gap-4">
          {[
            { href: site.github, rotulo: "GitHub", Icone: IconeGithub },
            { href: site.linkedin, rotulo: "LinkedIn", Icone: IconeLinkedin },
          ].map(({ href, rotulo, Icone }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={rotulo}
              className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground border-border flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            >
              <Icone width={18} height={18} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  // No celular: Esc fecha, o foco vai para o painel, o Tab fica preso nele (a página
  // atrás está coberta) e o foco volta ao botão ao fechar.
  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    painelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        return;
      }
      if (e.key !== "Tab" || !painelRef.current) return;
      const focaveis = painelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (!primeiro || !ultimo) return;
      const ativo = document.activeElement;
      if (
        e.shiftKey &&
        (ativo === primeiro || !painelRef.current.contains(ativo))
      ) {
        e.preventDefault();
        ultimo.focus();
      } else if (
        !e.shiftKey &&
        (ativo === ultimo || !painelRef.current.contains(ativo))
      ) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    const botao = botaoRef.current;
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", aoTeclar);
      botao?.focus();
    };
  }, [aberto]);

  return (
    <>
      <aside className="bg-card border-border fixed top-0 left-0 z-40 hidden h-screen w-72 flex-col border-r shadow-2xl lg:flex">
        <Conteudo />
      </aside>

      <header className="bg-background/80 border-border sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="text-foreground font-bold tracking-tight">
          {site.nome}
        </Link>
        <button
          ref={botaoRef}
          type="button"
          onClick={() => setAberto(true)}
          aria-expanded={aberto}
          aria-controls="menu-movel"
          aria-label="Abrir menu"
          className="bg-card border-border text-primary rounded-xl border p-2.5"
        >
          <IconeMenu />
        </button>
      </header>

      {aberto && (
        <div className="lg:hidden">
          <div
            aria-hidden
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div
            id="menu-movel"
            ref={painelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="bg-card border-border fixed top-0 left-0 z-50 h-screen w-80 max-w-[85vw] overflow-y-auto border-r shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
              className="text-muted-foreground hover:text-foreground absolute top-4 right-4 p-2"
            >
              <IconeFechar />
            </button>
            <Conteudo aoNavegar={() => setAberto(false)} />
          </div>
        </div>
      )}
    </>
  );
}
