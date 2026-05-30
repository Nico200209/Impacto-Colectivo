"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useInView } from "@/lib/hooks";
import { MdCheckCircle } from "react-icons/md";

const bullets = [
  "Acceso anticipado a nuevos informes",
  "Participación en encuestas especiales",
  "Comunidad de ciudadanos comprometidos",
];

const aporteOptions = [
  "Voluntariado",
  "Investigación y análisis",
  "Comunicación y redes",
  "Diseño",
  "Apoyo económico",
  "Otro",
];

const inputClass =
  "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#2EBFC0] transition-colors";

export default function Participar() {
  const [textRef, textInView] = useInView<HTMLDivElement>(0.15);
  const [formRef, formInView] = useInView<HTMLDivElement>(0.15);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [aporte, setAporte] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { nombre, correo, whatsapp, aporte },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setSent(true);
    } catch {
      setError("Hubo un error al enviar. Por favor intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="participar" className="bg-[#1E2D3D] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text ── */}
          <div ref={textRef} className="flex flex-col gap-6">
            <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] ${textInView ? "animate-reveal" : "opacity-0"}`}>
              Sé parte de los impulsadores
            </p>

            <h2 className={`text-4xl sm:text-5xl font-bold text-white leading-tight ${textInView ? "animate-reveal-d1" : "opacity-0"}`}>
              Construye contigo la plataforma
            </h2>

            <p className={`text-[#9CA3AF] text-base leading-relaxed ${textInView ? "animate-reveal-d2" : "opacity-0"}`}>
              Impacto Colectivo crece gracias a personas que creen en el análisis
              independiente. Si quieres aportar tu tiempo, conocimiento o recursos,
              esta es tu puerta de entrada.
            </p>

            <ul className={`flex flex-col gap-3 ${textInView ? "animate-reveal-d3" : "opacity-0"}`}>
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="text-[#2EBFC0] text-lg leading-none select-none">•</span>
                  <span className="text-[#9CA3AF] text-base">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: Form card ── */}
          <div
            ref={formRef}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
            style={{
              opacity: formInView ? 1 : 0,
              transform: formInView ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
            }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <MdCheckCircle className="text-[#2EBFC0] text-5xl" />
                <p className="text-white font-semibold text-lg">¡Solicitud enviada!</p>
                <p className="text-[#9CA3AF] text-sm">Nos pondremos en contacto pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Nombre */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9CA3AF] block mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Correo */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9CA3AF] block mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9CA3AF] block mb-2">
                    WhatsApp <span className="normal-case">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 809 000 0000"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Cómo puedes aportar */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9CA3AF] block mb-2">
                    Cómo puedes aportar
                  </label>
                  <select
                    required
                    value={aporte}
                    onChange={(e) => setAporte(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled className="bg-[#1E2D3D]">Seleccionar</option>
                    {aporteOptions.map((op) => (
                      <option key={op} value={op} className="bg-[#1E2D3D]">{op}</option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-sm -mt-2">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#2EBFC0] hover:bg-[#26a8a9] text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-60 mt-1"
                >
                  {sending ? "Enviando…" : "Enviar solicitud"}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
