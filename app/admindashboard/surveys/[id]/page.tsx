"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MdArrowBack, MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";

interface Survey {
  id: string;
  question: string;
  options: string[];
  active: boolean;
  responseCount: number;
}

type ResponseMap = Record<string, Record<string, number>>;

export default function SurveyDetail() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [optionCounts, setOptionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  async function loadData() {
    const [surveysRes, responsesRes] = await Promise.all([
      fetch("/api/admin/surveys"),
      fetch("/api/admin/responses"),
    ]);

    if (surveysRes.status === 401) {
      router.push("/admindashboard/login");
      return;
    }

    const surveysData = await surveysRes.json();
    const responsesData: { responses: ResponseMap } = await responsesRes.json();

    const found = (surveysData.surveys as Survey[]).find((s) => s.id === id);
    if (!found) {
      router.push("/admindashboard");
      return;
    }

    setSurvey(found);
    setOptionCounts(responsesData.responses?.[id] ?? {});
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleToggle() {
    if (!survey) return;
    setToggling(true);
    await fetch("/api/admin/surveys", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: survey.id, active: !survey.active }),
    });
    await loadData();
    setToggling(false);
  }

  async function handleDelete() {
    if (!survey) return;
    if (!confirm(`¿Eliminar esta encuesta?\n\n"${survey.question}"\n\nSe eliminarán también todas sus respuestas (${survey.responseCount}).`)) return;
    await fetch("/api/admin/surveys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: survey.id }),
    });
    router.push("/admindashboard");
  }

  const total = Object.values(optionCounts).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-[#6B7280]">Cargando…</p>
      </div>
    );
  }

  if (!survey) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1E2D3D] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2EBFC0]">
            Impacto Colectivo
          </p>
          <h1 className="text-lg font-bold">Panel de Administración</h1>
        </div>
        <button
          onClick={() => router.push("/admindashboard")}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        {/* Back */}
        <button
          onClick={() => router.push("/admindashboard")}
          className="self-start flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1E2D3D] transition-colors"
        >
          <MdArrowBack size={16} />
          Volver al panel
        </button>

        {/* Question header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <span className={`inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full mb-3 ${survey.active ? "bg-[#2EBFC0]/10 text-[#2EBFC0]" : "bg-gray-100 text-gray-400"}`}>
                {survey.active ? "Activa" : "Oculta"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E2D3D] leading-snug">
                {survey.question}
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                  survey.active
                    ? "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
                    : "bg-[#2EBFC0]/10 text-[#2EBFC0] hover:bg-[#2EBFC0]/20"
                }`}
              >
                {survey.active ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                {toggling ? "…" : survey.active ? "Ocultar" : "Mostrar"}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <MdDelete size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-3xl font-bold text-[#1E2D3D]">{total.toLocaleString("es-DO")}</p>
            <p className="text-xs text-[#6B7280] mt-1">Respuestas totales</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-3xl font-bold text-[#1E2D3D]">{survey.options.length}</p>
            <p className="text-xs text-[#6B7280] mt-1">Opciones</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 col-span-2 sm:col-span-1">
            <p className="text-3xl font-bold text-[#1E2D3D]">
              {total > 0
                ? (() => {
                    const top = survey.options.reduce((a, b) =>
                      (optionCounts[a] ?? 0) >= (optionCounts[b] ?? 0) ? a : b
                    );
                    return `${Math.round(((optionCounts[top] ?? 0) / total) * 100)}%`;
                  })()
                : "—"}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">Respuesta más votada</p>
          </div>
        </div>

        {/* Response chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#6B7280] mb-6">
            Distribución de respuestas
          </h3>

          {total === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">
              Sin respuestas aún. Comparte la encuesta para empezar a recibir datos.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {survey.options.map((opt) => {
                const count = optionCounts[opt] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const isTop = count === Math.max(...survey.options.map((o) => optionCounts[o] ?? 0)) && count > 0;
                return (
                  <div key={opt}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-semibold ${isTop ? "text-[#1E2D3D]" : "text-[#6B7280]"}`}>
                        {opt}
                        {isTop && <span className="ml-2 text-[10px] font-bold tracking-wider uppercase text-[#2EBFC0]">· más votada</span>}
                      </span>
                      <span className="text-sm font-bold text-[#1E2D3D]">{pct}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: isTop ? "#2EBFC0" : "#94d9d9",
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {count.toLocaleString("es-DO")} {count === 1 ? "respuesta" : "respuestas"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
