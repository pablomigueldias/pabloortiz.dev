"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Estado =
  | { tipo: "lendo" }
  | { tipo: "sem-link" }
  | { tipo: "pronto"; token: string }
  | { tipo: "confirmando"; token: string }
  | { tipo: "confirmado" }
  | { tipo: "erro"; token: string; mensagem: string };

// A página é estática: o token vem da URL, lido aqui no navegador. Logo depois
// ele sai da barra de endereço, para não ficar no histórico nem ir junto se a
// pessoa copiar o link da página.
export function ConfirmarInscricao() {
  const [estado, setEstado] = useState<Estado>({ tipo: "lendo" });
  // O efeito roda duas vezes em dev (StrictMode), e a segunda já acharia a URL
  // limpa pela primeira. Lê uma vez só.
  const lido = useRef(false);

  useEffect(() => {
    if (lido.current) return;
    lido.current = true;
    const token = new URLSearchParams(window.location.search).get("t");
    window.history.replaceState(null, "", window.location.pathname);
    setEstado(token ? { tipo: "pronto", token } : { tipo: "sem-link" });
  }, []);

  async function confirmar(token: string) {
    setEstado({ tipo: "confirmando", token });
    try {
      const resposta = await fetch("/api/newsletter/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const corpo = (await resposta.json()) as { ok: boolean; erro?: string };
      setEstado(
        corpo.ok
          ? { tipo: "confirmado" }
          : {
              tipo: "erro",
              token,
              mensagem: corpo.erro ?? "A confirmação falhou.",
            },
      );
    } catch {
      setEstado({
        tipo: "erro",
        token,
        mensagem: "Sem conexão. Confira a internet e tente de novo.",
      });
    }
  }

  if (estado.tipo === "lendo") return null;

  if (estado.tipo === "sem-link")
    return (
      <p className="text-muted-foreground">
        Esta página confirma a inscrição a partir do link que vai por e-mail.
        Para se inscrever, use a{" "}
        <Link href="/newsletter" className="hover:text-primary underline">
          página da newsletter
        </Link>
        .
      </p>
    );

  if (estado.tipo === "confirmado")
    return (
      <div
        role="status"
        className="border-primary/30 bg-primary/5 rounded-xl border p-6"
      >
        <p className="text-foreground font-semibold">Inscrição confirmada.</p>
        <p className="text-muted-foreground mt-2">
          Obrigado! Mandei um e-mail de boas-vindas. As edições chegam a cada 15
          dias.
        </p>
      </div>
    );

  const confirmando = estado.tipo === "confirmando";
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Um clique para começar a receber. Sem ele, seu e-mail não entra na
        lista.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => confirmar(estado.token)}
          disabled={confirmando}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {confirmando ? "Confirmando…" : "Confirmar inscrição"}
        </button>
        <p aria-live="polite" className="text-sm">
          {estado.tipo === "erro" && (
            <span className="text-red-700 dark:text-red-400">
              {estado.mensagem}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
