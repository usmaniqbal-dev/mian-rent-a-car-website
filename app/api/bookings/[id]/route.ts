import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { statusSchema } from "@/lib/validations";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const body = statusSchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    const { id } = await context.params;
    const updated = await sql`update bookings set status = ${body.data.status} where id = ${id} returning *`;
    return NextResponse.json({ booking: updated.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to update booking");
  }
}
