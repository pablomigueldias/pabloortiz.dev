"use client";

import { useEffect, useRef, useState } from "react";

// O widget do Turnstile (anti-robô), usado pelos formulários de /contato e
// /newsletter. O script só é baixado na página que tem formulário.

// Só o que usamos da API do Turnstile (renderização explícita).
type Turnstile = {
  render: (
    elemento: HTMLElement,
    opcoes: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      language: string;
      theme: "auto";
      action: string;
    },
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const SCRIPT_TURNSTILE =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function carregarTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_TURNSTILE;
    script.async = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error());
    script.onerror = () => reject(new Error());
    document.head.append(script);
  });
}

/**
 * `caixa` vai no `ref` do div onde o widget aparece; `token` fica vazio até a
 * verificação passar. `reiniciar` pede um token novo: cada um vale uma vez só.
 */
export function useTurnstile(siteKey: string, action: string) {
  const caixa = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let ativo = true;
    carregarTurnstile()
      .then((t) => {
        if (!ativo || !caixa.current) return;
        widget.current = t.render(caixa.current, {
          sitekey: siteKey,
          callback: setToken,
          "expired-callback": () => setToken(""),
          "error-callback": () => setFalhou(true),
          language: "pt-br",
          theme: "auto",
          action,
        });
      })
      .catch(() => {
        if (ativo) setFalhou(true);
      });
    return () => {
      ativo = false;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, action]);

  function reiniciar() {
    setToken("");
    if (widget.current) window.turnstile?.reset(widget.current);
  }

  return { caixa, token, falhou, reiniciar };
}
