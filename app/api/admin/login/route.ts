import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
