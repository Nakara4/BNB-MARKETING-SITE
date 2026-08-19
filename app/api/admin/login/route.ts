import { NextResponse } from "next/server";
import { adminConfigurationError, setAdminCookie, verifyAdminPassword } from "@/lib/auth";
import { clearLoginAttempts, consumeLoginAttempt } from "@/lib/login-rate-limit";
import { isTrustedMutationRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const configurationError = adminConfigurationError();
  if (configurationError) {
    console.error(`Admin login unavailable: ${configurationError}`);
    return NextResponse.json({ error: "Admin login is temporarily unavailable." }, { status: 503 });
  }

  const rateLimit = await consumeLoginAttempt(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rateLimit.retryAfter)
        }
      }
    );
  }

  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  await clearLoginAttempts(request);
  await setAdminCookie();
  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
