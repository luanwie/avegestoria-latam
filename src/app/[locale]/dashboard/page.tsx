"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ClipboardList, Egg, DollarSign, Package, Users, FileText, LogOut, Menu, X, Plus, TrendingUp, ArrowUpRight, BarChart3 } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#" },
  { label: "Registrar", icon: ClipboardList, href: "#" },
  { label: "Producción", icon: Egg, href: "#" },
  { label: "Finanzas", icon: DollarSign, href: "#" },
  { label: "Inventario", icon: Package, href: "#" },
  { label: "Equipo", icon: Users, href: "#" },
  { label: "Informes", icon: FileText, href: "#" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTouch, setTouch] = useState(true);
  useEffect(() => setTouch(false), []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/es/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-emerald-950 text-stone-100 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-emerald-900/60 border-r border-emerald-800/40 backdrop-blur-xl transform transition-transform ${sidebarOpen || !isTouch ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-800/40">
          <Link href="/es" className="text-lg font-bold text-teal-300">AveGestoria</Link>
          <button className="md:hidden text-stone-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <a key={link.label} href={link.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-emerald-800/40 transition-colors">
              <link.icon className="w-4 h-4" />{link.label}
            </a>
          ))}
          <div className="border-t border-emerald-800/40 my-3 pt-3">
            <a href="/es" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-emerald-800/40 transition-colors">
              <LogOut className="w-4 h-4" />Salir
            </a>
          </div>
        </nav>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-emerald-900/80 backdrop-blur-lg border-b border-emerald-800/40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-stone-400"><Menu className="w-5 h-5" /></button>
        <span className="text-sm font-bold text-teal-300">AveGestoria</span>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-stone-400 mt-1">
              Bienvenido, {session?.user?.name || "Productor"}
            </p>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-8 text-center">
            <Egg className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-stone-200 mb-2">
              Tu granja vacía
            </h2>
            <p className="text-sm text-stone-400 mb-6 max-w-md mx-auto">
              Registra tu primer galpón y lote para empezar a controlar tu producción en tiempo real.
            </p>
            <Link href="/es/auth/register" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all">
              <Plus className="w-4 h-4" />
              Crear mi primer galpón
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
