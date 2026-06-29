import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const rows = await sql`select * from customer_reviews order by sort_order, created_at desc`;
    return NextResponse.json({ reviews: rows.rows });
  } catch (error) {
    return apiError(error, "Unable to load reviews");
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const row = await sql`
      insert into customer_reviews (customer_name, customer_city, review_text, rating, avatar_initials, active, sort_order)
      values (${b.customerName}, ${b.customerCity}, ${b.reviewText}, ${Number(b.rating || 5)}, ${b.avatarInitials || null}, ${Boolean(b.active)}, ${Number(b.sortOrder || 0)})
      returning *
    `;
    return NextResponse.json({ review: row.rows[0] }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to save review");
  }
}
