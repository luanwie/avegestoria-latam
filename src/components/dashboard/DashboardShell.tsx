"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogOut, Menu, X, User, Zap } from "lucide-react";
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
      {/* Background texture overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23eba61c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient blobs in background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-green/12 blur-[120px] animate-[blobMove_20s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-gold/4 blur-[100px] animate-[blobMove_20s_ease-in-out_infinite]" style={{ animationDelay: "-10s" }} />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] rounded-full bg-brand-green/8 blur-[100px] animate-[blobMove_20s_ease-in-out_infinite]" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transform transition-transform duration-200 ${
          sidebarOpen || !isTouch ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Sidebar bg with glass effect */}
        <div className="absolute inset-0 bg-brand-green-deeper/70 backdrop-blur-2xl border-r border-brand-green/20" />

        {/* Logo */}
        <div className="relative flex items-center justify-between px-4 py-4 border-b border-brand-green/20">
          <Link href="/es" className="flex items-center gap-2.5">
            <img src="/icon.png" alt="AveGestoria" className="h-8 w-8" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-brand-gold tracking-tight">AveGestoria</span>
              {planLabel && (
                <span className="text-[9px] text-brand-gold/60 -mt-0.5">{planLabel}</span>
              )}
            </div>
          </Link>
          <button className="md:hidden text-stone-400 hover:text-stone-200" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  active
                    ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-[0_0_20px_rgba(235,166,28,0.06)]"
                    : "text-stone-400 hover:bg-white/[0.04] hover:text-stone-200 border border-transparent"
                }`}
              >
                <link.icon className={`w-4 h-4 transition-colors ${active ? "text-brand-gold" : "text-stone-500 group-hover:text-stone-300"}`} />
                {link.label}
              </Link>
            );
          })}

          <div className="border-t border-brand-green/20 my-3 pt-3">
            <Link
              href="/es/perfil"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                pathname === "/es/perfil"
                  ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
                  : "text-stone-500 hover:bg-white/[0.04] hover:text-stone-300 border-transparent"
              }`}
            >
              <User className="w-4 h-4" />
              {userName?.split(" ")[0] || "Perfil"}
            </Link>
            <a
              href="/es"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:bg-red-900/10 hover:text-red-400 transition-all duration-200 border border-transparent mt-0.5"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </a>
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-brand-green-deeper/85 backdrop-blur-xl border-b border-brand-green/20 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-stone-400 hover:text-stone-200">
          <Menu className="w-5 h-5" />
        </button>
        <img src="/icon.png" alt="" className="h-6 w-6" />
        <span className="text-sm font-bold text-brand-gold">AveGestoria</span>
        {(badge || planLabel) && (
          <div className="ml-auto">
            <span className="text-[10px] bg-brand-gold/15 text-brand-gold/80 px-2 py-0.5 rounded-full font-medium border border-brand-gold/20">
              {badge || planLabel}
            </span>
          </div>
        )}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 pt-14 md:pt-0 relative z-10">
        {/* Desktop top bar */}
        <div className="hidden md:flex items-center justify-between sticky top-0 z-20 bg-brand-green-deeper/60 backdrop-blur-xl border-b border-brand-green/15 px-6 py-3">
          <h1 className="text-base font-semibold text-stone-200">
            {navLinks.find((l) => pathname === l.href || pathname.startsWith(l.href + "/"))?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            {(badge || planLabel) && (
              <span className="text-[10px] bg-brand-gold/10 text-brand-gold/80 px-2.5 py-1 rounded-full font-medium border border-brand-gold/20 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {badge || planLabel}
              </span>
            )}
            {isAdmin && (
              <span className="text-[10px] bg-red-900/20 text-red-400/80 px-2.5 py-1 rounded-full font-medium border border-red-700/20">
                ADMIN
              </span>
            )}
            {userName && (
              <span className="text-xs text-stone-500">
                {userName}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
