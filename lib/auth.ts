import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

const COOKIE_NAME = "carmian_admin_session";
const encoder = new TextEncoder();

function secret() {
  const value = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (!value) throw new Error("AUTH_SECRET is required");
  return encoder.encode(value);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function createSession(adminId: string) {
  return new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getAdminFromRequest(req?: NextRequest) {
  const token = req?.cookies.get(COOKIE_NAME)?.value || (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, secret());
    const adminId = String(verified.payload.adminId || "");
    if (!adminId) return null;
    const admin = await sql<{ id: string; username: string }>`select id, username from admins where id = ${adminId}`;
    return admin.rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return { admin: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { admin, response: null };
}
