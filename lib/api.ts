import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "Something went wrong") {
  const message = error instanceof Error && error.message ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
