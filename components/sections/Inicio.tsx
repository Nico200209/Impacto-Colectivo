"use client";

const topics = [
  { label: "Economía",  pct: 86 },
  { label: "Salud",     pct: 72 },
  { label: "Educación", pct: 65 },
  { label: "Energía",   pct: 58 },
];

/* Simple static SVG polyline points for a rising chart */
const chartPoints = "20,90 80,78 140,64 200,50 260,38 320,26 380,14";
const areaPath    = "M20,90 80,78 140,64 200,50 260,38 320,26 380,14 L380,100 L20,100 Z";

export default function Inicio() {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center pt-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Content ── */}
          <div className="flex flex-col gap-6">
            {/* Overline */}
            <p className="animate-reveal text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0]">
              Datos · Ciudadanía · Realidad
            </p>

            {/* Heading */}
            <h1 className="animate-reveal-d1 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#1E2D3D]">
              Los temas que afectan al país, explicados{" "}
              <span className="text-[#2EBFC0]">con claridad.</span>
            </h1>

            {/* Description */}
            <p className="animate-reveal-d2 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-lg">
              Impacto Colectivo es una plataforma independiente de análisis
              ciudadano. Investigamos lo que más afecta a la República
              Dominicana con datos reales, encuestas directas y perspectiva
              crítica.
            </p>

            {/* CTA Buttons */}
            <div className="animate-reveal-d3 flex flex-wrap gap-4 pt-2">
              <a
                href="#encuestas"
                className="inline-flex items-center px-7 py-3.5 rounded-full bg-[#2EBFC0] text-white
                           font-semibold text-sm hover:bg-[#27aaab] transition-all duration-200
                           hover:scale-105 hover:shadow-lg hover:shadow-[#2EBFC0]/30"
              >
                Ver encuestas
              </a>
              <a
                href="#informes"
                className="inline-flex items-center px-7 py-3.5 rounded-full border-2 border-[#1E2D3D]
                           text-[#1E2D3D] font-semibold text-sm hover:bg-[#1E2D3D] hover:text-white
                           transition-all duration-200 hover:scale-105"
              >
                Explorar informes
              </a>
            </div>
          </div>

          {/* ── Right: Data Panel ── */}
          <div className="animate-reveal-d4">
            <div className="bg-gray-50 rounded-2xl p-6 shadow-xl shadow-gray-200/60 border border-gray-100">

              {/* Panel header */}
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B7280] mb-4">
                Panel de Análisis
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { value: "50",    label: "Temas",      cls: "animate-stat-1" },
                  { value: "10.2k", label: "Respuestas", cls: "animate-stat-2" },
                  { value: "92%",   label: "Activos",    cls: "animate-stat-3" },
                ].map(({ value, label, cls }) => (
                  <div
                    key={label}
                    className={`${cls} bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm`}
                  >
                    <p className="text-xl font-bold text-[#1E2D3D]">{value}</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Line chart */}
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#6B7280] mb-3">
                Participación Mensual
              </p>
              <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5">
                <svg viewBox="0 0 400 110" className="w-full h-auto" aria-hidden="true">
                  {/* Grid lines */}
                  {[25, 50, 75].map((y) => (
                    <line
                      key={y}
                      x1="20" y1={y} x2="380" y2={y}
                      stroke="#f0f0f0" strokeWidth="1"
                    />
                  ))}

                  {/* Area fill */}
                  <path
                    d={areaPath}
                    fill="url(#chartGradient)"
                    className="animate-chart-fill"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2EBFC0" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2EBFC0" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Animated line */}
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#2EBFC0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-draw-line"
                  />

                  {/* Dots on line points */}
                  {chartPoints.split(" ").map((pt, i) => {
                    const [x, y] = pt.split(",").map(Number);
                    return (
                      <circle
                        key={i}
                        cx={x} cy={y} r="3.5"
                        fill="white"
                        stroke="#2EBFC0"
                        strokeWidth="2"
                        className="animate-chart-fill"
                      />
                    );
                  })}

                  {/* X-axis labels */}
                  {["ENE","FEB","MAR","ABR","MAY","JUN","JUL"].map((m, i) => (
                    <text
                      key={m}
                      x={20 + i * 60}
                      y={108}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#9CA3AF"
                      fontFamily="inherit"
                    >
                      {m}
                    </text>
                  ))}
                </svg>
              </div>

              {/* Progress bars */}
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#6B7280] mb-3">
                Temas Activos
              </p>
              <div className="flex flex-col gap-2.5">
                {topics.map(({ label, pct }, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-[#1E2D3D] font-medium w-20 shrink-0">{label}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full bg-[#2EBFC0] rounded-full animate-bar animate-bar-${i + 1}`}
                        style={{ "--bar-width": `${pct}%` } as React.CSSProperties}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1E2D3D] w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
