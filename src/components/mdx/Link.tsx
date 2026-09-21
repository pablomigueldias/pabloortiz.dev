import NextLink from "next/link";
import type { ComponentProps } from "react";

// Link interno: navegação do Next. Externo: nova aba, sem repassar a origem.
export function Link({ href = "", children, ...resto }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <NextLink href={href} {...resto}>
        {children}
      </NextLink>
    );
  }
  return (
    <a href={href} rel="noopener noreferrer" target="_blank" {...resto}>
      {children}
    </a>
  );
}
