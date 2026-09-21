import type { MDXComponents } from "mdx/types";
import { Mermaid } from "@/components/mdx/Mermaid";

// Componentes disponíveis em todo .mdx sem precisar de import.
const components: MDXComponents = {
  Mermaid,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
