"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const navLinks = [
  { label: "Inicio",    href: "#inicio" },
  { label: "Impacto",   href: "#impacto" },
  { label: "Temas",     href: "#temas" },
  { label: "Encuestas", href: "#encuestas" },
  { label: "Informes",  href: "#informes" },
  { label: "Videos",    href: "#videos" },
  { label: "Nosotros",  href: "#nosotros" },
  { label: "Contacto",  href: "#contacto" },
];

function smoothScrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    smoothScrollTo(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#inicio" onClick={(e) => handleLinkClick(e, "#inicio")} className="flex-shrink-0">
          <Image
            src="/logos/IC_Logo.png"
            alt="Impacto Colectivo"
            width={48}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1E2D3D]">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="relative pb-0.5 hover:text-[#2EBFC0] transition-colors duration-200
                           after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0
                           after:h-[2px] after:bg-[#2EBFC0] after:transition-all after:duration-200
                           hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + Mobile hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#encuestas"
            onClick={(e) => handleLinkClick(e, "#encuestas")}
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full border-2 border-[#1E2D3D]
                       text-sm font-bold text-[#1E2D3D] hover:bg-[#1E2D3D] hover:text-white
                       transition-all duration-200 hover:scale-105"
          >
            Participar
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md
                       hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span className={`block w-5 h-0.5 bg-[#1E2D3D] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#1E2D3D] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#1E2D3D] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block text-base font-medium text-[#1E2D3D] hover:text-[#2EBFC0] transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2 border-t border-gray-100">
            <a
              href="#encuestas"
              onClick={(e) => handleLinkClick(e, "#encuestas")}
              className="inline-flex items-center px-5 py-2 rounded-full border-2 border-[#1E2D3D]
                         text-sm font-bold text-[#1E2D3D] hover:bg-[#1E2D3D] hover:text-white transition-all"
            >
              Participar
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
