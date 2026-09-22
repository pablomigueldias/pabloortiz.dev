import type { ItemSumario } from "@/content/schema";

// Só aparece com 3 ou mais seções: num post curto, o sumário é ruído.
export function Sumario({ itens }: { itens: ItemSumario[] }) {
  if (itens.length < 3) return null;

  return (
    <nav
      aria-label="Sumário"
      data-pagefind-ignore
      className="bg-card border-border mb-12 rounded-xl border"
    >
      <details open className="group">
        <summary className="text-foreground cursor-pointer px-6 py-4 text-sm font-bold tracking-wider uppercase select-none">
          Neste post
        </summary>
        <ol className="flex flex-col gap-2 px-6 pb-5 text-sm">
          {itens.map((item) => (
            <li key={item.id} className={item.nivel === 3 ? "pl-4" : ""}>
              <a
                href={`#${item.id}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.texto}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
