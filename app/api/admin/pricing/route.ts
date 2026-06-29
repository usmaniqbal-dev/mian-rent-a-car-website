import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const rows = await sql`select * from pricing_rates order by sort_order, destination_city`;
    return NextResponse.json({ pricing: rows.rows });
  } catch (error) {
    return apiError(error, "Unable to load pricing");
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const row = await sql`
      insert into pricing_rates (car_type, destination_city, one_way_price, timing_note, active, sort_order)
      values (${b.carType}, ${b.destinationCity}, ${b.oneWayPrice}, ${b.timingNote || "24 hours, within the same date"}, ${Boolean(b.active)}, ${Number(b.sortOrder || 0)})
      returning *
    `;
    return NextResponse.json({ rate: row.rows[0] }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to save pricing");
  }
}
