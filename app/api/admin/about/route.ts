import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    await sql`delete from about_content`;
    const row = await sql`
      insert into about_content (title, description, mission_statement, vision_statement, happy_customers_count, available_vehicles_count, years_experience, support_text)
      values (${b.title}, ${b.description}, ${b.missionStatement || null}, ${b.visionStatement || null}, ${Number(b.happyCustomersCount || 500)}, ${Number(b.availableVehiclesCount || 15)}, ${Number(b.yearsExperience || 5)}, ${b.supportText || "24/7 Support"})
      returning *
    `;
    return NextResponse.json({ about: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to save about content");
  }
}
