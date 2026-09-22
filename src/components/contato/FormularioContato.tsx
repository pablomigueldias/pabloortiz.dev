"use client";

import { useEffect, useRef, useState } from "react";
import { LIMITES } from "@/contato/formulario";

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

type Estado =
  | { tipo: "editando" }
  | { tipo: "enviando" }
  | { tipo: "enviado" }
  | { tipo: "erro"; mensagem: string };

const campo =
  "bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-xl border px-4 py-3 outline-none";

// O script do Turnstile só é baixado nesta página, quando o formulário aparece.
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

export function FormularioContato({ siteKey }: { siteKey: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [turnstileFalhou, setTurnstileFalhou] = useState(false);
  const [estado, setEstado] = useState<Estado>({ tipo: "editando" });

  useEffect(() => {
    let ativo = true;
    carregarTurnstile()
      .then((t) => {
        if (!ativo || !caixa.current) return;
        widget.current = t.render(caixa.current, {
          sitekey: siteKey,
          callback: setToken,
          "expired-callback": () => setToken(""),
          "error-callback": () => setTurnstileFalhou(true),
          language: "pt-br",
          theme: "auto",
          action: "contato",
        });
      })
      .catch(() => {
        if (ativo) setTurnstileFalhou(true);
      });
    return () => {
      ativo = false;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget));
    setEstado({ tipo: "enviando" });
    try {
      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, token }),
      });
      const corpo = (await resposta.json()) as { ok: boolean; erro?: string };
      if (corpo.ok) {
        setEstado({ tipo: "enviado" });
        return;
      }
      setEstado({ tipo: "erro", mensagem: corpo.erro ?? "O envio falhou." });
    } catch {
      setEstado({
        tipo: "erro",
        mensagem: "Sem conexão. Confira a internet e tente de novo.",
      });
    }
    // O token do Turnstile vale uma vez só: pede outro para a próxima tentativa.
    setToken("");
    if (widget.current) window.turnstile?.reset(widget.current);
  }

  if (estado.tipo === "enviado") {
    return (
      <div
        role="status"
        className="border-primary/30 bg-primary/5 rounded-xl border p-6"
      >
        <p className="text-foreground font-semibold">Mensagem enviada.</p>
        <p className="text-muted-foreground mt-2">
          Obrigado! Respondo no e-mail que você informou.
        </p>
      </div>
    );
  }

  const enviando = estado.tipo === "enviando";

  return (
    <form onSubmit={enviar} className="relative flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Nome
          <input
            name="nome"
            required
            autoComplete="name"
            minLength={LIMITES.nome.min}
            maxLength={LIMITES.nome.max}
            className={campo}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          E-mail
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={LIMITES.email.max}
            className={campo}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Mensagem
        <textarea
          name="mensagem"
          required
          rows={6}
          minLength={LIMITES.mensagem.min}
          maxLength={LIMITES.mensagem.max}
          placeholder="Vaga, projeto ou dúvida. Se for projeto, conte o que precisa e para quando."
          className={`${campo} resize-y`}
        />
      </label>

      {/* Honeypot: fora da tela e fora do Tab. Quem preenche é robô. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Não preencha
          <input name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div ref={caixa} className="min-h-[65px]" />
      {turnstileFalhou && (
        <p className="text-sm text-amber-700 dark:text-amber-400">
          A verificação anti-robô não carregou. Um bloqueador de conteúdo pode
          estar impedindo. Se preferir, use o WhatsApp ou o e-mail acima.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={enviando || !token}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Enviar mensagem"}
        </button>
        <p aria-live="polite" className="text-sm">
          {estado.tipo === "erro" && (
            <span className="text-red-700 dark:text-red-400">
              {estado.mensagem}
            </span>
          )}
        </p>
      </div>

      <p className="text-muted-foreground text-xs">
        Uso seus dados só para responder. Nada fica guardado no site. Veja a{" "}
        <a href="/privacidade" className="hover:text-primary underline">
          página de privacidade
        </a>
        .
      </p>
    </form>
  );
}
