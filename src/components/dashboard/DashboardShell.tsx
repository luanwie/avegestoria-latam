"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogOut, Menu, X, User } from "lucide-react";
import type { NavLink } from "./links";
import { getPlanLinks } from "./links";

const PLAN_LABELS: Record<string, string> = {
  esencial: "Esencial",
  profesional: "Profesional",
  profesional_plus: "Profesional+",
};

export default function DashboardShell({
  children,
  badge,
  links,
}: {
  children: React.ReactNode;
  badge?: string;
  links?: NavLink[];
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const plan = (session?.user as { plan?: string } | undefined)?.plan || "none";
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userName = session?.user?.name;
  const navLinks = links || getPlanLinks(plan, role);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTouch, setTouch] = useState(true);
  const planLabel = PLAN_LABELS[plan];
  const isAdmin = role === "admin";

  useEffect(() => setTouch(false), []);

  return (
    <div className="min-h-screen text-stone-100 flex relative">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen || !isTouch ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="absolute inset-0 glass-surface-strong border-r border-white/[0.04]" />

        {/* Logo area */}
        <div className="relative flex items-center gap-3 px-4 py-4 border-b border-white/[0.05]">
          <Link href="/es" className="flex items-center gap-2.5">
            <img src="/icon.png" alt="AveGestoria" className="h-7 w-7" />
            <span className="text-sm font-semibold tracking-tight text-stone-100">
              AveGestoria
            </span>
          </Link>
          <button className="md:hidden ml-auto text-stone-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 ${
                  active
                    ? "bg-brand-gold/8 text-brand-gold border border-brand-gold/15"
                    : "text-stone-400 hover:bg-white/[0.03] hover:text-stone-200 border border-transparent"
                }`}
              >
                <link.icon className={`w-4 h-4 ${active ? "text-brand-gold" : "text-stone-500"}`} />
                {link.label}
              </Link>
            );
          })}

          <div className="border-t border-white/[0.05] my-3 pt-3">
            <Link
              href="/es/perfil"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 ${
                pathname === "/es/perfil"
                  ? "bg-brand-gold/8 text-brand-gold border border-brand-gold/15"
                  : "text-stone-500 hover:bg-white/[0.03] hover:text-stone-300 border border-transparent"
              }`}
            >
              <User className="w-4 h-4" />
              {userName?.split(" ")[0] || "Perfil"}
            </Link>
            <a
              href="/es"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-stone-500 hover:bg-red-900/10 hover:text-red-400 transition-all duration-200 mt-0.5"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </a>
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 glass-surface-strong px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-stone-400">
          <Menu className="w-5 h-5" />
        </button>
        <img src="/icon.png" alt="" className="h-5 w-5" />
        <span className="text-sm font-semibold text-stone-200">AveGestoria</span>
        {(badge || planLabel) && (
          <span className="ml-auto text-[10px] bg-brand-gold/10 text-brand-gold/80 px-2 py-0.5 rounded-full border border-brand-gold/15">
            {badge || planLabel}
          </span>
        )}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-60 pt-14 md:pt-0 relative z-10">
        {/* Desktop top bar */}
        <div className="hidden md:flex items-center justify-between sticky top-0 z-20 glass-surface-strong px-6 py-3">
          <h1 className="text-sm font-medium text-stone-300 tracking-tight">
            {navLinks.find((l) => pathname === l.href || pathname.startsWith(l.href + "/"))?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            {(badge || planLabel) && (
              <span className="text-[10px] bg-brand-gold/8 text-brand-gold/70 px-2.5 py-1 rounded-full border border-brand-gold/15">
                {badge || planLabel}
              </span>
            )}
            {isAdmin && (
              <span className="text-[10px] bg-red-900/15 text-red-400/70 px-2.5 py-1 rounded-full border border-red-700/15">ADMIN</span>
            )}
            {userName && <span className="text-xs text-stone-500">{userName}</span>}
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
