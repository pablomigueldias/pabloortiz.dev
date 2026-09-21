import Image from "next/image";

type Props = {
  src: string;
  /** Texto alternativo: o que a imagem mostra, para quem não enxerga. Obrigatório. */
  alt: string;
  /** Dimensões reais: evitam que a página "pule" enquanto a imagem carrega (CLS). */
  largura: number;
  altura: number;
  legenda?: string;
};

export function Figure({ src, alt, largura, altura, legenda }: Props) {
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        className="h-auto w-full"
      />
      {legenda && (
        <figcaption className="mt-2 text-center text-sm italic">
          {legenda}
        </figcaption>
      )}
    </figure>
  );
}
