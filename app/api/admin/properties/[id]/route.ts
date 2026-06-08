import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteProperty, updateProperty } from "@/lib/properties";
import type { PropertyInput } from "@/lib/types";
import { formatMongoError } from "@/lib/mongodb";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Params) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const input = (await request.json()) as PropertyInput;
    const property = await updateProperty(id, input);

    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    return NextResponse.json({ error: formatMongoError(error) }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    await deleteProperty(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: formatMongoError(error) }, { status: 503 });
  }
}
