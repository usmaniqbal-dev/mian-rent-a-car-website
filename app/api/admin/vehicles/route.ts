import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { safeQuery, sql } from "@/lib/db";
import { vehicleSchema } from "@/lib/validations";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const rows = await safeQuery(sql`select * from vehicles order by sort_order, name`);
    return NextResponse.json({ vehicles: rows.rows });
  } catch (error) {
    return apiError(error, "Unable to load vehicles");
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const body = vehicleSchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid vehicle" }, { status: 400 });
    const v = body.data;
    const row = await sql`
      insert into vehicles (name, slug, category, image_url, price_lahore, price_outside, weekly_price, monthly_price, rating, description, features, active, sort_order)
      values (${v.name}, ${v.slug}, ${v.category}, ${v.imageUrl || null}, ${v.priceLahore}, ${v.priceOutside}, ${v.weeklyPrice}, ${v.monthlyPrice}, ${v.rating}, ${v.description || null}, ${v.features || null}, ${v.active}, ${v.sortOrder})
      returning *
    `;
    return NextResponse.json({ vehicle: row.rows[0] }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to save vehicle");
  }
}
