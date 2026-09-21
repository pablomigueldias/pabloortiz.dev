"use client";

import { useSyncExternalStore } from "react";
import { IconeLua, IconeSol } from "./icones";

// O tema é a classe "dark" no <html>, aplicada pelo script do layout antes de pintar.
// Este componente só lê e alterna essa classe.
function assinar(aoMudar: () => void) {
  const observador = new MutationObserver(aoMudar);
  observador.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observador.disconnect();
}

const lerEscuro = () => document.documentElement.classList.contains("dark");
const noServidor = () => null; // no HTML estático o tema ainda não é conhecido

export function AlternarTema() {
  const escuro = useSyncExternalStore(assinar, lerEscuro, noServidor);

  function alternar() {
    const novo = !lerEscuro();
    document.documentElement.classList.toggle("dark", novo);
    try {
      localStorage.setItem("tema", novo ? "escuro" : "claro");
    } catch {
      // Sem localStorage (aba privada): o tema vale só nesta visita.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className="bg-muted text-foreground hover:bg-border flex w-full items-center justify-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors"
    >
      {escuro === false ? <IconeLua /> : <IconeSol />}
      <span>{escuro === false ? "Modo escuro" : "Modo claro"}</span>
    </button>
  );
}
