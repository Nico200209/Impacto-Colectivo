import { getAdminSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = getAdminSupabase();
  const { data, error } = await admin
    .from("videos")
    .select("id, title, category, published_date, duration, video_url")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ videos: data ?? [] });
}
