"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useInView } from "@/lib/hooks";
import { MdEmail, MdLocationOn, MdCheckCircle } from "react-icons/md";

export default function Contacto() {
  const [textRef, textInView] = useInView<HTMLDivElement>(0.15);
  const [formRef, formInView] = useInView<HTMLDivElement>(0.15);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
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
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!,
        { nombre, correo, mensaje },
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
    <section id="contacto" className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text + contact info ── */}
          <div ref={textRef} className="flex flex-col gap-6">
            <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] ${textInView ? "animate-reveal" : "opacity-0"}`}>
              Conversemos
            </p>

            <h2 className={`text-4xl sm:text-5xl font-bold leading-tight text-[#1E2D3D] ${textInView ? "animate-reveal-d1" : "opacity-0"}`}>
              Escríbenos directamente
            </h2>

            <p className={`text-base text-[#6B7280] leading-relaxed ${textInView ? "animate-reveal-d2" : "opacity-0"}`}>
              Si tienes una pregunta, quieres colaborar, o tienes información
              relevante para alguno de nuestros temas de análisis, estamos
              disponibles.
            </p>

            <div className={`flex flex-col gap-4 ${textInView ? "animate-reveal-d3" : "opacity-0"}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2EBFC0]/10 flex items-center justify-center flex-shrink-0">
                  <MdEmail className="text-[#2EBFC0] text-xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280]">Correo</p>
                  <p className="text-sm font-medium text-[#1E2D3D]">impactocolectivo@outlook.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2EBFC0]/10 flex items-center justify-center flex-shrink-0">
                  <MdLocationOn className="text-[#2EBFC0] text-xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280]">Ubicación</p>
                  <p className="text-sm font-medium text-[#1E2D3D]">Santo Domingo, República Dominicana</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form card ── */}
          <div
            ref={formRef}
            className="bg-white border border-gray-200 rounded-2xl p-8"
            style={{
              opacity: formInView ? 1 : 0,
              transform: formInView ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
            }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <MdCheckCircle className="text-[#2EBFC0] text-5xl" />
                <p className="text-[#1E2D3D] font-semibold text-lg">¡Mensaje enviado!</p>
                <p className="text-[#6B7280] text-sm">Nos pondremos en contacto pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Nombre */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280] block mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E2D3D] placeholder:text-gray-400 focus:outline-none focus:border-[#2EBFC0] transition-colors"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280] block mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E2D3D] placeholder:text-gray-400 focus:outline-none focus:border-[#2EBFC0] transition-colors"
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280] block mb-2">
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Escribe tu mensaje..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E2D3D] placeholder:text-gray-400 focus:outline-none focus:border-[#2EBFC0] transition-colors resize-y"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm -mt-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#1E2D3D] hover:bg-[#162330] text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-60"
                >
                  {sending ? "Enviando…" : "Enviar mensaje"}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
