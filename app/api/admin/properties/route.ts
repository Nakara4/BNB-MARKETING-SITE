import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProperty, getProperties } from "@/lib/properties";
import type { PropertyInput } from "@/lib/types";
import { formatMongoError } from "@/lib/mongodb";

function isValidInput(input: Partial<PropertyInput>) {
  return Boolean(input.title && input.location && input.description && Number(input.price) > 0);
}

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const properties = await getProperties();
    return NextResponse.json({ properties });
  } catch (error) {
    return NextResponse.json({ error: formatMongoError(error) }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const input = (await request.json()) as PropertyInput;
    if (!isValidInput(input)) {
      return NextResponse.json({ error: "Title, price, location, and description are required." }, { status: 400 });
    }

    const property = await createProperty(input);
    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: formatMongoError(error) }, { status: 503 });
  }
}
