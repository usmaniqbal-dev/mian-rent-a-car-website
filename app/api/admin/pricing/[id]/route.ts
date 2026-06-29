import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const { id } = await context.params;
    const row = await sql`
      update pricing_rates set car_type=${b.carType}, destination_city=${b.destinationCity}, one_way_price=${b.oneWayPrice},
      timing_note=${b.timingNote || "24 hours, within the same date"}, active=${Boolean(b.active)}, sort_order=${Number(b.sortOrder || 0)}, updated_at=now()
      where id=${id} returning *
    `;
    return NextResponse.json({ rate: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to update pricing");
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const { id } = await context.params;
    await sql`delete from pricing_rates where id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to delete pricing");
  }
}
