"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type ImpactLevel = "High" | "Medium" | "Low";
type SignalType = "Risk" | "Opportunity" | "Structural Change";
type TrendDir = "up" | "down" | "flat";

interface ExternalSignal {
  id: number;
  title: string;
  subtitle: string;
  type: SignalType;
  impact: ImpactLevel;
  impactDir: TrendDir;
  entities: number;
  source: string;
  timeframe: string;
  score: number;
}

interface HeatmapRow {
  industry: string;
  risk: ImpactLevel;
  opportunity: ImpactLevel;
  structuralChange: ImpactLevel;
  overall: "High" | "Medium" | "Low";
}

interface Theme {
  icon: string;
  title: string;
  desc: string;
  impact: ImpactLevel;
  relevance: ImpactLevel;
  trajectory: string;
  trajectoryDir: "up" | "flat";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const trendData = [
  { date: "Feb 20", risk: 8, opportunity: 6, structural: 3 },
  { date: "Mar 5", risk: 10, opportunity: 7, structural: 4 },
  { date: "Mar 19", risk: 11, opportunity: 8, structural: 3 },
  { date: "Apr 2", risk: 13, opportunity: 9, structural: 4 },
  { date: "Apr 16", risk: 14, opportunity: 10, structural: 5 },
  { date: "Apr 30", risk: 16, opportunity: 11, structural: 5 },
  { date: "May 14", risk: 19, opportunity: 12, structural: 5 },
];

const topSignals: ExternalSignal[] = [
  {
    id: 1,
    title: "RBI keeps interest rates unchanged",
    subtitle: "Repo rate remains at 6.50% for the 8th consecutive time.",
    type: "Risk",
    impact: "High",
    impactDir: "up",
    entities: 2,
    source: "RBI Official Release",
    timeframe: "0–30 Days",
    score: 85,
  },
  {
    id: 2,
    title: "Government announces EV policy incentives",
    subtitle: "FAME III extended with higher subsidies for FY25.",
    type: "Opportunity",
    impact: "High",
    impactDir: "up",
    entities: 1,
    source: "Ministry of Heavy Industries",
    timeframe: "0–60 Days",
    score: 82,
  },
  {
    id: 3,
    title: "Crude oil prices rise above $90/barrel",
    subtitle: "Geopolitical tensions in Middle East driving up prices.",
    type: "Risk",
    impact: "Medium",
    impactDir: "up",
    entities: 3,
    source: "Reuters",
    timeframe: "0–30 Days",
    score: 68,
  },
  {
    id: 4,
    title: "AI chip shortage expected to continue in 2024",
    subtitle: "High demand and limited supply to impact tech sector.",
    type: "Structural Change",
    impact: "Medium",
    impactDir: "flat",
    entities: 2,
    source: "McKinsey Report",
    timeframe: "30–90 Days",
    score: 64,
  },
  {
    id: 5,
    title: "Global demand for packaged foods to grow 6.2% CAGR",
    subtitle: "Driven by urbanization and changing consumer habits.",
    type: "Opportunity",
    impact: "Medium",
    impactDir: "up",
    entities: 1,
    source: "Statista",
    timeframe: "30–90 Days",
    score: 62,
  },
];

const heatmapData: HeatmapRow[] = [
  { industry: "Automotive", risk: "High", opportunity: "Medium", structuralChange: "Medium", overall: "High" },
  { industry: "Construction", risk: "High", opportunity: "Medium", structuralChange: "Low", overall: "High" },
  { industry: "FMCG", risk: "Medium", opportunity: "High", structuralChange: "Medium", overall: "Medium" },
  { industry: "Healthcare", risk: "Low", opportunity: "Medium", structuralChange: "High", overall: "Medium" },
  { industry: "Financial Services", risk: "Medium", opportunity: "High", structuralChange: "High", overall: "High" },
  { industry: "Technology", risk: "Medium", opportunity: "High", structuralChange: "High", overall: "High" },
];

const emergingThemes: Theme[] = [
  {
    icon: "🤖",
    title: "Artificial Intelligence Disruption",
    desc: "AI adoption accelerating across industries; investment and regulation increasing.",
    impact: "High",
    relevance: "High",
    trajectory: "Accelerating",
    trajectoryDir: "up",
  },
  {
    icon: "🌱",
    title: "Sustainability & Green Transition",
    desc: "Carbon regulations, clean energy shift and sustainable sourcing gaining momentum.",
    impact: "High",
    relevance: "High",
    trajectory: "Accelerating",
    trajectoryDir: "up",
  },
  {
    icon: "⚖️",
    title: "Regulatory Tightening",
    desc: "Governments are tightening compliance across finance, labor and environment.",
    impact: "Medium",
    relevance: "High",
    trajectory: "Steady",
    trajectoryDir: "flat",
  },
  {
    icon: "🌍",
    title: "Geopolitical Uncertainty",
    desc: "Trade tensions, elections and conflicts creating supply chain volatility.",
    impact: "High",
    relevance: "Medium",
    trajectory: "Steady",
    trajectoryDir: "flat",
  },
  {
    icon: "👥",
    title: "Future of Work",
    desc: "Workforce skills shift, gig economy growth and remote work continuation.",
    impact: "Medium",
    relevance: "Medium",
    trajectory: "Evolving",
    trajectoryDir: "up",
  },
];

const sourceData = [
  { name: "News & Media", value: 96, color: "#6366f1" },
  { name: "Government & Policy", value: 52, color: "#f59e0b" },
  { name: "Industry Research", value: 44, color: "#10b981" },
  { name: "Market Data Providers", value: 28, color: "#3b82f6" },
  { name: "Social & Web", value: 16, color: "#ec4899" },
  { name: "Other Sources", value: 10, color: "#94a3b8" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const impactColor = (level: ImpactLevel) => {
  if (level === "High") return "text-red-500";
  if (level === "Medium") return "text-amber-500";
  return "text-green-500";
};

const impactBadge = (level: ImpactLevel) => {
  if (level === "High")
    return "badge badge-sm bg-red-100 text-red-600 border-0 font-semibold";
  if (level === "Medium")
    return "badge badge-sm bg-amber-100 text-amber-600 border-0 font-semibold";
  return "badge badge-sm bg-green-100 text-green-600 border-0 font-semibold";
};

const overallBar = (level: "High" | "Medium" | "Low") => {
  const base = "h-2 rounded-full";
  if (level === "High") return `${base} bg-red-500 w-full`;
  if (level === "Medium") return `${base} bg-amber-400 w-3/4`;
  return `${base} bg-green-500 w-1/2`;
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 65) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
};

const typeIcon = (type: SignalType) => {
  if (type === "Risk") return "🛡️";
  if (type === "Opportunity") return "🎯";
  return "🔄";
};

const typeBadgeClass = (type: SignalType) => {
  if (type === "Risk") return "bg-red-50 text-red-600";
  if (type === "Opportunity") return "bg-green-50 text-green-600";
  return "bg-blue-50 text-blue-600";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<{
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  valueClass?: string;
}> = ({ title, value, sub, icon, valueClass = "text-gray-800" }) => (
  <div className="card bg-white border border-gray-100 shadow-sm flex-1 min-w-[140px]">
    <div className="card-body p-4 gap-1">
      <div className="flex items-start justify-between">
        <span className="text-xs text-gray-500 font-medium">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${valueClass}`}>{value}</div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
  </div>
);

const SignalBreakdownCard: React.FC<{
  icon: string;
  title: string;
  desc: string;
  count: number;
  high: number;
  medium: number;
  low: number;
  barColor: string;
}> = ({ icon, title, desc, count, high, medium, low, barColor }) => (
  <div className="card bg-white border border-gray-100 shadow-sm flex-1">
    <div className="card-body p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <div>
          <div className="font-semibold text-sm text-gray-800">{title}</div>
          <div className="text-xs text-gray-400">{desc}</div>
        </div>
        <div className={`ml-auto text-3xl font-bold ${barColor}`}>{count}</div>
      </div>
      <div className={`h-1.5 rounded-full ${barColor.replace("text-", "bg-")} opacity-80 w-full mb-2`} />
      <div className="flex gap-4 text-xs">
        <span>
          High <span className="text-red-500 font-semibold">{high}</span>
        </span>
        <span>
          Medium <span className="text-amber-500 font-semibold">{medium}</span>
        </span>
        <span>
          Low <span className="text-green-500 font-semibold">{low}</span>
        </span>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Market: React.FC = () => {
  const [viewBy, setViewBy] = useState("All Signals");
  const [impact, setImpact] = useState("All");
  const [entity, setEntity] = useState("All");
  const [timeframe, setTimeframe] = useState("Next 90 Days");

  return (
    <div className="min-h-full bg-white font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market & External Signals</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Stay ahead with relevant market intelligence, industry shifts, risks and opportunities.
          </p>
        </div>

        {/* ── KPI Cards ── */}
        <div className="flex gap-3 flex-wrap">
          {/* Overall Signal Score – gauge card */}
          <div className="card bg-white border border-gray-100 shadow-sm flex-1 min-w-[180px]">
            <div className="card-body p-4 gap-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">Overall Signal Score</span>
                <span className="text-gray-400 text-xs">ⓘ</span>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-4xl font-bold text-amber-500">68</span>
                <span className="text-lg text-gray-400 mb-1">/100</span>
                {/* mini gauge bar */}
                <div className="flex-1 mb-1">
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-green-400 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-amber-500 rounded-full shadow"
                      style={{ left: "64%" }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs font-semibold text-amber-600">Moderate</div>
              <div className="text-xs text-gray-400">↑ 5 pts vs last month</div>
            </div>
          </div>

          <StatCard title="High Priority Signals" value={8} sub="vs 6 last month" icon="⚠️" valueClass="text-red-500" />
          <StatCard title="Opportunities" value={14} sub="vs 11 last month" icon="🎯" valueClass="text-green-600" />
          <StatCard title="Risks" value={12} sub="vs 9 last month" icon="🛡️" valueClass="text-amber-500" />
          <StatCard title="Structural Changes" value={7} sub="vs 5 last month" icon="🔄" valueClass="text-blue-500" />
        </div>

        {/* ── Filter Bar ── */}
        <div className="card bg-white border border-gray-100 shadow-sm">
          <div className="card-body p-3 flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">View by:</span>
              <select
                className="select select-sm select-bordered text-xs"
                value={viewBy}
                onChange={(e) => setViewBy(e.target.value)}
              >
                <option>All Signals</option>
                <option>Risks</option>
                <option>Opportunities</option>
                <option>Structural Change</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Impact:</span>
              <select
                className="select select-sm select-bordered text-xs"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
              >
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Entity / Industry:</span>
              <select
                className="select select-sm select-bordered text-xs"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
              >
                <option>All</option>
                <option>Automotive</option>
                <option>Technology</option>
                <option>FMCG</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Timeframe:</span>
              <select
                className="select select-sm select-bordered text-xs"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option>Next 90 Days</option>
                <option>Next 30 Days</option>
                <option>Next 60 Days</option>
              </select>
            </div>
            <div className="ml-auto">
              <button className="btn btn-sm btn-outline text-xs gap-1">
                <span>⚙️</span> Customize Feed
              </button>
            </div>
          </div>
        </div>

        {/* ── Signal Breakdown ── */}
        <div>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-gray-800">Signal Breakdown</h2>
            <p className="text-xs text-gray-400">Distribution of external signals by category</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <SignalBreakdownCard
              icon="🛡️"
              title="Risk"
              desc="Potential threats and negative impacts"
              count={12}
              high={4}
              medium={5}
              low={3}
              barColor="text-red-500"
            />
            <SignalBreakdownCard
              icon="🎯"
              title="Opportunity"
              desc="Potential growth and positive impacts"
              count={14}
              high={5}
              medium={6}
              low={3}
              barColor="text-green-500"
            />
            <SignalBreakdownCard
              icon="🔄"
              title="Structural Change"
              desc="Long term shifts and emerging trends"
              count={7}
              high={2}
              medium={3}
              low={2}
              barColor="text-blue-500"
            />
          </div>
        </div>

        {/* ── Top External Signals ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Top External Signals</h2>
              <p className="text-xs text-gray-400">Curated from external sources and public domain</p>
            </div>
            <button className="text-xs text-indigo-600 hover:underline font-medium">
              View all signals →
            </button>
          </div>

          <div className="card bg-white border border-gray-100 shadow-sm overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="font-medium py-3 pl-4">Signal</th>
                  <th className="font-medium">Type</th>
                  <th className="font-medium">Impact</th>
                  <th className="font-medium">Entities / Industries</th>
                  <th className="font-medium">Source</th>
                  <th className="font-medium">Timeframe</th>
                  <th className="font-medium pr-4 text-right">Signal Score</th>
                </tr>
              </thead>
              <tbody>
                {topSignals.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-base mt-0.5">{typeIcon(s.type)}</span>
                        <div>
                          <div className="font-medium text-sm text-gray-800">{s.title}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[220px]">{s.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeClass(s.type)}`}>
                        {s.type}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-semibold ${impactColor(s.impact)}`}>{s.impact}</span>
                        <span className="text-xs">{s.impactDir === "up" ? "↑" : s.impactDir === "down" ? "↓" : "→"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <span>⚙️</span><span>🛡️</span><span>🎯</span>
                        {s.entities > 0 && (
                          <span className="text-gray-400">+{s.entities}</span>
                        )}
                      </div>
                    </td>
                    <td className="text-xs text-gray-500 flex items-center gap-1 pt-3">
                      <span>📅</span> {s.source}
                    </td>
                    <td>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <span>🗓️</span> {s.timeframe}
                      </span>
                    </td>
                    <td className="pr-4 text-right">
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${scoreColor(s.score)}`}>
                        {s.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 2 — Heatmap + Trend + Themes + Sources
        ════════════════════════════════════════════ */}

        {/* ── Row: Heatmap + Trend Chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Signals Heatmap */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-semibold text-sm text-gray-800">Signals Heatmap</h3>
              <p className="text-xs text-gray-400 mb-3">
                Intensity of external impact across industries and business areas
              </p>
              <table className="table table-xs w-full">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="font-medium text-left py-2">Industry / Area</th>
                    <th className="font-medium text-center">Risk</th>
                    <th className="font-medium text-center">Opportunity</th>
                    <th className="font-medium text-center">Structural Change</th>
                    <th className="font-medium text-center">Overall Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.industry} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 font-medium text-gray-700 text-xs">{row.industry}</td>
                      <td className="text-center">
                        <span className={`text-xs font-semibold ${impactColor(row.risk)}`}>{row.risk}</span>
                      </td>
                      <td className="text-center">
                        <span className={`text-xs font-semibold ${impactColor(row.opportunity)}`}>{row.opportunity}</span>
                      </td>
                      <td className="text-center">
                        <span className={`text-xs font-semibold ${impactColor(row.structuralChange)}`}>{row.structuralChange}</span>
                      </td>
                      <td className="text-center py-2 px-3">
                        <div className="w-24">
                          <div className={overallBar(row.overall)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2">
                <button className="text-xs text-indigo-600 hover:underline font-medium">
                  View industry impact matrix →
                </button>
              </div>
            </div>
          </div>

          {/* Signals Trend Chart */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">Signals Trend (90 Days)</h3>
                  <p className="text-xs text-gray-400">Volume of high priority signals over time</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    formatter={(value) =>
                      value === "risk" ? "Risk" : value === "opportunity" ? "Opportunity" : "Structural Change"
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#ef4444" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="opportunity"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10b981" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="structural"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3b82f6" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-1">
                <button className="text-xs text-indigo-600 hover:underline font-medium">
                  View trend analysis →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row: Key Emerging Themes + External Source Coverage ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Key Emerging Themes */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-semibold text-sm text-gray-800">Key Emerging Themes</h3>
              <p className="text-xs text-gray-400 mb-3">Themes shaping the external environment</p>
              <div className="space-y-3">
                {emergingThemes.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <span className="text-xl mt-0.5">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-gray-800">{t.title}</div>
                      <div className="text-xs text-gray-400 truncate">{t.desc}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 text-xs">
                      <div className="flex gap-1">
                        <span className="text-gray-400">Impact</span>
                        <span className={`font-semibold ${impactColor(t.impact)}`}>{t.impact}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-gray-400">Rel.</span>
                        <span className={`font-semibold ${impactColor(t.relevance)}`}>{t.relevance}</span>
                      </div>
                      <div className="text-indigo-500 font-medium">
                        {t.trajectoryDir === "up" ? "↑" : "→"} {t.trajectory}
                      </div>
                    </div>
                    <button className="text-xs text-indigo-500 shrink-0 hover:underline">
                      View details →
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <button className="text-xs text-indigo-600 hover:underline font-medium">
                  View all themes →
                </button>
              </div>
            </div>
          </div>

          {/* External Source Coverage */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-semibold text-sm text-gray-800">External Source Coverage</h3>
              <p className="text-xs text-gray-400 mb-3">Diversity of sources powering the insights</p>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx={85}
                        cy={85}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-xs text-gray-400">Total Sources</div>
                    <div className="text-2xl font-bold text-gray-800">246</div>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {sourceData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: s.color }}
                        />
                        <span className="text-gray-600">{s.name}</span>
                      </div>
                      <span className="text-gray-500 font-medium">
                        {s.value}{" "}
                        <span className="text-gray-400">
                          ({Math.round((s.value / 246) * 100)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <button className="text-xs text-indigo-600 hover:underline font-medium">
                  View all sources →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between text-xs text-gray-400 py-2">
          <span>🕐 Last updated: 20 May 2024, 08:30 AM &nbsp; | &nbsp; Auto refresh: On 🟢 &nbsp; | &nbsp; Next refresh in 14:32</span>
          <button className="text-indigo-500 hover:underline font-medium">🔄 Refresh now</button>
        </div>

      </div>
    </div>
  );
};

export default Market;