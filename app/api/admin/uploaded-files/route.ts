import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { safeQuery, sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const files = await safeQuery(sql`select * from uploaded_files order by created_at desc limit 100`);
    return NextResponse.json({ files: files.rows });
  } catch (error) {
    return apiError(error, "Unable to load uploaded files");
  }
}
