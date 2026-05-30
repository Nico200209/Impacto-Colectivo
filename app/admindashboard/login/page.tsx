"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admindashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1E2D3D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#2EBFC0] mb-2">
            Impacto Colectivo
          </p>
          <h1 className="text-2xl font-bold text-white">Panel de administración</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[#6B7280] tracking-wide uppercase">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1E2D3D] text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#2EBFC0] focus:border-transparent"
              placeholder="••••••••"
              autoFocus
              required
            />
          </label>

          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl bg-[#2EBFC0] text-white font-semibold text-sm
                       hover:bg-[#27aaab] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
