"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { BarChart3, TrendingUp, Egg, HeartPulse } from "lucide-react";

interface ChartDataPoint {
  fecha: string;
  ingresos: number;
  gastos: number;
  huevos: number;
  mortalidad: number;
}

export default function DashboardCharts({
  data,
}: {
  data: ChartDataPoint[];
}) {
  if (!data || data.length === 0) return null;

  // Format dates for display
  const chart = data.map((d) => ({
    ...d,
    label: d.fecha.slice(5), // "MM-DD"
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Ingresos vs Gastos */}
      <ChartCard
        title="Ingresos vs Gastos"
        icon={<BarChart3 className="w-4 h-4 text-teal-400" />}
      >
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chart}>
            <XAxis
              dataKey="label"
              tick={{ fill: "#78716c", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#78716c", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a2e22",
                border: "1px solid #2d5a40",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#d6d3d1" }}
            />
            <Bar dataKey="ingresos" fill="#059669" radius={[3, 3, 0, 0]} />
            <Bar dataKey="gastos" fill="#d97706" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <LegendItem
          items={[
            { color: "#059669", label: "Ingresos" },
            { color: "#d97706", label: "Gastos" },
          ]}
        />
      </ChartCard>

      {/* Producción de Huevos */}
      <ChartCard
        title="Producción de Huevos"
        icon={<Egg className="w-4 h-4 text-amber-400" />}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d5a40" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#78716c", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#78716c", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a2e22",
                border: "1px solid #2d5a40",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#d6d3d1" }}
            />
            <Line
              type="monotone"
              dataKey="huevos"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: "#f59e0b" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <LegendItem items={[{ color: "#f59e0b", label: "Huevos" }]} />
      </ChartCard>

      {/* Mortalidad */}
      <ChartCard
        title="Mortalidad"
        icon={<HeartPulse className="w-4 h-4 text-rose-400" />}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d5a40" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#78716c", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#78716c", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a2e22",
                border: "1px solid #2d5a40",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#d6d3d1" }}
            />
            <Line
              type="monotone"
              dataKey="mortalidad"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ r: 3, fill: "#f43f5e" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <LegendItem items={[{ color: "#f43f5e", label: "Aves" }]} />
      </ChartCard>

      {/* Consumo de Ración (placeholder) */}
      <ChartCard
        title="Consumo de Ración"
        icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
      >
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-stone-500">
            Registra producción de ración para ver el gráfico
          </p>
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function LegendItem({
  items,
}: {
  items: Array<{ color: string; label: string }>;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-stone-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
