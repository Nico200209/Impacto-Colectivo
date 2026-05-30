"use client";

import { useInView } from "@/lib/hooks";
import {
  MdLocalGasStation,
  MdShoppingBasket,
  MdSchool,
  MdHome,
  MdMonitorHeart,
  MdVisibility,
} from "react-icons/md";
import type { IconType } from "react-icons";

interface Tema {
  icon: IconType;
  title: string;
  description: string;
}

const temas: Tema[] = [
  {
    icon: MdLocalGasStation,
    title: "Combustible",
    description:
      "El impacto del precio de los combustibles en la economía doméstica y el transporte.",
  },
  {
    icon: MdShoppingBasket,
    title: "Canasta básica",
    description:
      "Inflación, acceso a alimentos y el costo real de vida para las familias dominicanas.",
  },
  {
    icon: MdSchool,
    title: "Educación técnica",
    description:
      "Formación laboral, empleabilidad juvenil y el sistema de educación técnico-profesional.",
  },
  {
    icon: MdHome,
    title: "Economía doméstica",
    description:
      "Gastos del hogar, deudas, ahorro y las condiciones económicas a nivel familiar.",
  },
  {
    icon: MdMonitorHeart,
    title: "Salud pública",
    description:
      "Acceso a servicios de salud, cobertura médica y calidad de atención en el sistema público.",
  },
  {
    icon: MdVisibility,
    title: "Transparencia",
    description:
      "Gestión pública, rendición de cuentas e instituciones del Estado dominicano.",
  },
];

export default function Temas() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.15);
  const [gridRef,   gridInView]   = useInView<HTMLDivElement>(0.1);

  return (
    <section id="temas" className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] mb-4 ${headerInView ? "animate-reveal" : "opacity-0"}`}>
            Temas sobre la mesa
          </p>
          <h2 className={`text-4xl sm:text-5xl font-bold text-[#1E2D3D] leading-tight max-w-xl ${headerInView ? "animate-reveal-d1" : "opacity-0"}`}>
            Los asuntos que más afectan la vida cotidiana
          </h2>
        </div>

        {/* Card grid */}
        <div
          ref={gridRef}
          className="rounded-2xl border border-gray-200 bg-white overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {temas.map(({ icon: Icon, title, description }, i) => {
            const col = i % 3;        // 0 | 1 | 2
            const row = Math.floor(i / 3); // 0 | 1
            return (
            <div
              key={title}
              className="p-8"
              style={{
                borderRight:  col < 2 ? "1px solid #e5e7eb" : "none",
                borderBottom: row < 1 ? "1px solid #e5e7eb" : "none",
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease-out ${i * 0.09}s, transform 0.5s ease-out ${i * 0.09}s`,
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-[#2EBFC0]/10 flex items-center justify-center">
                <Icon size={22} className="text-[#2EBFC0]" />
              </div>
              <h3 className="mt-5 mb-2 font-bold text-[#1E2D3D] text-base">{title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
            </div>
          );
          })}
        </div>

      </div>
    </section>
  );
}
