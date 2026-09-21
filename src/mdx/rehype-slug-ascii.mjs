// Gera o id dos headings sem acento ("Matemática" → "matematica"), para que o link
// compartilhado não vire "#matem%C3%A1tica". Substitui o rehype-slug, que mantém o
// acento e não aceita outro gerador por opção serializável (exigência do Turbopack).

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

function texto(no) {
  if (no.type === "text") return no.value;
  return (no.children ?? []).map(texto).join("");
}

export function slugAscii(valor) {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function rehypeSlugAscii() {
  return (arvore) => {
    const usados = new Map();
    const visitar = (no) => {
      if (
        no.type === "element" &&
        HEADINGS.has(no.tagName) &&
        !no.properties?.id
      ) {
        const base = slugAscii(texto(no)) || "secao";
        const n = usados.get(base) ?? 0;
        usados.set(base, n + 1);
        no.properties = {
          ...no.properties,
          id: n === 0 ? base : `${base}-${n}`,
        };
      }
      for (const filho of no.children ?? []) visitar(filho);
    };
    visitar(arvore);
  };
}
