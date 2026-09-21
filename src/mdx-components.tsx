import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { CTA } from "@/components/mdx/CTA";
import { Figure } from "@/components/mdx/Figure";
import { Link } from "@/components/mdx/Link";
import { Mermaid } from "@/components/mdx/Mermaid";

// Componentes disponíveis em todo .mdx sem precisar de import.
const components: MDXComponents = {
  a: Link,
  Callout,
  CTA,
  Figure,
  Mermaid,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
