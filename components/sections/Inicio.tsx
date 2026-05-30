"use client";

import { useEffect, useRef, useState } from "react";

/* ── Fires once when the element enters the viewport ── */
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/* ── Counts from 0 to target once enabled ── */
function useCountUp(target: number, duration = 1400, delay = 0, enabled = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [enabled, target, duration, delay]);

  return value;
}

/* ── Types out text one character at a time once enabled ── */
function useTypewriter(text: string, delay = 0, speed = 80, enabled = false) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!enabled) return;
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [enabled, text, delay, speed]);

  return displayed;
}

const topics = [
  { label: "Economía",  pct: 86 },
  { label: "Salud",     pct: 72 },
  { label: "Educación", pct: 65 },
  { label: "Energía",   pct: 58 },
];

const chartPoints = "20,90 80,78 140,64 200,50 260,38 320,26 380,14";
const areaPath    = "M20,90 80,78 140,64 200,50 260,38 320,26 380,14 L380,100 L20,100 Z";

export default function Inicio() {
  const [heroRef,  heroInView]  = useInView<HTMLDivElement>(0.15);
  const [panelRef, panelInView] = useInView<HTMLDivElement>(0.2);
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.4);

  const count50  = useCountUp(50, 1400, 0,   statsInView);
  const count10k = useCountUp(10, 1400, 150, statsInView);
  const typeword = useTypewriter("Mensual", 300, 75, statsInView);

  return (
    <section id="inicio" className="min-h-screen flex items-center pt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Content ── */}
          <div ref={heroRef} className="flex flex-col gap-6">
            <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] transition-none ${heroInView ? "animate-reveal" : "opacity-0"}`}>
              Datos · Ciudadanía · Realidad
            </p>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#1E2D3D] ${heroInView ? "animate-reveal-d1" : "opacity-0"}`}>
              Los temas que afectan al país, explicados{" "}
              <span className="text-[#2EBFC0]">con claridad.</span>
            </h1>

            <p className={`text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-lg ${heroInView ? "animate-reveal-d2" : "opacity-0"}`}>
              Impacto Colectivo es una plataforma independiente de análisis
              ciudadano. Investigamos lo que más afecta a la República
              Dominicana con datos reales, encuestas directas y perspectiva
              crítica.
            </p>

            <div className={`flex flex-wrap gap-4 pt-2 ${heroInView ? "animate-reveal-d3" : "opacity-0"}`}>
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
          <div ref={panelRef} className={panelInView ? "animate-reveal-d2" : "opacity-0"}>
            <div className="bg-gray-50 rounded-2xl p-6 shadow-xl shadow-gray-200/60 border border-gray-100">

              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6B7280] mb-4">
                Panel de Análisis
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { value: "50",    label: "Temas",      delay: "animate-stat-1" },
                  { value: "10.2k", label: "Respuestas", delay: "animate-stat-2" },
                  { value: "92%",   label: "Activos",    delay: "animate-stat-3" },
                ].map(({ value, label, delay }) => (
                  <div
                    key={label}
                    className={`bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm ${panelInView ? delay : "opacity-0"}`}
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
                  {[25, 50, 75].map((y) => (
                    <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                  ))}

                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2EBFC0" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2EBFC0" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <path
                    d={areaPath}
                    fill="url(#chartGradient)"
                    style={{
                      opacity: panelInView ? 1 : 0,
                      transition: "opacity 0.8s ease-out 1.4s",
                    }}
                  />

                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#2EBFC0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 600,
                      strokeDashoffset: panelInView ? 0 : 600,
                      transition: "stroke-dashoffset 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
                    }}
                  />

                  {chartPoints.split(" ").map((pt, i) => {
                    const [x, y] = pt.split(",").map(Number);
                    return (
                      <circle
                        key={i}
                        cx={x} cy={y} r="3.5"
                        fill="white"
                        stroke="#2EBFC0"
                        strokeWidth="2"
                        style={{
                          opacity: panelInView ? 1 : 0,
                          transition: `opacity 0.3s ease-out ${1.2 + i * 0.1}s`,
                        }}
                      />
                    );
                  })}

                  {["ENE","FEB","MAR","ABR","MAY","JUN","JUL"].map((m, i) => (
                    <text key={m} x={20 + i * 60} y={108} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="inherit">
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
                        className="h-full bg-[#2EBFC0] rounded-full"
                        style={{
                          width: panelInView ? `${pct}%` : "0%",
                          transition: `width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${1.6 + i * 0.15}s`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1E2D3D] w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom stats strip ── */}
        <div
          ref={statsRef}
          className="mt-16 pt-10 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200"
        >
          {[
            { value: `+${count50}`,   label: "Temas analizados",           cls: statsInView ? "animate-stat-1" : "opacity-0" },
            { value: `+${count10k}k`, label: "Respuestas ciudadanas",      cls: statsInView ? "animate-stat-2" : "opacity-0" },
            { value: typeword || " ", label: "Nuevos informes publicados",  cls: statsInView ? "animate-stat-3" : "opacity-0" },
          ].map(({ value, label, cls }) => (
            <div key={label} className={`${cls} flex flex-col items-center py-6 sm:py-0 gap-1`}>
              <span className="text-4xl sm:text-5xl font-bold text-[#1E2D3D] tabular-nums">{value}</span>
              <span className="text-sm text-[#6B7280] mt-1">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
