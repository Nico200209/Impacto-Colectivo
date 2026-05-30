import { getAdminSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const published_date = formData.get("published_date") as string;
  const pages = parseInt(formData.get("pages") as string, 10);
  const file_size = formData.get("file_size") as string;
  const file = formData.get("file") as File;

  if (!title || !category || !published_date || !pages || !file_size || !file) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }

  const admin = getAdminSupabase();
  const safeFileName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
  const filePath = `${Date.now()}-${safeFileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await admin.storage
    .from("informes")
    .upload(filePath, buffer, { contentType: "application/pdf", upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from("informes").getPublicUrl(filePath);

  const { error: dbError } = await admin.from("informes").insert({
    title,
    category,
    published_date,
    pages,
    file_size,
    file_url: urlData.publicUrl,
    file_path: filePath,
  });

  if (dbError) {
    await admin.storage.from("informes").remove([filePath]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, filePath } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const admin = getAdminSupabase();

  if (filePath) {
    await admin.storage.from("informes").remove([filePath]);
  }

  const { error } = await admin.from("informes").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
