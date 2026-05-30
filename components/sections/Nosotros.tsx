"use client";

import { useInView } from "@/lib/hooks";

const nodes = [
  { id: "N1", cx: 160, cy: 140 },
  { id: "N2", cx: 300, cy:  70 },
  { id: "N3", cx: 420, cy: 160 },
  { id: "N4", cx: 310, cy: 240 },
  { id: "N5", cx: 420, cy: 320 },
  { id: "N6", cx: 150, cy: 290 },
];

const edges = [
  { from: "N1", to: "N2", len: 165, delay: 0.3 },
  { from: "N2", to: "N3", len: 145, delay: 0.55 },
  { from: "N3", to: "N4", len: 145, delay: 0.8 },
  { from: "N4", to: "N5", len: 115, delay: 1.05 },
  { from: "N4", to: "N6", len: 175, delay: 1.1 },
  { from: "N1", to: "N6", len: 152, delay: 0.65 },
];

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

export default function Nosotros() {
  const [textRef,    textInView]    = useInView<HTMLDivElement>(0.15);
  const [networkRef, networkInView] = useInView<HTMLDivElement>(0.2);

  return (
    <section id="nosotros" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: Text content ── */}
          <div ref={textRef} className="flex flex-col gap-6">
            <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] ${textInView ? "animate-reveal" : "opacity-0"}`}>
              Sobre Impacto Colectivo
            </p>

            <h2 className={`text-4xl sm:text-5xl font-bold leading-tight text-[#1E2D3D] ${textInView ? "animate-reveal-d1" : "opacity-0"}`}>
              Análisis independiente para una ciudadanía más informada
            </h2>

            <p className={`text-base text-[#6B7280] leading-relaxed ${textInView ? "animate-reveal-d2" : "opacity-0"}`}>
              Impacto Colectivo nació para cubrir un vacío: el análisis
              independiente de los temas que más afectan la realidad dominicana,
              explicado con honestidad y respaldado por datos.
            </p>

            <p className={`text-base text-[#6B7280] leading-relaxed ${textInView ? "animate-reveal-d3" : "opacity-0"}`}>
              Combinamos encuestas ciudadanas, análisis de políticas públicas e
              investigación directa para producir contenido que ayude a entender
              mejor el país.
            </p>

            <p className={`text-base text-[#6B7280] leading-relaxed ${textInView ? "animate-reveal-d4" : "opacity-0"}`}>
              No buscamos posicionamiento político. Buscamos que cada persona
              que nos lea tenga más herramientas para entender, opinar y
              participar.
            </p>
          </div>

          {/* ── Right: Network visualization ── */}
          <div
            ref={networkRef}
            className="relative rounded-2xl overflow-hidden min-h-[360px]"
            style={{
              backgroundImage: "radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          >
            {/* Network SVG */}
            <svg
              viewBox="0 0 580 390"
              className="w-full h-auto"
              aria-hidden="true"
            >
              {/* Edges */}
              {edges.map(({ from, to, len, delay }) => {
                const a = getNode(from);
                const b = getNode(to);
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.cx} y1={a.cy}
                    x2={b.cx} y2={b.cy}
                    stroke="#2EBFC0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: len,
                      strokeDashoffset: networkInView ? 0 : len,
                      transition: `stroke-dashoffset 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
                      opacity: 0.45,
                    }}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(({ id, cx, cy }, i) => (
                <circle
                  key={id}
                  cx={cx} cy={cy} r="6"
                  fill="white"
                  stroke="#2EBFC0"
                  strokeWidth="2"
                  style={{
                    opacity: networkInView ? 1 : 0,
                    transition: `opacity 0.4s ease-out ${1.2 + i * 0.08}s`,
                  }}
                />
              ))}
            </svg>

            {/* Floating card — top right */}
            <div
              className="absolute top-6 right-6 bg-white rounded-xl px-5 py-4 shadow-lg border border-gray-100"
              style={{
                opacity: networkInView ? 1 : 0,
                transition: "opacity 0.5s ease-out 1.6s",
              }}
            >
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280]">Cobertura</p>
              <p className="text-xl font-bold text-[#1E2D3D] mt-0.5">6 áreas</p>
            </div>

            {/* Floating card — bottom left */}
            <div
              className="absolute bottom-6 left-6 bg-white rounded-xl px-5 py-4 shadow-lg border border-gray-100"
              style={{
                opacity: networkInView ? 1 : 0,
                transition: "opacity 0.5s ease-out 1.8s",
              }}
            >
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280]">Periodicidad</p>
              <p className="text-xl font-bold text-[#2EBFC0] mt-0.5">Mensual</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
