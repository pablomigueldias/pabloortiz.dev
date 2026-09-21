import type { MDXComponents } from "mdx/types";

// Obrigatório para o @next/mdx no App Router. Os componentes próprios entram no 3.7.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
