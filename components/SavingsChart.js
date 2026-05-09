"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SavingsChart({ recommendations }) {
  const data = recommendations.map((rec) => ({
    name: rec.toolName.length > 10 ? rec.toolName.slice(0, 10) + "…" : rec.toolName,
    "Current Cost": parseFloat((rec.optimizedSpend + rec.savings).toFixed(2)),
    "Optimized Cost": parseFloat(rec.optimizedSpend.toFixed(2)),
    Savings: parseFloat(rec.savings.toFixed(2)),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-xl p-4 shadow-xl text-sm">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((p) => (
            <div key={p.name} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-muted-foreground">{p.name}:</span>
              <span className="font-semibold">${p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl border bg-card">
      <h2 className="font-bold text-lg mb-6">Savings Breakdown by Tool</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", paddingTop: "16px" }}
          />
          <Bar dataKey="Current Cost" fill="hsl(var(--destructive) / 0.6)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Optimized Cost" fill="hsl(142 76% 36% / 0.7)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
