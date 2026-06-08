"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, ImagePlus, LogOut, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { Property, PropertyInput } from "@/lib/types";

const emptyForm: PropertyInput = {
  title: "",
  price: 0,
  location: "",
  description: "",
  images: []
};

async function readApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  const isHtml = text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html");

  return {
    error: isHtml
      ? "The server returned an HTML error page instead of JSON. Restart the dev server, then check CLOUDINARY_URL in .env.local."
      : text || "The server returned an unexpected response."
  };
}

export function AdminDashboard({ initialProperties, databaseError }: { initialProperties: Property[]; databaseError?: string }) {
  const [properties, setProperties] = useState(initialProperties);
  const [form, setForm] = useState<PropertyInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const sortedProperties = useMemo(() => [...properties].sort((a, b) => a.title.localeCompare(b.title)), [properties]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  function editProperty(property: Property) {
    setEditingId(property.id);
    setForm({
      title: property.title,
      slug: property.slug,
      price: property.price,
      location: property.location,
      description: property.description,
      images: property.images
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");

    try {
      const body = new FormData();
      Array.from(files).forEach((file) => body.append("images", file));

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      setForm((current) => ({ ...current, images: [...current.images, ...data.urls] }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function saveProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(editingId ? `/api/admin/properties/${editingId}` : "/api/admin/properties", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Could not save property.");
      }

      setProperties((current) => {
        if (!editingId) {
          return [data.property, ...current];
        }
        return current.map((property) => (property.id === editingId ? data.property : property));
      });
      resetForm();
      setMessage("Property saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save property.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProperty(id: string) {
    const confirmed = window.confirm("Delete this property?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/properties/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      setProperties((current) => current.filter((property) => property.id !== id));
      if (editingId === id) resetForm();
      setMessage("Property deleted.");
    } else {
      setMessage("Could not delete property.");
    }
  }

  return (
    <main className="min-h-screen bg-mist">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Dashboard</p>
            <h1 className="text-3xl font-black text-ink">Manage staycation homes</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-ink">
              View site
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[420px_1fr]">
        {databaseError ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900 lg:col-span-2">
            {databaseError}
          </div>
        ) : null}

        <section className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="property-form">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="property-form" className="text-2xl font-black text-ink">
              {editingId ? "Edit home" : "Add home"}
            </h2>
            {editingId ? (
              <button onClick={resetForm} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300" aria-label="Cancel edit">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <form onSubmit={saveProperty} className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Title
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
                className="min-h-11 rounded-md border border-slate-300 px-3 font-normal outline-none focus:border-palm"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Price per night
              <input
                type="number"
                min="1"
                value={form.price || ""}
                onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                required
                className="min-h-11 rounded-md border border-slate-300 px-3 font-normal outline-none focus:border-palm"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Location
              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                required
                className="min-h-11 rounded-md border border-slate-300 px-3 font-normal outline-none focus:border-palm"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                required
                rows={6}
                className="rounded-md border border-slate-300 px-3 py-3 font-normal leading-6 outline-none focus:border-palm"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Photos
              <span className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-palm bg-[#edf8f6] px-4 text-palm">
                <ImagePlus className="h-5 w-5" aria-hidden="true" />
                {uploading ? "Uploading..." : "Upload images"}
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => uploadImages(event.target.files)} />
              </span>
            </label>

            {form.images.length ? (
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((image) => (
                  <div key={image} className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
                    <Image src={image} alt="Uploaded property" fill sizes="120px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, images: current.images.filter((item) => item !== image) }))}
                      className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink shadow"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <button disabled={saving || uploading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-coral px-5 font-bold text-white disabled:opacity-60">
              {editingId ? <Save className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
              {saving ? "Saving..." : editingId ? "Save changes" : "Add property"}
            </button>
            {message ? <p className="text-sm font-semibold text-palm">{message}</p> : null}
          </form>
        </section>

        <section aria-labelledby="property-list">
          <h2 id="property-list" className="mb-4 text-2xl font-black text-ink">
            Properties
          </h2>
          <div className="grid gap-4">
            {sortedProperties.map((property) => (
              <article key={property.id} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr_auto]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src={property.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=700&auto=format&fit=crop"}
                    alt={property.title}
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-ink">{property.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-palm">{property.location}</p>
                  <p className="mt-2 text-sm text-slate-600">KSh {property.price.toLocaleString()} / night</p>
                  <Link href={`/property/${property.slug}`} className="mt-3 inline-flex text-sm font-bold text-coral">
                    View public page
                  </Link>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button onClick={() => editProperty(property)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300" aria-label={`Edit ${property.title}`}>
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button onClick={() => removeProperty(property.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white" aria-label={`Delete ${property.title}`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
            {!sortedProperties.length ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">Add your first staycation home to publish it.</div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
