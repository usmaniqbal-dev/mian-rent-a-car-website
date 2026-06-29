import "server-only";
import { put } from "@vercel/blob";
import { sql } from "@/lib/db";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export async function uploadImage(file: File, uploadedBy?: string) {
  if (!allowedTypes.has(file.type)) throw new Error("Only image uploads are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5MB or smaller");

  const blob = await put(`carmian/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true
  });

  await sql`
    insert into uploaded_files (file_url, file_name, file_type, file_size, uploaded_by)
    values (${blob.url}, ${file.name}, ${file.type}, ${file.size}, ${uploadedBy || null})
  `;

  return blob.url;
}
