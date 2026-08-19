import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  await clearAdminCookie();
  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
