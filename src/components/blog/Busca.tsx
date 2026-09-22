"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";

// Só o que usamos da API do Pagefind (https://pagefind.app/docs/api/).
type Resultado = {
  url: string;
  excerpt: string;
  meta: { title?: string; tipo?: string };
};
type Pagefind = {
  init: () => Promise<void>;
  debouncedSearch: (
    consulta: string,
    opcoes?: object,
    esperaMs?: number,
  ) => Promise<{ results: { data: () => Promise<Resultado> }[] } | null>;
};

type Estado = "ocioso" | "buscando" | "pronto" | "indisponivel";

const MAX_RESULTADOS = 8;
// O arquivo só existe depois do build (scripts/gerar-busca.ts). A URL é montada no
// navegador: com o caminho literal, o esbuild da OpenNext tenta resolvê-lo no build.
const CAMINHO_PAGEFIND = "/pagefind/pagefind.js";

export function Busca() {
  const id = useId();
  const pagefind = useRef<Promise<Pagefind> | null>(null);
  const [consulta, setConsulta] = useState("");
  const [estado, setEstado] = useState<Estado>("ocioso");
  const [resultados, setResultados] = useState<Resultado[]>([]);

  // Carrega o Pagefind (JS + WebAssembly) só quando alguém vai buscar.
  function carregar(): Promise<Pagefind> {
    pagefind.current ??= import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */
      new URL(CAMINHO_PAGEFIND, window.location.origin).href
    ).then(async (m: Pagefind) => {
      await m.init();
      return m;
    });
    return pagefind.current;
  }

  async function buscar(texto: string) {
    setConsulta(texto);
    if (!texto.trim()) {
      setEstado("ocioso");
      setResultados([]);
      return;
    }
    setEstado("buscando");
    try {
      const busca = await (await carregar()).debouncedSearch(texto, {}, 250);
      if (!busca) return; // outra tecla chegou antes: esta busca foi descartada
      setResultados(
        await Promise.all(
          busca.results.slice(0, MAX_RESULTADOS).map((r) => r.data()),
        ),
      );
      setEstado("pronto");
    } catch {
      pagefind.current = null;
      setEstado("indisponivel");
    }
  }

  return (
    <search className="mt-10" data-pagefind-ignore>
      <label htmlFor={id} className="sr-only">
        Buscar nos posts e projetos
      </label>
      <input
        id={id}
        type="search"
        value={consulta}
        placeholder="Buscar nos posts e projetos…"
        autoComplete="off"
        spellCheck={false}
        onFocus={() => void carregar().catch(() => undefined)}
        onChange={(e) => void buscar(e.target.value)}
        className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-xl border px-5 py-3 outline-none"
      />

      <div aria-live="polite" className="text-muted-foreground mt-3 text-sm">
        {estado === "indisponivel" &&
          "A busca não está disponível agora. No npm run dev ela só funciona depois de um npm run build."}
        {estado === "pronto" &&
          (resultados.length === 0
            ? `Nada encontrado para “${consulta}”.`
            : `${resultados.length} resultado${resultados.length > 1 ? "s" : ""}`)}
      </div>

      {estado === "pronto" && resultados.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3">
          {resultados.map((r) => (
            <li key={r.url}>
              <Link
                href={r.url}
                className="group bg-card border-border hover:border-primary/50 block rounded-xl border p-5 transition-colors"
              >
                {r.meta.tipo && (
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">
                    {r.meta.tipo}
                  </span>
                )}
                <p className="text-card-foreground group-hover:text-primary mt-1 font-bold transition-colors">
                  {r.meta.title ?? r.url}
                </p>
                {/* Trecho gerado pelo Pagefind a partir do nosso próprio HTML, com <mark> nos termos. */}
                <p
                  className="text-muted-foreground [&_mark]:bg-primary/20 [&_mark]:text-foreground mt-2 text-sm leading-relaxed [&_mark]:rounded [&_mark]:px-0.5"
                  dangerouslySetInnerHTML={{ __html: r.excerpt }}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </search>
  );
}
