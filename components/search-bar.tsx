import { MapPin, Search } from "lucide-react";

export function SearchBar({ location }: { location?: string }) {
  return (
    <form action="/" className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-lg bg-white p-3 shadow-soft sm:flex-row">
      <label className="flex min-h-14 flex-1 items-center gap-3 rounded-md border border-slate-200 px-4">
        <MapPin className="h-5 w-5 flex-none text-palm" aria-hidden="true" />
        <span className="sr-only">Search by location</span>
        <input
          name="location"
          defaultValue={location}
          placeholder="Search by location"
          className="w-full border-0 bg-transparent text-base text-ink outline-none placeholder:text-slate-400"
        />
      </label>
      <button className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-coral px-6 font-bold text-white transition hover:bg-[#cf4e43]">
        <Search className="h-5 w-5" aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
