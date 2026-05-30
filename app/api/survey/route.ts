import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: NextRequest) {
  const surveyId = req.nextUrl.searchParams.get("surveyId");
  if (!surveyId) {
    return NextResponse.json({ error: "surveyId required" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { count, error } = await supabase
    .from("survey_responses")
    .select("*", { count: "exact", head: true })
    .eq("survey_id", surveyId);

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { surveyId, selectedOption } = body as {
    surveyId: string;
    selectedOption: string;
  };

  if (!surveyId || !selectedOption) {
    return NextResponse.json(
      { error: "surveyId and selectedOption required" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("survey_responses")
    .insert({ survey_id: surveyId, selected_option: selectedOption });

  if (error) {
    console.error("Supabase POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
