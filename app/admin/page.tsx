import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/auth";
import { getProperties } from "@/lib/properties";
import { AdminDashboard } from "@/components/admin-dashboard";
import { formatMongoError } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-mist px-5">
        <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft" aria-labelledby="admin-login">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Admin</p>
          <h1 id="admin-login" className="mt-2 text-3xl font-black text-ink">
            Sign in
          </h1>
          <form action="/api/admin/login" method="post" className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Password
              <input
                type="password"
                name="password"
                required
                className="min-h-12 rounded-md border border-slate-300 px-4 font-normal outline-none focus:border-palm"
              />
            </label>
            <button className="min-h-12 rounded-md bg-coral px-5 font-bold text-white transition hover:bg-[#cf4e43]">Open dashboard</button>
          </form>
        </section>
      </main>
    );
  }

  try {
    const properties = await getProperties();
    return <AdminDashboard initialProperties={properties} />;
  } catch (error) {
    return <AdminDashboard initialProperties={[]} databaseError={formatMongoError(error)} />;
  }
}
