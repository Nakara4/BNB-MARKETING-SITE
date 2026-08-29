import { revalidatePath } from "next/cache";

export function revalidatePublicProperties(slugs: Array<string | null | undefined> = []) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  const uniqueSlugs = new Set(slugs.filter((slug): slug is string => Boolean(slug)));
  for (const slug of uniqueSlugs) {
    revalidatePath(`/property/${slug}`);
  }
}
