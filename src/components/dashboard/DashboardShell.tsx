"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import type { NavLink } from "./links";
import { defaultLinks } from "./links";

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
  const navLinks = links || defaultLinks;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTouch, setTouch] = useState(true);
  useEffect(() => setTouch(false), []);

  return (
    <div className="min-h-screen bg-brand-green-deeper text-stone-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-green-dark/80 border-r border-brand-green/30 backdrop-blur-xl transform transition-transform duration-200 ${
          sidebarOpen || !isTouch ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-brand-green/30">
          <Link href="/es" className="flex items-center gap-2">
            <img src="/icon.png" alt="AveGestoria" className="h-8 w-8" />
            <span className="text-base font-bold text-brand-gold">AveGestoria</span>
          </Link>
          <button
            className="md:hidden text-stone-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-brand-green/40 text-stone-100"
                    : "text-stone-400 hover:bg-brand-green/30 hover:text-stone-200"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-brand-green/30 my-3 pt-3">
            <a
              href="/es"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:bg-brand-green/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </a>
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-brand-green-dark/80 backdrop-blur-lg border-b border-brand-green/30 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-stone-400">
          <Menu className="w-5 h-5" />
        </button>
        <img src="/icon.png" alt="" className="h-6 w-6" />
        <span className="text-sm font-bold text-brand-gold">AveGestoria</span>
        {badge && (
          <div className="ml-auto">
            <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {/* Desktop top bar */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-stone-100">
              {navLinks.find((l) => pathname === l.href)?.label || "Dashboard"}
            </h1>
            {badge && (
              <span className="text-xs bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full font-medium">
                {badge}
              </span>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
