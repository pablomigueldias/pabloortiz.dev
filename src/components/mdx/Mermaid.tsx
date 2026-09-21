"use client";

import { useEffect, useId, useState } from "react";

type Props = {
  /** Descrição do diagrama para leitores de tela (obrigatória). */
  titulo: string;
  /** Código Mermaid do diagrama. */
  children: string;
};

// O Mermaid (~1,6 MB) só é baixado quando um post tem diagrama. Até lá, e sem
// JavaScript, o código do diagrama aparece como texto.
export function Mermaid({ titulo, children }: Props) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let cancelado = false;
    const escuro = document.documentElement.classList.contains("dark");

    import("mermaid")
      .then(async ({ default: mermaid }) => {
        // strict: sem HTML nem clique em nós do diagrama, e o SVG sai sanitizado.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: escuro ? "dark" : "default",
        });
        const { svg } = await mermaid.render(id, children.trim());
        if (!cancelado) setSvg(svg);
      })
      .catch(() => {
        if (!cancelado) setErro(true);
      });

    return () => {
      cancelado = true;
    };
  }, [id, children]);

  if (svg) {
    return (
      <figure
        role="img"
        aria-label={titulo}
        className="my-6 overflow-x-auto"
        // SVG gerado pelo Mermaid em securityLevel "strict" (sanitizado pelo DOMPurify).
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <figure className="my-6">
      <pre aria-label={titulo}>
        <code>{children.trim()}</code>
      </pre>
      {erro && <figcaption>Não foi possível desenhar o diagrama.</figcaption>}
    </figure>
  );
}
