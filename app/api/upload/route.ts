import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";
import { apiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });
    const url = await uploadImage(file, guard.admin?.id);
    return NextResponse.json({ url });
  } catch (error) {
    return apiError(error, "Upload failed");
  }
}
