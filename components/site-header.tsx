import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute left-0 right-0 top-0 z-20">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-lg font-bold tracking-wide text-white">
          Staycation Homes
        </Link>
        <Link
          href="/admin"
          className="rounded-full border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
