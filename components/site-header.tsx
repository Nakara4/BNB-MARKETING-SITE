import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute left-0 right-0 top-0 z-20">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-lg font-black tracking-wide text-white">
          Harlequin Diani
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#stays" className="hidden text-sm font-bold text-white/85 transition hover:text-white sm:inline">
            Stays
          </a>
          <a href="#location" className="hidden text-sm font-bold text-white/85 transition hover:text-white sm:inline">
            Location
          </a>
        </div>
      </nav>
    </header>
  );
}
