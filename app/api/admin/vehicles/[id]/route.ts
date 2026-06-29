import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { vehicleSchema } from "@/lib/validations";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const body = vehicleSchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid vehicle" }, { status: 400 });
    const { id } = await context.params;
    const v = body.data;
    const row = await sql`
      update vehicles set name=${v.name}, slug=${v.slug}, category=${v.category}, image_url=${v.imageUrl || null},
      price_lahore=${v.priceLahore}, price_outside=${v.priceOutside}, weekly_price=${v.weeklyPrice}, monthly_price=${v.monthlyPrice},
      rating=${v.rating}, description=${v.description || null}, features=${v.features || null}, active=${v.active}, sort_order=${v.sortOrder}, updated_at=now()
      where id=${id} returning *
    `;
    return NextResponse.json({ vehicle: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to update vehicle");
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const { id } = await context.params;
    await sql`delete from vehicles where id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to delete vehicle");
  }
}
