import { getDb } from "@/lib/mongodb";

const COLLECTION = "properties";

/**
 * Initialize database indexes once at application startup.
 * This runs once per server instance, not on every request.
 * Calling createIndex on existing indexes is a no-op after the first run.
 */
export async function initializeIndexes() {
  try {
    const db = await getDb();
    const properties = db.collection(COLLECTION);

    // Text index for full-text search on location, title, description
    await properties.createIndex(
      { location: "text", title: "text", description: "text" },
      { name: "text_search_index" }
    );

    // Unique index on slug for fast lookups and uniqueness constraint
    await properties.createIndex({ slug: 1 }, { unique: true, name: "slug_index" });

    // Index on createdAt for sorting recent properties
    await properties.createIndex({ createdAt: -1 }, { name: "created_at_index" });
  } catch (error) {
    // Log but don't throw - indexes may already exist or database may be temporarily unavailable
    console.error("Failed to initialize database indexes:", error);
  }
}
