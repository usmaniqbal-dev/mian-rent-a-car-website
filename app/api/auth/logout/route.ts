import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { apiError } from "@/lib/api";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Logout failed");
  }
}
