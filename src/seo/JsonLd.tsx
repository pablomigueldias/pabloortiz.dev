// Dados estruturados (schema.org) para o Google. `<` escapado: um texto com
// "</script>" não fecha a tag antes da hora.
export function JsonLd({ dados }: { dados: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...dados,
        }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
