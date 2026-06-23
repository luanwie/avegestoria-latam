import {
  LayoutDashboard,
  Warehouse,
  Egg,
  Dna,
  Users,
  ClipboardList,
  DollarSign,
  FileText,
  MessageSquareMore,
  UserCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  label: string;
  icon: LucideIcon;
  href: string;
}

// Profesional users: simplified sidebar
export const hubLinks: NavLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/es/dashboard" },
  { label: "Producción", icon: ClipboardList, href: "/es/granja/produccion" },
  { label: "Finanzas", icon: DollarSign, href: "/es/granja/finanzas" },
  { label: "Informes", icon: FileText, href: "/es/granja/informes" },
  { label: "Chat IA", icon: MessageSquareMore, href: "/es/granja/chat" },
  { label: "Perfil", icon: UserCircle, href: "/es/perfil" },
];

// Esencial users: same but no Chat IA
export const esencialLinks: NavLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/es/dashboard" },
  { label: "Producción", icon: ClipboardList, href: "/es/granja/produccion" },
  { label: "Finanzas", icon: DollarSign, href: "/es/granja/finanzas" },
  { label: "Informes", icon: FileText, href: "/es/granja/informes" },
  { label: "Perfil", icon: UserCircle, href: "/es/perfil" },
];

export const adminLinks: NavLink[] = [
  ...hubLinks,
  { label: "Admin", icon: ShieldCheck, href: "/es/admin" },
];

export const adminEsencialLinks: NavLink[] = [
  ...esencialLinks,
  { label: "Admin", icon: ShieldCheck, href: "/es/admin" },
];

export function getPlanLinks(plan: string, role?: string): NavLink[] {
  const isAdmin = role === "admin";
  if (plan === "esencial") return isAdmin ? adminEsencialLinks : esencialLinks;
  return isAdmin ? adminLinks : hubLinks;
}
