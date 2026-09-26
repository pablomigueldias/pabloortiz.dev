"use client";

import { useEffect } from "react";

// Conta cliques em links para o WhatsApp e nos botões marcados com
// data-evento (ex.: "raiox_clique"). Um ouvinte só, no documento inteiro: o
// link do menu, o do post e o da /servicos são contados sem cada um saber.
//
// Vai só o nome do evento, a página e os utm_* da URL. sendBeacon não segura a
// navegação e não manda cookie de terceiro; se falhar, o clique segue normal.
export function MedicaoCliques() {
  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      const alvo = (e.target as Element | null)?.closest?.("a");
      if (!alvo) return;
      const nome =
        alvo.getAttribute("data-evento") ??
        (alvo.href.startsWith("https://wa.me/") ? "whatsapp_clique" : null);
      if (!nome) return;

      const params = new URLSearchParams(window.location.search);
      const corpo = JSON.stringify({
        nome,
        caminho: window.location.pathname,
        utm_source: params.get("utm_source") ?? undefined,
        utm_medium: params.get("utm_medium") ?? undefined,
        utm_campaign: params.get("utm_campaign") ?? undefined,
      });
      try {
        navigator.sendBeacon(
          "/api/evento",
          new Blob([corpo], { type: "application/json" }),
        );
      } catch {
        // Medir não pode atrapalhar o clique.
      }
    }
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, []);
  return null;
}
