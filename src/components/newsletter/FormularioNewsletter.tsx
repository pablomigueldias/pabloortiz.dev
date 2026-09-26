"use client";

import { useState } from "react";
import { useTurnstile } from "@/components/useTurnstile";
import { LIMITES_NEWSLETTER } from "@/newsletter/formulario";

type Estado =
  | { tipo: "editando" }
  | { tipo: "enviando" }
  | { tipo: "enviado" }
  | { tipo: "erro"; mensagem: string };

const campo =
  "bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-xl border px-4 py-3 outline-none";

export function FormularioNewsletter({ siteKey }: { siteKey: string }) {
  const { caixa, token, falhou, reiniciar } = useTurnstile(
    siteKey,
    "newsletter",
  );
  const [estado, setEstado] = useState<Estado>({ tipo: "editando" });

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget));
    setEstado({ tipo: "enviando" });
    try {
      const resposta = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, token }),
      });
      const corpo = (await resposta.json()) as { ok: boolean; erro?: string };
      if (corpo.ok) {
        setEstado({ tipo: "enviado" });
        return;
      }
      setEstado({
        tipo: "erro",
        mensagem: corpo.erro ?? "A inscrição falhou.",
      });
    } catch {
      setEstado({
        tipo: "erro",
        mensagem: "Sem conexão. Confira a internet e tente de novo.",
      });
    }
    reiniciar();
  }

  if (estado.tipo === "enviado") {
    return (
      <div
        role="status"
        className="border-primary/30 bg-primary/5 rounded-xl border p-6"
      >
        <p className="text-foreground font-semibold">Falta um passo.</p>
        <p className="text-muted-foreground mt-2">
          Mandei um e-mail com o link de confirmação. Abra e clique em
          &ldquo;Confirmar inscrição&rdquo;. Se não chegar em alguns minutos,
          olhe o spam.
        </p>
      </div>
    );
  }

  const enviando = estado.tipo === "enviando";

  return (
    <form onSubmit={enviar} className="relative flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-sm font-medium">
        Seu e-mail
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={LIMITES_NEWSLETTER.email.max}
          className={campo}
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
      {falhou && (
        <p className="text-sm text-amber-700 dark:text-amber-400">
          A verificação anti-robô não carregou. Um bloqueador de conteúdo pode
          estar impedindo.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={enviando || !token}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Quero receber"}
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
        Uso seu e-mail só para mandar a newsletter, e você sai com um clique em
        qualquer edição. Veja a{" "}
        <a href="/privacidade" className="hover:text-primary underline">
          página de privacidade
        </a>
        .
      </p>
    </form>
  );
}
