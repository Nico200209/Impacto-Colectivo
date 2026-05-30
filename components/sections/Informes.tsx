"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/hooks";
import { MdArticle, MdDownload } from "react-icons/md";

interface Informe {
  id: string;
  title: string;
  category: string;
  published_date: string;
  pages: number;
  file_size: string;
  file_url: string;
}

function InformeCardSkeleton({ style }: { style: React.CSSProperties }) {
  return (
    <div className="p-6 sm:p-8 flex gap-4" style={style}>
      <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 animate-pulse" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="w-20 h-3 bg-gray-100 rounded animate-pulse" />
        <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
        <div className="w-2/3 h-4 bg-gray-100 rounded animate-pulse" />
        <div className="w-40 h-3 bg-gray-100 rounded animate-pulse mt-1" />
      </div>
    </div>
  );
}

export default function Informes() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.15);
  const [gridRef, gridInView] = useInView<HTMLDivElement>(0.1);
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/informes")
      .then((r) => r.json())
      .then((data) => setInformes(data.informes ?? []))
      .catch(() => setInformes([]))
      .finally(() => setLoading(false));
  }, []);

  const cols = 2;

  return (
    <section id="informes" className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] mb-4 ${headerInView ? "animate-reveal" : "opacity-0"}`}>
            Informes y documentos
          </p>
          <h2 className={`text-4xl sm:text-5xl font-bold text-[#1E2D3D] leading-tight max-w-xl ${headerInView ? "animate-reveal-d1" : "opacity-0"}`}>
            Investigación disponible para todos
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="rounded-2xl border border-gray-200 bg-white overflow-hidden grid grid-cols-1 sm:grid-cols-2"
        >
          {loading ? (
            [0, 1, 2, 3].map((i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);
              const totalRows = 2;
              return (
                <InformeCardSkeleton
                  key={i}
                  style={{
                    borderRight: col < cols - 1 ? "1px solid #e5e7eb" : "none",
                    borderBottom: row < totalRows - 1 ? "1px solid #e5e7eb" : "none",
                  }}
                />
              );
            })
          ) : informes.length === 0 ? (
            <div className="col-span-2 px-8 py-16 text-center text-sm text-[#6B7280]">
              No hay informes publicados aún.
            </div>
          ) : (
            informes.map((informe, i) => {
              const col = i % cols;
              const totalRows = Math.ceil(informes.length / cols);
              const row = Math.floor(i / cols);
              return (
                <div
                  key={informe.id}
                  className="p-6 sm:p-8 flex gap-4"
                  style={{
                    borderRight: col < cols - 1 ? "1px solid #e5e7eb" : "none",
                    borderBottom: row < totalRows - 1 ? "1px solid #e5e7eb" : "none",
                    opacity: gridInView ? 1 : 0,
                    transform: gridInView ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.5s ease-out ${i * 0.08}s, transform 0.5s ease-out ${i * 0.08}s`,
                  }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#2EBFC0]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MdArticle size={20} className="text-[#2EBFC0]" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280]">
                      {informe.category}
                    </p>
                    <p className="font-bold text-[#1E2D3D] text-sm sm:text-base leading-snug mt-1 mb-3">
                      {informe.title}
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-3 mt-auto">
                      <p className="text-xs text-[#6B7280]">
                        {informe.published_date} &nbsp;·&nbsp; {informe.pages} páginas &nbsp;·&nbsp; PDF · {informe.file_size}
                      </p>
                      <a
                        href={informe.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#2EBFC0]
                                   text-[#2EBFC0] text-xs font-semibold hover:bg-[#2EBFC0] hover:text-white
                                   transition-all duration-150 shrink-0"
                      >
                        <MdDownload size={14} />
                        Descargar
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
