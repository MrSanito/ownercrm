"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportCategory =
  | "Financial"
  | "Operational"
  | "Strategic"
  | "Compliance"
  | "Performance"
  | "Risk"
  | "Other";

type Format = "PDF" | "Excel" | "PPT";

interface RecentReport {
  id: number;
  name: string;
  subtitle: string;
  category: ReportCategory;
  entityDept: string;
  entitySub: string;
  generatedOn: string;
  generatedBy: string;
  generatedByRole: string;
  format: Format;
}

interface PopularReport {
  rank: number;
  name: string;
  category: ReportCategory;
  views: number;
  downloads: number;
  lastViewed: string;
}

interface ScheduledReport {
  icon: string;
  name: string;
  frequency: string;
  nextRun: string;
  recipients: number;
  status: "Active" | "Paused";
}

interface EntityDist {
  name: string;
  value: number;
  pct: string;
  color: string;
}

interface DeptDist {
  name: string;
  count: number;
  pct: string;
  icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const trendData = [
  { month: "Dec '23", count: 45 },
  { month: "Jan '24", count: 48 },
  { month: "Feb '24", count: 52 },
  { month: "Mar '24", count: 61 },
  { month: "Apr '24", count: 58 },
  { month: "May '24", count: 67 },
];

const categoryData = [
  { name: "Financial Reports", value: 42, pct: "26.9%", color: "#6366f1" },
  { name: "Operational Reports", value: 38, pct: "24.4%", color: "#f59e0b" },
  { name: "Strategic Reports", value: 26, pct: "16.7%", color: "#10b981" },
  { name: "Compliance Reports", value: 18, pct: "11.5%", color: "#3b82f6" },
  { name: "Performance Reports", value: 16, pct: "10.3%", color: "#ec4899" },
  { name: "Risk Reports", value: 10, pct: "6.4%", color: "#f97316" },
  { name: "Other Reports", value: 6, pct: "3.8%", color: "#94a3b8" },
];

const recentReports: RecentReport[] = [
  {
    id: 1,
    name: "Consolidated Financial Performance Report (YTD)",
    subtitle: "Financial summary across all entities",
    category: "Financial",
    entityDept: "All Entities",
    entitySub: "",
    generatedOn: "19 May 2024, 09:30 AM",
    generatedBy: "Arjun Mehta",
    generatedByRole: "Owner",
    format: "PDF",
  },
  {
    id: 2,
    name: "Operational Excellence Report",
    subtitle: "Operations performance and efficiency metrics",
    category: "Operational",
    entityDept: "AutoX Industries",
    entitySub: "Operations",
    generatedOn: "18 May 2024, 04:15 PM",
    generatedBy: "Neha Kapoor",
    generatedByRole: "COO",
    format: "Excel",
  },
];

const entityDistData: EntityDist[] = [
  { name: "AutoX Industries", value: 42, pct: "26.9%", color: "#6366f1" },
  { name: "BuildMax Infra", value: 34, pct: "21.8%", color: "#f59e0b" },
  { name: "AgriPure Foods", value: 28, pct: "17.9%", color: "#10b981" },
  { name: "HealthPlus", value: 20, pct: "12.8%", color: "#3b82f6" },
  { name: "FinEdge Capital", value: 18, pct: "11.5%", color: "#ec4899" },
  { name: "TechNova Systems", value: 14, pct: "9.0%", color: "#f97316" },
];

const deptDistData: DeptDist[] = [
  { name: "Finance", count: 48, pct: "30.8%", icon: "💰" },
  { name: "Operations", count: 36, pct: "23.1%", icon: "⚙️" },
  { name: "Strategy", count: 22, pct: "14.1%", icon: "♟️" },
  { name: "Sales & Marketing", count: 18, pct: "11.5%", icon: "📈" },
  { name: "HR", count: 10, pct: "6.4%", icon: "👥" },
  { name: "IT", count: 8, pct: "5.1%", icon: "💻" },
  { name: "Compliance", count: 6, pct: "3.8%", icon: "✅" },
  { name: "Procurement", count: 6, pct: "3.8%", icon: "🛒" },
];

const popularReports: PopularReport[] = [
  { rank: 1, name: "Consolidated Financial Performance (YTD)", category: "Financial", views: 342, downloads: 186, lastViewed: "19 May 2024" },
  { rank: 2, name: "Operational Excellence Report", category: "Operational", views: 298, downloads: 164, lastViewed: "18 May 2024" },
  { rank: 3, name: "Sales Performance Analysis", category: "Performance", views: 256, downloads: 132, lastViewed: "17 May 2024" },
  { rank: 4, name: "Cash Flow & Liquidity Report", category: "Financial", views: 241, downloads: 118, lastViewed: "16 May 2024" },
  { rank: 5, name: "Strategic Initiatives Tracker", category: "Strategic", views: 210, downloads: 101, lastViewed: "15 May 2024" },
];

const scheduledReports: ScheduledReport[] = [
  { icon: "📊", name: "Weekly Operations Summary", frequency: "Weekly", nextRun: "21 May 2024, 08:00 AM", recipients: 12, status: "Active" },
  { icon: "📑", name: "Monthly Financial Pack", frequency: "Monthly", nextRun: "31 May 2024, 09:00 AM", recipients: 18, status: "Active" },
  { icon: "📈", name: "Sales Performance Report", frequency: "Weekly", nextRun: "21 May 2024, 07:30 AM", recipients: 10, status: "Active" },
  { icon: "✅", name: "Compliance Monitoring Report", frequency: "Monthly", nextRun: "01 Jun 2024, 10:00 AM", recipients: 8, status: "Active" },
  { icon: "📋", name: "Board Dashboard Summary", frequency: "Monthly", nextRun: "25 May 2024, 11:00 AM", recipients: 6, status: "Active" },
];

const quickActions = [
  { icon: "📄", label: "Create Report" },
  { icon: "🔍", label: "Query Builder" },
  { icon: "🗂️", label: "Data Explorer" },
  { icon: "📐", label: "Report Templates" },
  { icon: "🔒", label: "Manage Access" },
  { icon: "⚙️", label: "Report Settings" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const catBadge = (cat: ReportCategory) => {
  const map: Record<ReportCategory, string> = {
    Financial: "bg-indigo-100 text-indigo-600",
    Operational: "bg-amber-100 text-amber-600",
    Strategic: "bg-green-100 text-green-600",
    Compliance: "bg-blue-100 text-blue-600",
    Performance: "bg-pink-100 text-pink-600",
    Risk: "bg-orange-100 text-orange-600",
    Other: "bg-gray-100 text-gray-600",
  };
  return map[cat] ?? "bg-gray-100 text-gray-600";
};

const formatBadge = (fmt: Format) => {
  const map: Record<Format, string> = {
    PDF: "bg-red-100 text-red-600",
    Excel: "bg-green-100 text-green-600",
    PPT: "bg-orange-100 text-orange-600",
  };
  return map[fmt] ?? "bg-gray-100 text-gray-600";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta: string;
  deltaPositive?: boolean;
}> = ({ icon, label, value, delta, deltaPositive = true }) => (
  <div className="card bg-white border border-gray-100 shadow-sm flex-1 min-w-[120px]">
    <div className="card-body p-4 gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className={`text-xs font-medium ${deltaPositive ? "text-green-500" : "text-red-500"}`}>
        {deltaPositive ? "↑" : "↓"} {delta}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"category" | "entity" | "department" | "frequency" | "owner">("category");

  const overviewTabs = [
    { key: "category", label: "By Category" },
    { key: "entity", label: "By Entity" },
    { key: "department", label: "By Department" },
    { key: "frequency", label: "By Frequency" },
    { key: "owner", label: "By Owner" },
  ] as const;

  return (
    <div className="min-h-full bg-white font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Comprehensive insights across all entities, departments and functions.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-outline gap-1 text-xs">
              📅 Scheduled Reports
            </button>
            <button className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0 gap-1 text-xs">
              + New Report
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="flex gap-3 flex-wrap">
          <KpiCard icon="📋" label="Total Reports" value={156} delta="12 vs last month" />
          <KpiCard icon="📊" label="Reports Generated" value={89} delta="8 vs last month" />
          <KpiCard icon="📅" label="Scheduled" value={34} delta="5 vs last month" />
          <KpiCard icon="⬇️" label="Downloads" value={642} delta="22% vs last month" />
          <KpiCard icon="👤" label="Shared" value={128} delta="15% vs last month" />
          <div className="card bg-white border border-gray-100 shadow-sm flex-1 min-w-[120px]">
            <div className="card-body p-4 gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Data Accuracy</span>
                <span className="text-xl">🛡️</span>
              </div>
              <div className="text-2xl font-bold text-green-600">98.6%</div>
              <div className="text-xs font-medium text-green-500">↑ 1.2 pts vs last month</div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SECTION 1 — Reports Overview
        ═══════════════════════════════════════ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">Reports Overview</h2>
            <button className="text-xs text-indigo-600 hover:underline font-medium">
              View all categories →
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-bordered mb-4">
            {overviewTabs.map((t) => (
              <button
                key={t.key}
                className={`tab tab-sm text-xs font-medium ${activeTab === t.key ? "tab-active text-indigo-600 border-indigo-600" : "text-gray-500"}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Donut Chart + Legend */}
            <div className="card bg-white border border-gray-100 shadow-sm">
              <div className="card-body p-4 flex flex-row items-center gap-4">
                <div className="relative shrink-0">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx={75}
                        cy={75}
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={1.5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-xl font-bold text-gray-800">156</div>
                    <div className="text-[10px] text-gray-400 leading-tight text-center">Total<br />Reports</div>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {categoryData.map((c) => (
                    <div key={c.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="flex-1 text-gray-600 truncate">{c.name}</span>
                      <span className="text-gray-500 font-medium shrink-0">{c.value} ({c.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports Trend */}
            <div className="card bg-white border border-gray-100 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Reports Trend</h3>
                    <p className="text-xs text-gray-400">Number of reports generated over time</p>
                  </div>
                  <select className="select select-xs select-bordered text-xs">
                    <option>Monthly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} domain={[30, 80]} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                      formatter={(v) => [v, "Reports"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                      label={{ position: "top", fontSize: 10, fill: "#6366f1", fontWeight: 600 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Reports ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Recent Reports</h2>
              <p className="text-xs text-gray-400">Recently generated and accessed reports</p>
            </div>
            <button className="text-xs text-indigo-600 hover:underline font-medium">View all reports →</button>
          </div>
          <div className="card bg-white border border-gray-100 shadow-sm overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="font-medium py-3 pl-4">Report Name</th>
                  <th className="font-medium">Category</th>
                  <th className="font-medium">Entity / Department</th>
                  <th className="font-medium">Generated On</th>
                  <th className="font-medium">Generated By</th>
                  <th className="font-medium">Format</th>
                  <th className="font-medium pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">📄</span>
                        <div>
                          <div className="font-medium text-xs text-gray-800">{r.name}</div>
                          <div className="text-xs text-gray-400">{r.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catBadge(r.category)}`}>
                        {r.category}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-gray-700">{r.entityDept}</div>
                      {r.entitySub && <div className="text-xs text-gray-400">{r.entitySub}</div>}
                    </td>
                    <td className="text-xs text-gray-500">{r.generatedOn}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {r.generatedBy.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-700">{r.generatedBy}</div>
                          <div className="text-xs text-gray-400">{r.generatedByRole}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${formatBadge(r.format)}`}>
                        {r.format}
                      </span>
                    </td>
                    <td className="pr-4">
                      <div className="flex gap-1">
                        <button className="btn btn-xs btn-ghost">⬇️</button>
                        <button className="btn btn-xs btn-ghost">↗️</button>
                        <button className="btn btn-xs btn-ghost">•••</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SECTION 2 — Distribution + Popular + Scheduled
        ═══════════════════════════════════════ */}

        {/* ── Distribution Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Entity Distribution */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-semibold text-sm text-gray-800">Entity Distribution</h3>
              <p className="text-xs text-gray-400 mb-3">Reports generated by entity</p>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={entityDistData} cx={55} cy={55} innerRadius={35} outerRadius={55} paddingAngle={1.5} dataKey="value">
                        {entityDistData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-lg font-bold text-gray-800">156</div>
                    <div className="text-[9px] text-gray-400 text-center">Total</div>
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  {entityDistData.map((e) => (
                    <div key={e.name} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                      <span className="flex-1 text-gray-600 truncate text-[11px]">{e.name}</span>
                      <span className="text-gray-500 font-medium text-[11px] shrink-0">{e.value} ({e.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="text-xs text-indigo-600 hover:underline font-medium mt-2">
                View entity analytics →
              </button>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-semibold text-sm text-gray-800">Department Distribution</h3>
              <p className="text-xs text-gray-400 mb-3">Reports generated by department</p>
              <div className="space-y-1.5">
                {deptDistData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="text-sm shrink-0">{d.icon}</span>
                    <span className="w-24 shrink-0 text-gray-700 text-[11px]">{d.name}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${(d.count / 48) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 w-16 text-right shrink-0">
                      {d.count} ({d.pct})
                    </span>
                  </div>
                ))}
              </div>
              <button className="text-xs text-indigo-600 hover:underline font-medium mt-2">
                View department analytics →
              </button>
            </div>
          </div>

          {/* Format Distribution placeholder */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-semibold text-sm text-gray-800">Format Distribution</h3>
              <p className="text-xs text-gray-400 mb-3">Reports generated by format type</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={[
                    { name: "PDF", count: 84 },
                    { name: "Excel", count: 48 },
                    { name: "PPT", count: 24 },
                  ]}
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <button className="text-xs text-indigo-600 hover:underline font-medium mt-2">
                View format analytics →
              </button>
            </div>
          </div>
        </div>

        {/* ── Popular + Scheduled Reports ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Popular Reports */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">Popular Reports</h3>
                  <p className="text-xs text-gray-400">Most viewed reports in the last 90 days</p>
                </div>
                <button className="text-xs text-indigo-600 hover:underline font-medium">
                  View all popular reports →
                </button>
              </div>
              <table className="table table-xs w-full">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="font-medium py-2">#</th>
                    <th className="font-medium">Report Name</th>
                    <th className="font-medium text-center">Views</th>
                    <th className="font-medium text-center">Downloads</th>
                    <th className="font-medium">Last Viewed</th>
                  </tr>
                </thead>
                <tbody>
                  {popularReports.map((r) => (
                    <tr key={r.rank} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 font-bold text-gray-400 text-xs">{r.rank}</td>
                      <td>
                        <div className="text-xs font-medium text-gray-800 max-w-[180px] truncate">{r.name}</div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${catBadge(r.category)}`}>
                          {r.category}
                        </span>
                      </td>
                      <td className="text-center text-xs font-semibold text-gray-700">{r.views}</td>
                      <td className="text-center text-xs font-semibold text-gray-700">{r.downloads}</td>
                      <td className="text-xs text-gray-400">{r.lastViewed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="card bg-white border border-gray-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">Scheduled Reports</h3>
                  <p className="text-xs text-gray-400">Upcoming and recurring report schedules</p>
                </div>
                <button className="text-xs text-indigo-600 hover:underline font-medium">
                  View all schedules →
                </button>
              </div>
              <table className="table table-xs w-full">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="font-medium py-2">Report Name</th>
                    <th className="font-medium">Frequency</th>
                    <th className="font-medium">Next Run</th>
                    <th className="font-medium text-center">Recipients</th>
                    <th className="font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledReports.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{r.icon}</span>
                          <span className="text-xs font-medium text-gray-800 truncate max-w-[140px]">{r.name}</span>
                        </div>
                      </td>
                      <td className="text-xs text-gray-500">{r.frequency}</td>
                      <td className="text-xs text-gray-500 max-w-[120px]">{r.nextRun}</td>
                      <td className="text-center text-xs font-semibold text-gray-700">{r.recipients}</td>
                      <td className="text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            r.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="card bg-white border border-gray-100 shadow-sm">
          <div className="card-body p-4">
            <h3 className="font-semibold text-sm text-gray-800 mb-3">Quick Actions</h3>
            <div className="flex gap-3 flex-wrap">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{a.icon}</span>
                  <span className="text-xs text-gray-600 font-medium whitespace-nowrap">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Insights Strip ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "📈", value: "18%", label: "Increase in reports generated vs last month" },
            { icon: "⬇️", value: "22%", label: "Increase in downloads vs last month" },
            { icon: "👥", value: "15", label: "New report users vs last month" },
          ].map((ins, i) => (
            <div
              key={i}
              className="card bg-white border border-gray-100 shadow-sm"
            >
              <div className="card-body p-4 flex flex-row items-center gap-3">
                <span className="text-2xl">{ins.icon}</span>
                <div>
                  <div className="text-xl font-bold text-gray-800">{ins.value}</div>
                  <div className="text-xs text-gray-400">{ins.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between text-xs text-gray-400 py-2">
          <span>🕐 Last updated: 20 May 2024, 08:30 AM &nbsp;|&nbsp; Auto refresh: On 🟢 &nbsp;|&nbsp; Next refresh in 14:32</span>
          <button className="text-indigo-500 hover:underline font-medium">🔄 Refresh now</button>
        </div>

      </div>
    </div>
  );
};

export default Reports;