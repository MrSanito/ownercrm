"use client";
import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  Users, Settings2, Monitor, DollarSign, AlertTriangle,
  ChevronDown, ArrowRight, Download, TrendingUp, TrendingDown,
  CheckCircle, Clock, Zap, Building2,
} from "lucide-react";

/* ═══════════════════ HELPERS ═══════════════════ */
function Spark({ data, color }: { data: number[]; color: string }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const W = 80, H = 26;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - mn) / rng) * (H - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-20 h-6">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MiniSpark({ data, color }: { data: number[]; color: string }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const W = 56, H = 20;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - mn) / rng) * (H - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-12 h-4">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function GaugeRing({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const R = (size / 2) - 7;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * R;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth="7" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
    </svg>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

/* ═══════════════════ DATA ═══════════════════ */
const months6 = ["Dec '23","Jan '24","Feb '24","Mar '24","Apr '24","May '24"];

const peopleTrend  = months6.map((m, i) => ({ m, v: [72,74,73,76,75,78][i] }));
const opsTrend     = months6.map((m, i) => ({ m, v: [60,62,61,64,66,68][i] }));
const techTrend    = months6.map((m, i) => ({ m, v: [68,70,69,72,71,74][i] }));
const finTrend     = months6.map((m, i) => ({ m, v: [65,66,67,66,68,69][i] }));

const constraints = [
  {
    icon: "👥", title: "Skilled Manpower Shortage",    module: "People",     moduleC: "text-indigo-600", moduleBg: "bg-indigo-50",
    impact: "High Impact", impC: "text-red-500", status: "In Progress", stC: "bg-blue-100 text-blue-700",
    desc: "High demand for automation engineers across AutoX and TechNova.",
  },
  {
    icon: "⚙️", title: "Production Line Bottleneck",   module: "Operations", moduleC: "text-orange-600",  moduleBg: "bg-orange-50",
    impact: "High Impact", impC: "text-red-500", status: "In Progress", stC: "bg-blue-100 text-blue-700",
    desc: "Line 3 in BuildMax Plant is limiting overall output by ~18%.",
  },
  {
    icon: "🖥️", title: "System Integration Gaps",      module: "Technology", moduleC: "text-blue-600",    moduleBg: "bg-blue-50",
    impact: "Medium Impact", impC: "text-amber-500", status: "Planned", stC: "bg-gray-100 text-gray-600",
    desc: "ERP integration with CRM and SCM systems pending.",
  },
  {
    icon: "💰", title: "Working Capital Pressure",     module: "Finance",    moduleC: "text-green-700",   moduleBg: "bg-green-50",
    impact: "High Impact", impC: "text-red-500", status: "In Progress", stC: "bg-blue-100 text-blue-700",
    desc: "Receivables collection delay impacting cash flow in AgriPure and BuildMax.",
  },
  {
    icon: "🚚", title: "Vendor Delivery Delays",       module: "Operations", moduleC: "text-orange-600",  moduleBg: "bg-orange-50",
    impact: "Medium Impact", impC: "text-amber-500", status: "Monitoring", stC: "bg-amber-100 text-amber-700",
    desc: "Raw material delivery delays affecting production schedules.",
  },
];

/* ── Financial Section data ── */
const cashFlowData = [
  { m: "Dec '23", op: 45,  inv: -30, fin: 10,  net: 25  },
  { m: "Jan '24", op: 60,  inv: -40, fin: -10, net: 10  },
  { m: "Feb '24", op: 75,  inv: -20, fin: 15,  net: 70  },
  { m: "Mar '24", op: 50,  inv: -35, fin: -15, net: 0   },
  { m: "Apr '24", op: 80,  inv: -45, fin: 20,  net: 55  },
  { m: "May '24", op: 95,  inv: -25, fin: -5,  net: 65  },
  { m: "Jun '24", op: 110, inv: -50, fin: 10,  net: 70  },
];

const liquidityDonut = [
  { name: "Cash & Bank",         value: 318.6, pct: "42%", color: "#3b82f6" },
  { name: "Receivables",         value: 224.3, pct: "29%", color: "#22c55e" },
  { name: "Inventory",           value: 156.2, pct: "20%", color: "#f59e0b" },
  { name: "Other Current Assets",value: 58.1,  pct: "8%",  color: "#a855f7" },
];

const efficiencyData = [
  { entity: "AutoX Industries",  sub: "Automotive",         procEff: 72, procD: "+4%", assetUtil: 68, assetD: "+5%", quality: 92, qualD: "+3%", otif: 89, otifD: "+6%", score: 80, color: "#6366f1" },
  { entity: "BuildMax Infra",    sub: "Construction",        procEff: 61, procD: "+3%", assetUtil: 74, assetD: "+8%", quality: 78, qualD: "+1%", otif: 73, otifD: "–",    score: 70, color: "#f97316" },
  { entity: "AgriPure Foods",    sub: "FMCO",                procEff: 74, procD: "+6%", assetUtil: 70, assetD: "+4%", quality: 94, qualD: "+4%", otif: 91, otifD: "+4%", score: 82, color: "#34d399" },
  { entity: "HealthPlus",        sub: "Healthcare",          procEff: 69, procD: "+2%", assetUtil: 66, assetD: "+3%", quality: 91, qualD: "+2%", otif: 88, otifD: "+5%", score: 78, color: "#ec4899" },
  { entity: "FinEdge Capital",   sub: "Financial Services",  procEff: 81, procD: "+5%", assetUtil: 75, assetD: "+5%", quality: 96, qualD: "+2%", otif: 93, otifD: "+6%", score: 86, color: "#a78bfa" },
  { entity: "TechNova Systems",  sub: "Technology",          procEff: 77, procD: "+4%", assetUtil: 72, assetD: "+3%", quality: 93, qualD: "+4%", otif: 90, otifD: "+5%", score: 83, color: "#22d3ee" },
];

const resourceByEntity = [
  { entity: "AutoX Industries",  people: 1266, pPct: "24%", ops: 219.4, oPct: "28%", capex: 126.7, cPct: "26%", total: 345.1, tPct: "24%", color: "#6366f1" },
  { entity: "BuildMax Infra",    people: 1103, pPct: "22%", ops: 186.2, oPct: "24%", capex: 148.9, cPct: "31%", total: 335.1, tPct: "23%", color: "#f97316" },
  { entity: "AgriPure Foods",    people: 987,  pPct: "19%", ops: 154.6, oPct: "20%", capex: 96.3,  cPct: "20%", total: 250.9, tPct: "17%", color: "#34d399" },
  { entity: "HealthPlus",        people: 865,  pPct: "16%", ops: 122.8, oPct: "16%", capex: 68.4,  cPct: "14%", total: 191.2, tPct: "13%", color: "#ec4899" },
  { entity: "FinEdge Capital",   people: 456,  pPct: "8%",  ops: 66.5,  oPct: "9%",  capex: 36.7,  cPct: "7%",  total: 102.7, tPct: "7%",  color: "#a78bfa" },
  { entity: "TechNova Systems",  people: 199,  pPct: "7%",  ops: 54.3,  oPct: "7%",  capex: 26.7,  cPct: "5%",  total: 81.0,  tPct: "6%",  color: "#22d3ee" },
];

const scoreColor = (v: number) => v >= 80 ? "#22c55e" : v >= 65 ? "#f59e0b" : "#ef4444";

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function ControlPage() {
  return (
    <div className="p-5 space-y-6 bg-white min-h-full">

      {/* ════════════════════════════════
          SECTION 1 — Control & Capacity
      ════════════════════════════════ */}

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Control & Capacity</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitor and optimize the resources, systems and financial capacity that power execution.</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-6 gap-4">
        {/* Overall Capacity Score */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-xs text-gray-400 mb-2">Overall Capacity Score</div>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-2xl font-black text-gray-900">72 <span className="text-sm font-normal text-gray-400">/100</span></div>
              <div className="text-xs text-green-500 font-semibold">Good</div>
            </div>
            <GaugeRing pct={72} color="#22c55e" size={56} />
          </div>
          <div className="text-[10px] text-green-500 mt-1 font-semibold">↑ 6 pts vs last month</div>
        </div>

        {[
          { label: "People Capacity Utilization",   value: "78%", change: "↑ 5% vs last month", up: true,  spark: [68,70,72,70,74,76,75,78], color: "#6366f1" },
          { label: "Operational Capacity",           value: "68%", change: "↑ 4% vs last month", up: true,  spark: [58,60,62,60,63,65,64,68], color: "#22c55e" },
          { label: "Technology & Systems Readiness", value: "74%", change: "↑ 7% vs last month", up: true,  spark: [62,65,63,67,66,70,69,74], color: "#3b82f6" },
          { label: "Financial Capacity Index",       value: "69%", change: "↑ 3% vs last month", up: true,  spark: [63,64,65,64,66,67,68,69], color: "#f59e0b" },
          { label: "Capacity Constraints",           value: "9",   change: "↓ 2 vs last month",  up: false, spark: [], color: "#ef4444", isAlert: true },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-[11px] text-gray-400 mb-1 leading-tight">{c.label}</div>
            <div className="text-2xl font-black" style={{ color: c.isAlert ? "#ef4444" : "#111827" }}>{c.value}</div>
            {c.isAlert && <div className="text-[10px] text-red-500 font-semibold">High Priority</div>}
            <div className={`text-[10px] font-semibold mt-0.5 ${c.up ? "text-green-500" : "text-red-500"}`}>{c.change}</div>
            {c.spark.length > 0 && <Spark data={c.spark} color={c.color} />}
          </div>
        ))}
      </div>

      {/* Capacity Overview by Pillar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-gray-900">Capacity Overview by Pillar</span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100">
              🏢 All Entities <ChevronDown size={11} />
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100">
              View by: Pillar <ChevronDown size={11} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {/* People Capacity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center"><Users size={15} className="text-indigo-600" /></div>
              <div>
                <div className="text-[10px] text-gray-400">People Capacity</div>
                <div className="text-[10px] text-gray-500">Utilization Rate</div>
              </div>
              <span className="ml-auto text-lg font-black text-gray-900">78%</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { l: "Available Capacity", v: "1,286 FTE",  c: "text-gray-700" },
                { l: "Deployed Capacity",  v: "1,003 FTE",  c: "text-gray-700" },
                { l: "Capacity Gap",       v: "283 FTE",    c: "text-red-500 font-semibold" },
                { l: "Critical Roles Vacant", v: "18",      c: "text-gray-700" },
                { l: "Attrition (YTD)",    v: "12.4%",      c: "text-amber-500 font-semibold" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-gray-50">
                  <span className="text-gray-500">{r.l}</span>
                  <span className={r.c}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Utilization Trend (Last 6 Months)</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={peopleTrend} margin={{ top: 2, right: 4, bottom: 0, left: -30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="m" tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 85]} tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: any) => [`${v}%`]} />
                <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Operational Capacity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center"><Settings2 size={15} className="text-green-600" /></div>
              <div>
                <div className="text-[10px] text-gray-400">Operational Capacity</div>
                <div className="text-[10px] text-gray-500">System Readiness</div>
              </div>
              <span className="ml-auto text-lg font-black text-gray-900">68%</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { l: "Process Efficiency",    v: "72%", c: "text-gray-700" },
                { l: "Resource Availability", v: "65%", c: "text-gray-700" },
                { l: "Bottlenecks",           v: "6",   c: "text-red-500 font-semibold" },
                { l: "Vendors At Risk",       v: "4",   c: "text-amber-500 font-semibold" },
                { l: "Quality Index",         v: "91%", c: "text-green-600 font-semibold" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-gray-50">
                  <span className="text-gray-500">{r.l}</span>
                  <span className={r.c}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Readiness Trend (Last 6 Months)</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={opsTrend} margin={{ top: 2, right: 4, bottom: 0, left: -30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="m" tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis domain={[50, 75]} tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: any) => [`${v}%`]} />
                <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Technology & Systems */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center"><Monitor size={15} className="text-blue-600" /></div>
              <div>
                <div className="text-[10px] text-gray-400">Technology & Systems</div>
                <div className="text-[10px] text-gray-500">Readiness Score</div>
              </div>
              <span className="ml-auto text-lg font-black text-gray-900">74%</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { l: "System Uptime",            v: "98.6%", c: "text-green-600 font-semibold" },
                { l: "Critical Systems Healthy", v: "23/28", c: "text-gray-700" },
                { l: "Projects On Track",        v: "12/18", c: "text-gray-700" },
                { l: "Cyber Security Score",     v: "78/100",c: "text-gray-700" },
                { l: "Tech Debt Index",          v: "Medium",c: "text-amber-500 font-semibold" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-gray-50">
                  <span className="text-gray-500">{r.l}</span>
                  <span className={r.c}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Readiness Trend (Last 6 Months)</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={techTrend} margin={{ top: 2, right: 4, bottom: 0, left: -30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="m" tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 80]} tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: any) => [`${v}%`]} />
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Capacity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><DollarSign size={15} className="text-amber-600" /></div>
              <div>
                <div className="text-[10px] text-gray-400">Financial Capacity</div>
                <div className="text-[10px] text-gray-500">Financial Flexibility</div>
              </div>
              <span className="ml-auto text-lg font-black text-gray-900">69%</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { l: "Liquidity Coverage",    v: "2.1×",   c: "text-green-600 font-semibold" },
                { l: "Cash Conversion Cycle", v: "64 Days",c: "text-gray-700" },
                { l: "Debt to Equity",        v: "0.42×",  c: "text-gray-700" },
                { l: "Interest Coverage",     v: "3.6×",   c: "text-green-600 font-semibold" },
                { l: "Working Capital Health",v: "Good",   c: "text-green-600 font-semibold" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-gray-50">
                  <span className="text-gray-500">{r.l}</span>
                  <span className={r.c}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Financial Health Trend (Last 6 Months)</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={finTrend} margin={{ top: 2, right: 4, bottom: 0, left: -30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="m" tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis domain={[58, 75]} tick={{ fontSize: 8, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: any) => [`${v}%`]} />
                <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Capacity Constraints */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-gray-900">Top Capacity Constraints</span>
          <button className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline">
            View all constraints <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {constraints.map((c, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3.5 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{c.icon}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${c.moduleBg} ${c.moduleC}`}>{c.module}</span>
              </div>
              <div className="text-[12px] font-bold text-gray-800 leading-tight mb-1">{c.title}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-semibold ${c.impC}`}>{c.impact}</span>
                <span className="text-gray-300">·</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.stC}`}>{c.status}</span>
              </div>
              <div className="text-[10px] text-gray-500 leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 2 — Financial Capacity Overview
      ════════════════════════════════ */}

      {/* Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Financial Capacity Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track liquidity, cash flow and financial flexibility.</p>
        </div>
        <button className="flex items-center gap-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:bg-gray-50">
          🏢 All Entities <ChevronDown size={12} />
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { icon: "🏦", label: "Cash & Bank Balance",    value: "₹318.6 Cr",  change: "↑ 8.4% vs last month",  up: true  },
          { icon: "🔥", label: "Monthly Burn Rate",      value: "₹23.4 Cr",   change: "↓ 8.7% vs last month",  up: true  },
          { icon: "📅", label: "Runway",                 value: "13.6 Months", change: "↑ 1.2 months vs last month", up: true },
          { icon: "💸", label: "Free Cash Flow (YTD)",   value: "₹156.7 Cr",  change: "↑ 17.8% vs LY",         up: true  },
          { icon: "⚖️", label: "Debt to Equity",         value: "0.42×",      change: "Healthy",               up: null  },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{k.icon}</span>
              <span className="text-[11px] text-gray-400 leading-tight">{k.label}</span>
            </div>
            <div className="text-xl font-black text-gray-900">{k.value}</div>
            <div className={`text-[10px] font-semibold mt-0.5 ${k.up === true ? "text-green-500" : k.up === false ? "text-red-500" : "text-green-500"}`}>
              {k.change}
            </div>
          </div>
        ))}
      </div>

      {/* Cash Flow Trend + Liquidity Position */}
      <div className="grid grid-cols-12 gap-4">
        {/* Cash Flow Trend */}
        <div className="col-span-7 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-3">Cash Flow Trend <span className="text-xs font-normal text-gray-400">(₹ Cr)</span></div>
          <div className="flex items-center gap-4 mb-3">
            {[
              { label: "Operating Cash Flow",  color: "#3b82f6" },
              { label: "Investing Cash Flow",  color: "#22c55e" },
              { label: "Financing Cash Flow",  color: "#f59e0b" },
              { label: "Net Cash Flow",        color: "#1f2937" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="w-5 h-1 rounded-full inline-block" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={cashFlowData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} formatter={(v: any) => [`₹${v} Cr`]} />
              <Bar dataKey="op"  fill="#3b82f6" radius={[3, 3, 0, 0]} name="Operating" />
              <Bar dataKey="inv" fill="#22c55e" radius={[3, 3, 0, 0]} name="Investing" />
              <Bar dataKey="fin" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Financing" />
              <Line type="monotone" dataKey="net" stroke="#1f2937" strokeWidth={2} dot={{ r: 3 }} name="Net" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Liquidity Position */}
        <div className="col-span-5 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-3">Liquidity Position</div>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={liquidityDonut} cx="50%" cy="50%" innerRadius={44} outerRadius={64} dataKey="value" strokeWidth={2} stroke="#fff" startAngle={90} endAngle={-270}>
                    {liquidityDonut.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }}
                    formatter={(v: any) => [`₹${v} Cr`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[9px] text-gray-400">Total Current Assets</div>
                <div className="text-base font-black text-gray-900">₹757.2 Cr</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2 mb-3">
                {liquidityDonut.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700">₹{d.value} Cr ({d.pct})</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                {[
                  { label: "Current Ratio",  value: "1.68×", status: "Good", stC: "text-green-500" },
                  { label: "Quick Ratio",    value: "1.32×", status: "Good", stC: "text-green-500" },
                  { label: "Cash Ratio",     value: "0.71×", status: "Good", stC: "text-green-500" },
                  { label: "Working Capital",value: "₹246.8 Cr", status: "Good", stC: "text-green-500" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{r.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{r.value}</span>
                      <span className={`text-[9px] font-semibold ${r.stC}`}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Efficiency Summary + Resource Allocation by Entity */}
      <div className="grid grid-cols-12 gap-4">

        {/* Operational Efficiency Summary */}
        <div className="col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">Operational Efficiency Summary</div>
            <div className="text-xs text-gray-400 mt-0.5">Key operational efficiency indicators across entities.</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Entity","Process Efficiency","Asset Utilization","Quality Index","OTIF Delivery","Overall Score"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[9px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {efficiencyData.map((e, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                          style={{ backgroundColor: e.color }}>
                          {e.entity.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-gray-800 whitespace-nowrap">{e.entity}</div>
                          <div className="text-[9px] text-gray-400">{e.sub}</div>
                        </div>
                      </div>
                    </td>
                    {[
                      { v: e.procEff,  d: e.procD  },
                      { v: e.assetUtil,d: e.assetD },
                      { v: e.quality,  d: e.qualD  },
                      { v: e.otif,     d: e.otifD  },
                    ].map((m, mi) => (
                      <td key={mi} className="px-3 py-2.5">
                        <div className="text-[11px] font-bold text-gray-800">{m.v}%</div>
                        <div className="text-[9px] text-green-500 font-semibold">{m.d}</div>
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                          style={{ backgroundColor: scoreColor(e.score) }}>
                          {e.score}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <button className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline">
              View detailed efficiency report <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Resource Allocation by Entity */}
        <div className="col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-900">Resource Allocation by Entity</div>
              <div className="text-xs text-gray-400 mt-0.5">How resources are distributed to drive strategic priorities.</div>
            </div>
            <div className="flex items-center gap-1.5">
              {["₹ Cr", "%", "YTD"].map(t => (
                <button key={t} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                  t === "₹ Cr" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Entity","People (FTE)","Opex (₹ Cr)","Capex (₹ Cr)","Total Investment (₹ Cr)","% of Total"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[9px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resourceByEntity.map((e, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
                          style={{ backgroundColor: e.color }}>
                          {e.entity.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[11px] font-semibold text-gray-800 whitespace-nowrap">{e.entity}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-[11px] font-bold text-gray-800">{e.people.toLocaleString()}</div>
                      <div className="text-[9px] text-gray-400">{e.pPct}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-[11px] font-bold text-gray-800">{e.ops}</div>
                      <div className="text-[9px] text-gray-400">{e.oPct}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-[11px] font-bold text-gray-800">{e.capex}</div>
                      <div className="text-[9px] text-gray-400">{e.cPct}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-[11px] font-black text-gray-900">{e.total}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <ProgressBar pct={parseInt(e.tPct)} color={e.color} />
                        <span className="text-[10px] font-semibold text-gray-700 w-8 whitespace-nowrap">{e.tPct}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="px-3 py-2.5 text-[11px] font-bold text-gray-900">Total</td>
                  <td className="px-3 py-2.5 text-[11px] font-black text-gray-900">5,095</td>
                  <td className="px-3 py-2.5 text-[11px] font-black text-gray-900">804.8</td>
                  <td className="px-3 py-2.5 text-[11px] font-black text-gray-900">501.2</td>
                  <td className="px-3 py-2.5 text-[11px] font-black text-gray-900">1,306.0</td>
                  <td className="px-3 py-2.5 text-[11px] font-black text-gray-900">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <button className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline">
              View full allocation details <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
