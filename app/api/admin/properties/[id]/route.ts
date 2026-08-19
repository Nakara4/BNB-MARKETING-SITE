import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-errors";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteProperty, updateProperty } from "@/lib/properties";
import { validatePropertyInput } from "@/lib/property-validation";
import { isTrustedMutationRequest } from "@/lib/request-security";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Params) {
  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid property identifier." }, { status: 400 });
    }

    const validation = validatePropertyInput(await request.json().catch(() => null));
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const property = await updateProperty(id, validation.data);

    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    return serverErrorResponse("Could not update property", error, 503);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid property identifier." }, { status: 400 });
    }

    await deleteProperty(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverErrorResponse("Could not delete property", error, 503);
  }
}
