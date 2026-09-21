import type { ReactNode } from "react";

const ROTULOS = { nota: "Nota", dica: "Dica", cuidado: "Cuidado" } as const;

type Props = {
  tipo?: keyof typeof ROTULOS;
  /** Título opcional. Sem ele, usa o rótulo do tipo. */
  titulo?: string;
  children: ReactNode;
};

// Equivalente ao callout "> [!resumo]" do Obsidian. Visual definitivo na Etapa 2.
export function Callout({ tipo = "nota", titulo, children }: Props) {
  return (
    <aside
      role="note"
      data-callout={tipo}
      className="my-6 border-l-4 px-4 py-2"
    >
      <p className="font-semibold">{titulo ?? ROTULOS[tipo]}</p>
      <div>{children}</div>
    </aside>
  );
}
