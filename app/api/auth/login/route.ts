import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { apiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const raw = contentType.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());
    const body = loginSchema.safeParse(raw);
    if (!body.success) return NextResponse.json({ error: "Invalid login" }, { status: 400 });

    const admin = await sql<{ id: string; username: string; password_hash: string }>`
      select id, username, password_hash from admins where username = ${body.data.username} limit 1
    `;
    const row = admin.rows[0];
    if (!row || !(await verifyPassword(body.data.password, row.password_hash))) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    await setSessionCookie(await createSession(row.id));
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL("/admin", req.url), 303);
    }
    return NextResponse.json({ ok: true, admin: { id: row.id, username: row.username } });
  } catch (error) {
    return apiError(error, "Login failed");
  }
}
