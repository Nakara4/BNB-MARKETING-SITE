import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-errors";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProperty, getProperties } from "@/lib/properties";
import { validatePropertyInput } from "@/lib/property-validation";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { revalidatePublicProperties } from "@/lib/propertyRevalidation";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const properties = await getProperties();
    return NextResponse.json({ properties });
  } catch (error) {
    return serverErrorResponse("Could not list admin properties", error, 503);
  }
}

export async function POST(request: Request) {
  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const validation = validatePropertyInput(await request.json().catch(() => null));
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const property = await createProperty(validation.data);
    revalidatePublicProperties([property.slug]);
    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    return serverErrorResponse("Could not create property", error, 503);
  }
}
