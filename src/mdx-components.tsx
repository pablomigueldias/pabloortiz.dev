import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { CTA } from "@/components/mdx/CTA";
import { Figure } from "@/components/mdx/Figure";
import { Link } from "@/components/mdx/Link";
import { Mermaid } from "@/components/mdx/Mermaid";

// Checkbox de lista de tarefas (GFM) sai sem rótulo: o leitor de tela não sabe o
// que ela é. O texto do item vem logo depois; o rótulo diz o estado.
function Entrada(props: React.ComponentProps<"input">) {
  if (props.type !== "checkbox") return <input {...props} />;
  return (
    <input
      {...props}
      aria-label={props.checked ? "Item concluído" : "Item pendente"}
    />
  );
}

// Componentes disponíveis em todo .mdx sem precisar de import.
const components: MDXComponents = {
  a: Link,
  input: Entrada,
  Callout,
  CTA,
  Figure,
  Mermaid,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
