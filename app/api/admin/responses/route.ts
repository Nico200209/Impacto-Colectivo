import { getAdminSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
    .from("survey_responses")
    .select("survey_id, selected_option");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by survey_id → selected_option → count
  const grouped: Record<string, Record<string, number>> = {};
  for (const row of data ?? []) {
    if (!grouped[row.survey_id]) grouped[row.survey_id] = {};
    grouped[row.survey_id][row.selected_option] =
      (grouped[row.survey_id][row.selected_option] ?? 0) + 1;
  }

  return NextResponse.json({ responses: grouped });
}
