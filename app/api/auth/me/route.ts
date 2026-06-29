import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    return NextResponse.json({ admin });
  } catch (error) {
    return apiError(error, "Unable to read session");
  }
}
