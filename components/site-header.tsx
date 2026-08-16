import Link from "next/link";
import { Menu } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Stays", href: "/#stays" },
  { label: "Diani Guide", href: "/diani-beach-guide" },
  { label: "About", href: "/about" },
  { label: "Policies", href: "/policies" },
  { label: "Contact", href: "/contact" }
];

type SiteHeaderProps = {
  variant?: "overlay" | "solid";
};

export function SiteHeader({ variant = "overlay" }: SiteHeaderProps) {
  const overlay = variant === "overlay";

  return (
    <header className={`${overlay ? "absolute left-0 right-0 top-0" : "bg-ink"} z-20 text-white`}>
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-lg font-black tracking-wide">
          Harlequin Diani
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-white/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <details className="relative lg:hidden">
          <summary
            aria-label="Open navigation"
            title="Menu"
            className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-md border border-white/30 bg-white/10 [&::-webkit-details-marker]:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-12 grid w-52 overflow-hidden rounded-md border border-white/15 bg-ink shadow-soft">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-3 text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </nav>
    </header>
  );
}
