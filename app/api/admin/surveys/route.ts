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

  const { data: surveys, error: surveysError } = await admin
    .from("surveys")
    .select("id, question, options, active, created_at")
    .order("created_at", { ascending: true });

  if (surveysError) {
    return NextResponse.json({ error: surveysError.message }, { status: 500 });
  }

  const { data: counts, error: countsError } = await admin
    .from("survey_responses")
    .select("survey_id");

  if (countsError) {
    return NextResponse.json({ error: countsError.message }, { status: 500 });
  }

  const countMap: Record<string, number> = {};
  for (const row of counts ?? []) {
    countMap[row.survey_id] = (countMap[row.survey_id] ?? 0) + 1;
  }

  const result = (surveys ?? []).map((s) => ({
    ...s,
    responseCount: countMap[s.id] ?? 0,
  }));

  return NextResponse.json({ surveys: result });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question, options } = await req.json();

  if (!question || !options || options.length < 2) {
    return NextResponse.json(
      { error: "Se requiere pregunta y al menos 2 opciones" },
      { status: 400 }
    );
  }

  const admin = getAdminSupabase();
  const { data, error } = await admin
    .from("surveys")
    .insert({ question, options })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ survey: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, active } = await req.json();
  if (!id || typeof active !== "boolean") {
    return NextResponse.json({ error: "id and active required" }, { status: 400 });
  }

  const admin = getAdminSupabase();
  const { error } = await admin.from("surveys").update({ active }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const admin = getAdminSupabase();

  await admin.from("survey_responses").delete().eq("survey_id", id);
  const { error } = await admin.from("surveys").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
