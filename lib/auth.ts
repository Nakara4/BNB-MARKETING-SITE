import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const LEGACY_COOKIE_NAME = "bnb_admin_auth";
const PRODUCTION_COOKIE_NAME = "__Host-harlequin_admin_session";
const DEVELOPMENT_COOKIE_NAME = "harlequin_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type AdminSession = {
  expiresAt: number;
  nonce: string;
};

function cookieName() {
  return process.env.NODE_ENV === "production" ? PRODUCTION_COOKIE_NAME : DEVELOPMENT_COOKIE_NAME;
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function secureEqual(first: string, second: string) {
  return timingSafeEqual(digest(first), digest(second));
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSessionToken(secret: string) {
  const session: AdminSession = {
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    nonce: randomBytes(18).toString("base64url")
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function verifySessionToken(token: string, secret: string) {
  const [payload, signature, extra] = token.split(".");

  if (!payload || !signature || extra || !secureEqual(signature, sign(payload, secret))) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<AdminSession>;
    return typeof session.expiresAt === "number" && session.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function adminConfigurationError() {
  if (!process.env.ADMIN_PASSWORD?.trim()) {
    return "Missing ADMIN_PASSWORD.";
  }

  if (!sessionSecret()) {
    return "ADMIN_SESSION_SECRET must contain at least 32 characters.";
  }

  return null;
}

export function verifyAdminPassword(candidate: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  return Boolean(configuredPassword && candidate && secureEqual(candidate, configuredPassword));
}

export async function isAdminAuthenticated() {
  const secret = sessionSecret();
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName())?.value;
  return Boolean(token && verifySessionToken(token, secret));
}

export async function setAdminCookie() {
  const secret = sessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }

  const cookieStore = await cookies();
  cookieStore.set(cookieName(), createSessionToken(secret), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName());
  cookieStore.delete(LEGACY_COOKIE_NAME);
  cookieStore.delete(PRODUCTION_COOKIE_NAME);
  cookieStore.delete(DEVELOPMENT_COOKIE_NAME);
}
