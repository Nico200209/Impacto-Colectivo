import { getAdminSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdminSupabase();
  const { data, error } = await admin
    .from("videos")
    .select("id, title, category, published_date, duration, video_url, file_path, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ videos: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  // File upload path
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const published_date = formData.get("published_date") as string;
    const duration = formData.get("duration") as string;
    const file = formData.get("file") as File;

    if (!title || !category || !published_date || !duration || !file) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    const admin = getAdminSupabase();
    const safeFileName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filePath = `${Date.now()}-${safeFileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await admin.storage
      .from("videos")
      .upload(filePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = admin.storage.from("videos").getPublicUrl(filePath);

    const { error: dbError } = await admin.from("videos").insert({
      title,
      category,
      published_date,
      duration,
      video_url: urlData.publicUrl,
      file_path: filePath,
    });

    if (dbError) {
      await admin.storage.from("videos").remove([filePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // YouTube URL path
  const { title, category, published_date, duration, video_url } = await req.json();

  if (!title || !category || !published_date || !duration || !video_url) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }

  const admin = getAdminSupabase();
  const { error } = await admin.from("videos").insert({
    title,
    category,
    published_date,
    duration,
    video_url,
    file_path: null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    await admin.storage.from("videos").remove([filePath]);
  }

  const { error } = await admin.from("videos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
