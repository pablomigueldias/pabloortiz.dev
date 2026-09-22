import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { perfil } from "@/content/perfil";

export function BioAutor() {
  return (
    <aside
      aria-label="Sobre o autor"
      data-pagefind-ignore
      className="bg-card border-border mt-16 flex flex-col gap-5 rounded-xl border p-6 sm:flex-row sm:items-start"
    >
      <Image
        src="/images/perfil.webp"
        alt="Foto de Pablo Ortiz"
        width={72}
        height={72}
        className="border-muted h-18 w-18 shrink-0 rounded-full border-2"
      />
      <div>
        <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Escrito por
        </p>
        <p className="text-card-foreground mt-1 text-lg font-bold">
          {perfil.nome}
        </p>
        <p className="text-primary text-sm font-medium">{perfil.titulo}</p>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          {perfil.frase}
        </p>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <Link href="/sobre" className="text-primary hover:underline">
            Sobre mim
          </Link>
          <a
            href={site.linkedin}
            rel="noopener noreferrer"
            target="_blank"
            className="text-primary hover:underline"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            rel="noopener noreferrer"
            target="_blank"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </aside>
  );
}
