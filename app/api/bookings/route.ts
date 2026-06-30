import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations";
import { safeQuery, sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const rows = await safeQuery(sql`select * from bookings order by created_at desc`);
    return NextResponse.json({ bookings: rows.rows });
  } catch (error) {
    return apiError(error, "Unable to load bookings");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = bookingSchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    const b = body.data;
    const created = await sql`
      insert into bookings (vehicle_id, vehicle_name, full_name, phone, pickup_date, return_date, pickup_location, message, total_estimate)
      values (${b.vehicleId || null}, ${b.vehicleName}, ${b.fullName}, ${b.phone}, ${b.pickupDate}, ${b.returnDate}, ${b.pickupLocation}, ${b.message || null}, ${b.totalEstimate})
      returning *
    `;
    return NextResponse.json({ booking: created.rows[0] }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to save booking");
  }
}
