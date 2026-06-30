import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/site-data";
import { apiError } from "@/lib/api";

export async function GET() {
  try {
    return NextResponse.json(await getSiteData());
  } catch (error) {
    return apiError(error, "Unable to load site data");
  }
}
