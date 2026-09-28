import Link from "next/link";
import { site } from "@/config/site";

export function Rodape() {
  return (
    <footer className="border-border text-muted-foreground mt-auto border-t py-8 text-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 sm:flex-row sm:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {site.nome} ·{" "}
          <Link
            href="/privacidade"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacidade
          </Link>
        </p>
        <p>
          Conteúdo sob{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/deed.pt_BR"
            target="_blank"
            rel="noopener noreferrer license"
            className="hover:text-primary underline underline-offset-4"
          >
            CC BY-NC 4.0
          </a>{" "}
          · Código{" "}
          <a
            href={`${site.github}/pabloortiz.dev`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary underline underline-offset-4"
          >
            aberto
          </a>
        </p>
      </div>
    </footer>
  );
}
