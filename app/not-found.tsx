import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 text-center">
      <div>
        <h1 className="text-4xl font-black text-ink">Property not found</h1>
        <p className="mt-3 text-slate-600">This home may have been removed or renamed.</p>
        <Link href="/" className="mt-6 inline-flex rounded-md bg-coral px-5 py-3 font-bold text-white">
          Browse homes
        </Link>
      </div>
    </main>
  );
}
