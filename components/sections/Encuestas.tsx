"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/hooks";
import { MdCheckCircle } from "react-icons/md";

interface Survey {
  id: string;
  question: string;
  options: string[];
}

/* ── Individual survey card ── */
function SurveyCard({
  survey,
  index,
  inView,
}: {
  survey: Survey;
  index: number;
  inView: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/survey?surveyId=${survey.id}`)
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => setCount(0));
  }, [survey.id]);

  async function handleSubmit() {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId: survey.id, selectedOption: selected }),
      });
      if (res.ok) {
        setSubmitted(true);
        setCount((c) => (c ?? 0) + 1);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 flex flex-col"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease-out ${index * 0.15}s, transform 0.55s ease-out ${index * 0.15}s`,
      }}
    >
      <span className="inline-flex self-start text-[10px] font-bold tracking-[0.15em] uppercase bg-[#2EBFC0]/10 text-[#2EBFC0] px-3 py-1 rounded-full">
        Encuesta activa
      </span>

      {submitted ? (
        <div className="flex flex-col items-center justify-center flex-1 py-10 gap-4 text-center">
          <MdCheckCircle size={48} className="text-[#2EBFC0]" />
          <p className="font-bold text-[#1E2D3D] text-lg">
            ¡Gracias por participar!
          </p>
          <p className="text-sm text-[#6B7280]">
            Tu respuesta ha sido registrada.
          </p>
          {count !== null && (
            <p className="text-xs text-[#6B7280]">
              {count.toLocaleString("es-DO")} respuestas en total
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="font-bold text-[#1E2D3D] text-base sm:text-lg mt-4 mb-5 leading-snug">
            {survey.question}
          </p>

          <div className="flex flex-col gap-2 flex-1">
            {survey.options.map((option) => {
              const isSelected = selected === option;
              return (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all duration-150 ${
                    isSelected
                      ? "border-[#2EBFC0] bg-[#2EBFC0]/5 text-[#2EBFC0]"
                      : "border-gray-200 text-[#1E2D3D] hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-150 ${
                      isSelected
                        ? "border-[#2EBFC0] bg-[#2EBFC0]"
                        : "border-gray-400"
                    }`}
                  />
                  {option}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selected || submitting}
            className="mt-5 w-full py-3 rounded-xl bg-gray-100 text-[#1E2D3D] font-medium text-sm
                       hover:bg-gray-200 transition-colors duration-150
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Enviando…" : "Enviar respuesta"}
          </button>

          {count !== null && (
            <p className="text-xs text-[#6B7280] mt-3 text-center">
              {count.toLocaleString("es-DO")} respuestas
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* ── Skeleton placeholder while surveys load ── */
function SurveyCardSkeleton({ index, inView }: { index: number; inView: boolean }) {
  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity 0.55s ease-out ${index * 0.15}s`,
      }}
    >
      <div className="w-28 h-5 bg-gray-100 rounded-full mb-6 animate-pulse" />
      <div className="w-full h-4 bg-gray-100 rounded mb-2 animate-pulse" />
      <div className="w-3/4 h-4 bg-gray-100 rounded mb-6 animate-pulse" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-11 bg-gray-50 rounded-xl border border-gray-100 mb-2 animate-pulse" />
      ))}
    </div>
  );
}

/* ── Section ── */
export default function Encuestas() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.15);
  const [gridRef, gridInView] = useInView<HTMLDivElement>(0.1);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(true);

  useEffect(() => {
    fetch("/api/survey/list")
      .then((r) => r.json())
      .then((data) => setSurveys(data.surveys ?? []))
      .catch(() => setSurveys([]))
      .finally(() => setLoadingSurveys(false));
  }, []);

  return (
    <section id="encuestas" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <p
            className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] mb-4 ${
              headerInView ? "animate-reveal" : "opacity-0"
            }`}
          >
            Encuestas ciudadanas
          </p>
          <h2
            className={`text-4xl sm:text-5xl font-bold text-[#1E2D3D] leading-tight max-w-xl ${
              headerInView ? "animate-reveal-d1" : "opacity-0"
            }`}
          >
            Tu realidad también cuenta
          </h2>
          <p
            className={`mt-4 text-base text-[#6B7280] max-w-lg leading-relaxed ${
              headerInView ? "animate-reveal-d2" : "opacity-0"
            }`}
          >
            Participar es sencillo. Tu opinión forma parte del análisis que
            compartimos con la ciudadanía.
          </p>
        </div>

        {/* Survey cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {loadingSurveys ? (
            [0, 1].map((i) => (
              <SurveyCardSkeleton key={i} index={i} inView={gridInView} />
            ))
          ) : surveys.length === 0 ? (
            <p className="text-sm text-[#6B7280] col-span-2 text-center py-10">
              No hay encuestas activas en este momento.
            </p>
          ) : (
            surveys.map((survey, i) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                index={i}
                inView={gridInView}
              />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
