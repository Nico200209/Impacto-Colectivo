"use client";

import Image from "next/image";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdChat, MdEmail } from "react-icons/md";

const navLinks = [
  { label: "Temas",      href: "#temas" },
  { label: "Encuestas",  href: "#encuestas" },
  { label: "Informes",   href: "#informes" },
  { label: "Videos",     href: "#videos" },
  { label: "Nosotros",   href: "#nosotros" },
  { label: "Contacto",   href: "#contacto" },
];

const socials = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/impactocolectivord?igsh=MTdtanE4bTNjZWoyNg==" },
  { icon: FaTwitter,   label: "Twitter",   href: "#" },
  { icon: FaYoutube,   label: "YouTube",   href: "#" },
  { icon: MdChat,      label: "Mensajes",  href: "#" },
  { icon: MdEmail,     label: "Correo",    href: "mailto:impactocolectivo@outlook.com" },
];

function smoothScrollTo(href: string) {
  const el = document.getElementById(href.replace("#", ""));
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="bg-[#1a2535] py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* Col 1 — Brand + socials */}
          <div className="flex flex-col gap-5">
            {/* Logo box */}
            <div className="bg-white rounded-lg p-3 w-fit">
              <Image
                src="/logos/IC_Logo.png"
                alt="Impacto Colectivo"
                width={110}
                height={110}
                className="h-28 w-auto object-contain"
              />
            </div>

            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-[220px]">
              Análisis ciudadano independiente para una República Dominicana mejor informada.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  <Icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280] mb-5">
              Navegación
            </p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); smoothScrollTo(link.href); }}
                    className="text-sm text-[#D1D5DB] hover:text-[#2EBFC0] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B7280] mb-5">
              Contacto
            </p>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#D1D5DB]">impactocolectivo@outlook.com</p>
              <p className="text-sm text-[#D1D5DB]">Santo Domingo, República Dominicana</p>
              <a
                href="#participar"
                onClick={(e) => { e.preventDefault(); smoothScrollTo("#participar"); }}
                className="inline-flex items-center mt-2 px-4 py-2 rounded-lg border border-[#2EBFC0] text-[#2EBFC0] text-sm font-medium hover:bg-[#2EBFC0] hover:text-white transition-colors duration-200 w-fit"
              >
                Participar en el proyecto
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[#4B5563] text-xs">
            © 2026 Impacto Colectivo. Todos los derechos reservados.
          </p>
          <p className="text-[#4B5563] text-xs">República Dominicana</p>
        </div>

      </div>
    </footer>
  );
}
