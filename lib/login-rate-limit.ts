import { createHmac } from "crypto";
import { getDb } from "@/lib/mongodb";

const ATTEMPT_LIMIT = 5;
const WINDOW_SECONDS = 10 * 60;
const COLLECTION = "admin_login_attempts";

type LoginAttempt = {
  _id: string;
  count: number;
  expiresAt: Date;
};

type LocalAttempt = {
  count: number;
  expiresAt: number;
};

const localAttempts = new Map<string, LocalAttempt>();
let indexPromise: Promise<string> | undefined;

function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function attemptKey(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "local-development";
  const window = Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
  return createHmac("sha256", secret).update(`${clientAddress(request)}:${window}`).digest("hex");
}

function retryAfterSeconds() {
  const now = Math.floor(Date.now() / 1000);
  return WINDOW_SECONDS - (now % WINDOW_SECONDS);
}

function consumeLocalAttempt(key: string) {
  const now = Date.now();
  const current = localAttempts.get(key);
  const next = !current || current.expiresAt <= now ? { count: 1, expiresAt: now + WINDOW_SECONDS * 1000 } : { ...current, count: current.count + 1 };
  localAttempts.set(key, next);
  return next.count <= ATTEMPT_LIMIT;
}

export async function consumeLoginAttempt(request: Request) {
  const key = attemptKey(request);
  const retryAfter = retryAfterSeconds();

  if (!process.env.MONGODB_URI) {
    return { allowed: consumeLocalAttempt(key), retryAfter };
  }

  try {
    const db = await getDb();
    const attempts = db.collection<LoginAttempt>(COLLECTION);
    indexPromise ??= attempts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await indexPromise;

    const attempt = await attempts.findOneAndUpdate(
      { _id: key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date(Date.now() + WINDOW_SECONDS * 1000) }
      },
      { upsert: true, returnDocument: "after" }
    );

    return { allowed: Boolean(attempt && attempt.count <= ATTEMPT_LIMIT), retryAfter };
  } catch (error) {
    console.error("Login rate limiter unavailable:", error);
    return { allowed: consumeLocalAttempt(key), retryAfter };
  }
}

export async function clearLoginAttempts(request: Request) {
  const key = attemptKey(request);
  localAttempts.delete(key);

  if (!process.env.MONGODB_URI) {
    return;
  }

  try {
    const db = await getDb();
    await db.collection<LoginAttempt>(COLLECTION).deleteOne({ _id: key });
  } catch (error) {
    console.error("Could not clear login attempts:", error);
  }
}
