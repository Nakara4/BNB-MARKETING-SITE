import { NextResponse } from "next/server";

export function serverErrorResponse(context: string, error: unknown, status = 500) {
  console.error(`${context}:`, error);
  return NextResponse.json({ error: "The service is temporarily unavailable." }, { status });
}
