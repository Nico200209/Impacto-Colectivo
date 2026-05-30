"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdDelete, MdAdd, MdRemove } from "react-icons/md";

interface Survey {
  id: string;
  question: string;
  options: string[];
  active: boolean;
  responseCount: number;
}

type ResponseMap = Record<string, Record<string, number>>;

export default function AdminDashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<ResponseMap>({});
  const [loading, setLoading] = useState(true);

  // New survey form state
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function loadData() {
    setLoading(true);
    const [surveysRes, responsesRes] = await Promise.all([
      fetch("/api/admin/surveys"),
      fetch("/api/admin/responses"),
    ]);
    if (surveysRes.status === 401 || responsesRes.status === 401) {
      router.push("/admindashboard/login");
      return;
    }
    const surveysData = await surveysRes.json();
    const responsesData = await responsesRes.json();
    setSurveys(surveysData.surveys ?? []);
    setResponses(responsesData.responses ?? {});
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admindashboard/login");
  }

  async function handleDelete(id: string, question: string) {
    if (!confirm(`¿Eliminar esta encuesta?\n\n"${question}"\n\nSe eliminarán también todas sus respuestas.`)) return;
    await fetch("/api/admin/surveys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadData();
  }

  async function handleSave() {
    const cleanOptions = newOptions.filter((o) => o.trim() !== "");
    if (!newQuestion.trim() || cleanOptions.length < 2) {
      setSaveError("Se requiere una pregunta y al menos 2 opciones.");
      return;
    }
    setSaveError("");
    setSaving(true);
    const res = await fetch("/api/admin/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion.trim(), options: cleanOptions }),
    });
    setSaving(false);
    if (res.ok) {
      setNewQuestion("");
      setNewOptions(["", ""]);
      await loadData();
    } else {
      const data = await res.json();
      setSaveError(data.error ?? "Error al guardar");
    }
  }

  const totalResponses = surveys.reduce((sum, s) => sum + s.responseCount, 0);

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
          onClick={handleLogout}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#6B7280]">Cargando datos…</p>
          </div>
        ) : (
          <>
            {/* Overview */}
            <section>
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#6B7280] mb-4">
                Resumen
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard label="Total respuestas" value={totalResponses.toLocaleString("es-DO")} />
                <StatCard label="Encuestas activas" value={surveys.filter((s) => s.active).length.toString()} />
                <StatCard label="Encuestas totales" value={surveys.length.toString()} />
              </div>
            </section>

            {/* Charts */}
            <section>
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#6B7280] mb-4">
                Resultados por encuesta
              </h2>
              <div className="flex flex-col gap-6">
                {surveys.map((survey) => {
                  const surveyResponses = responses[survey.id] ?? {};
                  const total = Object.values(surveyResponses).reduce((a, b) => a + b, 0);
                  return (
                    <div key={survey.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                      <p className="font-semibold text-[#1E2D3D] text-sm mb-1 leading-snug">
                        {survey.question}
                      </p>
                      <p className="text-xs text-[#6B7280] mb-5">
                        {total} {total === 1 ? "respuesta" : "respuestas"}
                      </p>
                      {total === 0 ? (
                        <p className="text-xs text-gray-400 italic">Sin respuestas aún</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {survey.options.map((opt) => {
                            const count = surveyResponses[opt] ?? 0;
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                              <div key={opt} className="flex items-center gap-3">
                                <span className="text-xs text-[#1E2D3D] font-medium w-28 shrink-0 truncate">
                                  {opt}
                                </span>
                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full bg-[#2EBFC0] rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-[#1E2D3D] w-10 text-right shrink-0">
                                  {pct}%
                                </span>
                                <span className="text-xs text-[#6B7280] w-16 text-right shrink-0">
                                  {count} resp.
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Survey management */}
            <section>
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#6B7280] mb-4">
                Gestión de encuestas
              </h2>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {surveys.length === 0 ? (
                  <p className="px-6 py-8 text-sm text-gray-400 text-center">
                    No hay encuestas aún.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                        <th className="px-6 py-3 text-left">Pregunta</th>
                        <th className="px-4 py-3 text-center">Opciones</th>
                        <th className="px-4 py-3 text-center">Respuestas</th>
                        <th className="px-4 py-3 text-center">Estado</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {surveys.map((survey, i) => (
                        <tr
                          key={survey.id}
                          className={`border-b border-gray-100 last:border-0 ${
                            i % 2 === 1 ? "bg-gray-50/50" : ""
                          }`}
                        >
                          <td className="px-6 py-4 text-[#1E2D3D] font-medium max-w-xs">
                            <span className="line-clamp-2">{survey.question}</span>
                          </td>
                          <td className="px-4 py-4 text-center text-[#6B7280]">
                            {survey.options.length}
                          </td>
                          <td className="px-4 py-4 text-center font-semibold text-[#1E2D3D]">
                            {survey.responseCount}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                              survey.active
                                ? "bg-[#2EBFC0]/10 text-[#2EBFC0]"
                                : "bg-gray-100 text-gray-400"
                            }`}>
                              {survey.active ? "Activa" : "Inactiva"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleDelete(survey.id, survey.question)}
                              className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Eliminar encuesta"
                            >
                              <MdDelete size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* Add survey */}
            <section>
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#6B7280] mb-4">
                Agregar encuesta
              </h2>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                    Pregunta
                  </span>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="¿Cuál es tu pregunta para los ciudadanos?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1E2D3D] text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#2EBFC0] focus:border-transparent"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                    Opciones de respuesta
                  </span>
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                        placeholder={`Opción ${i + 1}`}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[#1E2D3D] text-sm
                                   focus:outline-none focus:ring-2 focus:ring-[#2EBFC0] focus:border-transparent"
                      />
                      {newOptions.length > 2 && (
                        <button
                          onClick={() =>
                            setNewOptions(newOptions.filter((_, idx) => idx !== i))
                          }
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <MdRemove size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  {newOptions.length < 6 && (
                    <button
                      onClick={() => setNewOptions([...newOptions, ""])}
                      className="self-start flex items-center gap-1.5 text-xs font-semibold text-[#2EBFC0]
                                 hover:text-[#27aaab] transition-colors mt-1"
                    >
                      <MdAdd size={16} />
                      Agregar opción
                    </button>
                  )}
                </div>

                {saveError && (
                  <p className="text-xs text-red-500 font-medium">{saveError}</p>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="self-start px-6 py-3 rounded-xl bg-[#2EBFC0] text-white font-semibold text-sm
                             hover:bg-[#27aaab] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Guardando…" : "Guardar encuesta"}
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-2xl font-bold text-[#1E2D3D]">{value}</p>
      <p className="text-xs text-[#6B7280] mt-1">{label}</p>
    </div>
  );
}
