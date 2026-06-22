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
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const hubLinks: NavLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/es/dashboard" },
  { label: "Galpones", icon: Warehouse, href: "/es/granja/galpones" },
  { label: "Lotes", icon: Egg, href: "/es/granja/lotes" },
  { label: "Razas", icon: Dna, href: "/es/granja/razas" },
  { label: "Producción", icon: ClipboardList, href: "/es/granja/produccion" },
  { label: "Finanzas", icon: DollarSign, href: "/es/granja/finanzas" },
  { label: "Informes", icon: FileText, href: "/es/granja/informes" },
  { label: "Chat IA", icon: MessageSquareMore, href: "/es/granja/chat" },
];

export const defaultLinks: NavLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/es/dashboard" },
  { label: "Registrar", icon: ClipboardList, href: "#" },
  { label: "Producción", icon: Egg, href: "#" },
  { label: "Finanzas", icon: DollarSign, href: "#" },
  { label: "Inventario", icon: Warehouse, href: "#" },
  { label: "Equipo", icon: Users, href: "#" },
  { label: "Informes", icon: FileText, href: "#" },
];
