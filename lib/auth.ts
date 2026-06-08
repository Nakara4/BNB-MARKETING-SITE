import { createHash } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bnb_admin_auth";

function passwordHash() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD. Add it to .env.local.");
  }
  return createHash("sha256").update(password).digest("hex");
}

export async function isAdminAuthenticated() {
  if (!process.env.ADMIN_PASSWORD) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === passwordHash();
}

export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, passwordHash(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
