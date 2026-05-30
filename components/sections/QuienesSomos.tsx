"use client";

import { useInView } from "@/lib/hooks";

const tags = [
  "Independientes",
  "Basados en datos",
  "Participación ciudadana",
  "Perspectiva joven",
  "Sin agenda partidaria",
];

const stats = [
  { value: "2024",    label: "Año de fundación" },
  { value: "RD",      label: "República Dominicana" },
  { value: "100%",    label: "Contenido independiente" },
  { value: "Abierto", label: "Acceso libre a informes" },
];

export default function QuienesSomos() {
  const [textRef,   textInView]   = useInView<HTMLDivElement>(0.15);
  const [visualRef, visualInView] = useInView<HTMLDivElement>(0.15);

  return (
    <section id="nosotros" className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text ── */}
          <div ref={textRef} className="flex flex-col gap-6">
            <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] ${textInView ? "animate-reveal" : "opacity-0"}`}>
              Quiénes somos
            </p>

            <h2 className={`text-4xl sm:text-5xl font-bold leading-tight text-[#1E2D3D] ${textInView ? "animate-reveal-d1" : "opacity-0"}`}>
              Una voz ciudadana independiente
            </h2>

            <blockquote className={`border-l-2 border-[#2EBFC0] pl-5 ${textInView ? "animate-reveal-d2" : "opacity-0"}`}>
              <p className="text-base text-[#6B7280] leading-relaxed">
                Somos un espacio independiente de análisis ciudadano creado para
                investigar los temas que más impactan la vida cotidiana en
                República Dominicana. Utilizamos datos, encuestas directas y
                análisis riguroso para producir contenido que informe, no que
                adoctrine.
              </p>
            </blockquote>

            <p className={`text-base text-[#6B7280] leading-relaxed ${textInView ? "animate-reveal-d3" : "opacity-0"}`}>
              No somos un partido político ni tenemos afiliación institucional.
              No representamos intereses empresariales ni gubernamentales.
              Nuestra única agenda es la claridad y la participación informada.
            </p>
          </div>

          {/* ── Right: Tags + Stats ── */}
          <div ref={visualRef} className="flex flex-col gap-8">

            {/* Tags */}
            <div>
              <p
                className="text-sm font-semibold text-[#1E2D3D] mb-4"
                style={{
                  opacity: visualInView ? 1 : 0,
                  transition: "opacity 0.5s ease-out 0s",
                }}
              >
                Lo que nos define
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-[#1E2D3D]"
                    style={{
                      opacity: visualInView ? 1 : 0,
                      transform: visualInView ? "translateY(0)" : "translateY(12px)",
                      transition: `opacity 0.4s ease-out ${0.1 + i * 0.08}s, transform 0.4s ease-out ${0.1 + i * 0.08}s`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {stats.map((stat, i) => (
                <div
                  key={stat.value}
                  style={{
                    opacity: visualInView ? 1 : 0,
                    transform: visualInView ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.4s ease-out ${0.5 + i * 0.09}s, transform 0.4s ease-out ${0.5 + i * 0.09}s`,
                  }}
                >
                  <p className="text-2xl font-bold text-[#1E2D3D]">{stat.value}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
