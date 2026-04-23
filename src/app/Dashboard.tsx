"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ZAxis, ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, ExternalLink, ChevronRight, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";

/* ═══════════════════════════════════════════════
   COLORS & HELPERS
═══════════════════════════════════════════════ */
const CARD = "rounded-xl border"
const CARD_DARK = `${CARD} p-4`
const border = "border-[rgba(255,255,255,0.07)]"
const bg = "bg-white"
const bgDeep = "bg-gray-50"

function Spark({ data, color, up }: { data: number[]; color: string; up?: boolean }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const W = 70, H = 22;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - mn) / rng) * (H - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-16 h-5">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function GaugeRing({ pct, color, size = 80, label, value, sub }: {
  pct: number; color: string; size?: number; label: string; value: string; sub: string
}) {
  const R = 32, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * R;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth="6"/>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-gray-900 leading-none">{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-[11px] font-bold text-gray-900">{value}</div>
        <div className="text-[9px] text-gray-500 mt-0.5">{label}</div>
        <div className="text-[9px] text-gray-400">{sub}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const kpiCards = [
  { label: "Total Revenue (YTD)",   value: "₹1,243 Cr", change: "+18.8% vs LY", up: true,  spark: [80,90,85,100,95,110,105,120,115,130] },
  { label: "Total EBITDA (YTD)",    value: "₹246 Cr",   change: "+18.2% vs LY", up: true,  spark: [60,65,62,70,68,75,72,80,78,85] },
  { label: "Total Net Profit (YTD)",value: "₹156 Cr",   change: "+14.0% vs LY", up: true,  spark: [40,42,45,48,50,52,54,56,58,62] },
  { label: "Group Cash & Bank",     value: "₹325 Cr",   change: "3.6 Months Runway", up: null, spark: [200,210,215,220,230,240,235,250,260,275] },
  { label: "Active Entities",       value: "6",          change: "Across 6 Industries", up: null, spark: [] },
  { label: "Business Health Score", value: "Good",        change: "Consolidated View", up: null, spark: [], isHealth: true },
];

const entityData = [
  { name: "AutoX Industries",   industry: "Automotive",         rev: 456, ebitda: 14.2, trend: [40,45,42,50,48,55,52,58], status: "On Track", at_risk: false },
  { name: "BuildMax Infra",     industry: "Construction",       rev: 312, ebitda: 11.8, trend: [30,28,32,30,35,33,38,36], status: "At Risk",  at_risk: true  },
  { name: "AgriPure Foods",     industry: "FMCO",               rev: 228, ebitda: 10.7, trend: [20,22,21,24,23,25,24,26], status: "On Track", at_risk: false },
  { name: "HealthPlus",         industry: "Healthcare",         rev: 147, ebitda: 13.1, trend: [12,14,13,15,14,16,15,17], status: "On Track", at_risk: false },
  { name: "FinEdge Capital",    industry: "Financial Services", rev: 68,  ebitda: 28.4, trend: [5,6,5,7,6,8,7,9],        status: "On Track", at_risk: false },
  { name: "TechNova Systems",   industry: "Technology",         rev: 32,  ebitda: 9.2,  trend: [3,4,3,5,4,6,5,7],        status: "At Risk",  at_risk: true  },
];

const businessHealthData = [
  { x: 65, y: 70, z: 456, name: "AutoX Industries",  label: "AutoX Industries",  color: "#60a5fa" },
  { x: 35, y: 35, z: 312, name: "BuildMax Infra",    label: "BuildMax Infra",    color: "#f97316" },
  { x: 72, y: 60, z: 228, name: "AgriPure Foods",    label: "AgriPure Foods",    color: "#34d399" },
  { x: 78, y: 65, z: 147, name: "HealthPlus",        label: "HealthPlus",        color: "#f472b6" },
  { x: 82, y: 75, z: 68,  name: "FinEdge Capital",   label: "FinEdge Capital",   color: "#a78bfa" },
  { x: 28, y: 45, z: 32,  name: "TechNova Systems",  label: "TechNova Systems",  color: "#22d3ee" },
];

const cashflowData = [
  { month: "Dec '23", value: 260 },
  { month: "Jan '24", value: 278 },
  { month: "Feb '24", value: 312 },
  { month: "Mar '24", value: 298 },
  { month: "Apr '24", value: 325 },
];

const strategies = [
  { initiative: "Market Expansion",    objective: "Increase revenue share in existing markets", owner: "Rohit S.", progress: 73, impact: "High",   trend: "up"   },
  { initiative: "Product Innovation",  objective: "Launch 5 new products",                       owner: "Neha K.", progress: 45, impact: "High",   trend: "flat" },
  { initiative: "Cost Optimization",   objective: "Reduce operating costs by 12%",               owner: "Vikas M.",progress: 68, impact: "Medium", trend: "up"   },
  { initiative: "Digital Transformation",objective:"Implement ERP across all entities",          owner: "Anita P.",progress: 52, impact: "High",   trend: "flat" },
  { initiative: "Talent & Culture",    objective: "Build high performance culture",               owner: "Sanjeev A.",progress:60, impact: "Medium",trend: "up"  },
];

const marketSignals = [
  { tag: "Opportunity", industry: "Automotive",        color: "#60a5fa", text: "Government announces EV policy incentives", time: "2h ago" },
  { tag: "Risk",        industry: "Construction",      color: "#f97316", text: "Steel prices likely to remain volatile in Q2", time: "1h ago" },
  { tag: "Neutral",     industry: "Financial Services",color: "#94a3b8", text: "RBI keeps interest rates unchanged",          time: "3h ago" },
  { tag: "Opportunity", industry: "Healthcare",        color: "#f472b6", text: "Health insurance sector to grow 15% in FY25", time: "4h ago" },
  { tag: "Opportunity", industry: "Technology",        color: "#22d3ee", text: "Global chip shortage easing by Q3 2024",      time: "5h ago" },
];

const alertsData = [
  { priority: "High Priority",   color: "#ef4444", bg: "rgba(239,68,68,0.1)",  text: "Cash balance threshold hit: BuildMax Infra is below threshold",      time: "10m ago" },
  { priority: "Medium Priority", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", text: "Receivables overdue > 60 days in AgriPure Foods",                    time: "1h ago" },
  { priority: "Medium Priority", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", text: "Discussion on project allocation in AutoX Industries Plant 2",        time: "2h ago" },
  { priority: "Information",     color: "#60a5fa", bg: "rgba(96,165,250,0.1)", text: "New compliance requirement: ESG Reporting",                           time: "6h ago" },
];

const recentReports = [
  { name: "Monthly Executive Summary – Apr 2024",    entity: "All Entities", cat: "Executive",  date: "20 May 2024, 07:45 AM" },
  { name: "Consolidated Financial Statement – Apr 2024", entity: "All Entities", cat: "Finance",    date: "20 May 2024, 07:30 AM" },
  { name: "Sales Performance Report – Apr 2024",     entity: "AutoX Industries", cat: "Sales",      date: "19 May 2024, 09:15 PM" },
  { name: "Operational Review – Apr 2024",           entity: "BuildMax Infra",   cat: "Operations", date: "19 May 2024, 08:40 PM" },
];

const entityColors: Record<string, string> = {
  "AutoX Industries": "#60a5fa",
  "BuildMax Infra":   "#f97316",
  "AgriPure Foods":   "#34d399",
  "HealthPlus":       "#f472b6",
  "FinEdge Capital":  "#a78bfa",
  "TechNova Systems": "#22d3ee",
};

/* ═══════════════════════════════════════════════
   CUSTOM SCATTER TOOLTIP
═══════════════════════════════════════════════ */
function ScatterTip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    return (
      <div className="rounded-lg px-3 py-2 text-xs shadow-lg" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div className="font-bold text-gray-900">{d?.name}</div>
        <div className="text-gray-500">Financial: {d?.x}% | Ops: {d?.y}%</div>
      </div>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════ */
export default function GroupDashboard() {
  const [signalTab, setSignalTab] = useState("All");

  return (
    <div className="p-5 space-y-6 bg-white min-h-full text-gray-900">

      {/* ── Row 1: Group Overview + KPIs ── */}
      <div className="grid grid-cols-12 gap-3">
        {/* Group Overview card */}
        <div
          className={`col-span-2 rounded-xl border p-4 flex flex-col justify-between`}
          style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-black">G</span>
              </div>
              <span className="text-xs font-bold text-gray-900">Group Overview</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">(All Entities)</div>
            <div className="text-[9px] text-gray-600">Consolidated View</div>
          </div>
          <div className="mt-4 space-y-1.5">
            {["AutoX Industries","BuildMax Infra","AgriPure Foods","HealthPlus","FinEdge Capital","TechNova Systems"].map(e => (
              <div key={e} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: entityColors[e] }}/>
                <span className="text-[9px] text-gray-500 truncate">{e}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        {kpiCards.map((k, i) => (
          <div key={i}
            className="col-span-2 rounded-xl border p-3.5 flex flex-col justify-between"
            style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}
          >
            <div className="text-[10px] text-gray-500 leading-tight mb-1">{k.label}</div>
            {k.isHealth ? (
              <div className="flex flex-col gap-1">
                <div className="text-xl font-black text-emerald-600">{k.value}</div>
                <div className="text-[9px] text-gray-600">{k.change}</div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: "78%" }}/>
                </div>
              </div>
            ) : (
              <>
                <div className="text-xl font-black text-gray-900 leading-tight">{k.value}</div>
                <div className={`text-[10px] flex items-center gap-0.5 mt-0.5 ${k.up === true ? "text-emerald-600" : k.up === false ? "text-rose-600" : "text-gray-500"}`}>
                  {k.up === true && <ArrowUpRight size={10}/>}
                  {k.up === false && <ArrowDownRight size={10}/>}
                  {k.change}
                </div>
                {k.spark.length > 0 && (
                  <Spark data={k.spark} color={k.up === true ? "#34d399" : k.up === false ? "#f87171" : "#60a5fa"} />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Row 2: Entity Performance + Business Health Matrix + Key Financials ── */}
      <div className="grid grid-cols-12 gap-3">

        {/* Entity Performance (YTD) */}
        <div className="col-span-4 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900">Entity Performance (YTD)</span>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Entity","Industry","Revenue (₹ Cr)","EBITDA%","Trend","Status"].map(h => (
                    <th key={h} className="text-left text-[9px] text-gray-600 font-semibold pb-2 pr-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entityData.map((e, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "#f1f5f9" }}>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entityColors[e.name] }}/>
                        <span className="text-[10px] font-semibold text-gray-700 whitespace-nowrap">{e.name}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-[9px] text-gray-500 whitespace-nowrap">{e.industry}</td>
                    <td className="py-2 pr-2 text-[10px] font-bold text-gray-900">{e.rev}</td>
                    <td className="py-2 pr-2 text-[10px] text-gray-400">{e.ebitda}%</td>
                    <td className="py-2 pr-2">
                      <Spark data={e.trend} color={e.at_risk ? "#f97316" : "#34d399"}/>
                    </td>
                    <td className="py-2">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                        e.at_risk
                          ? "bg-red-500/15 text-rose-600"
                          : "bg-green-500/15 text-emerald-600"
                      }`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-2 text-[10px] text-blue-400 hover:underline font-semibold">View consolidated P&L</button>
        </div>

        {/* Business Health Matrix */}
        <div className="col-span-4 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-900">Business Health Matrix</span>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View details</button>
          </div>
          <div className="flex gap-3 text-[9px] text-gray-600 mb-2">
            <div className="flex items-center gap-1"><span className="text-amber-400">↗</span> Needs Attention</div>
            <div className="flex items-center gap-1"><span className="text-emerald-600">●</span> Strong</div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <ScatterChart margin={{ top: 5, right: 10, bottom: 10, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="x" type="number" domain={[0,100]} tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} axisLine={false} label={{ value: "Financial Health", position: "insideBottom", offset: -5, style: { fill: "#475569", fontSize: 9 } }}/>
              <YAxis dataKey="y" type="number" domain={[0,100]} tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} axisLine={false} label={{ value: "Operational Health", angle: -90, position: "insideLeft", style: { fill: "#475569", fontSize: 9 } }}/>
              <ZAxis dataKey="z" range={[300, 1200]}/>
              <Tooltip content={<ScatterTip/>}/>
              <ReferenceLine x={50} stroke="#e2e8f0" strokeDasharray="4 4"/>
              <ReferenceLine y={50} stroke="#e2e8f0" strokeDasharray="4 4"/>
              <Scatter data={businessHealthData} shape={(props: any) => {
                const { cx, cy, payload } = props;
                return <circle cx={cx} cy={cy} r={10} fill={payload.color} fillOpacity={0.8} stroke={payload.color} strokeWidth={1.5}/>;
              }}/>
            </ScatterChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-1 mt-1">
            {businessHealthData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }}/>
                <span className="text-[9px] text-gray-500 truncate">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Financials */}
        <div className="col-span-4 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900">Key Financials (Consolidated)</span>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View full report</button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label:"Operating Cash Flow (YTD)", value:"₹275 Cr", change:"+21.3%", up:true },
              { label:"Free Cash Flow (YTD)",      value:"₹156 Cr", change:"+19.8%", up:true },
              { label:"Net Debt / Equity",          value:"0.42×",   change:"",       up:null  },
              { label:"ROE (YTD)",                  value:"18.7%",   change:"▲ 2.1p", up:true  },
            ].map((s,i) => (
              <div key={i} className="rounded-lg p-2.5" style={{ backgroundColor: "#f8fafc" }}>
                <div className="text-[9px] text-gray-600 mb-0.5 leading-tight">{s.label}</div>
                <div className="text-base font-black text-gray-900">{s.value}</div>
                {s.change && (
                  <div className={`text-[9px] font-semibold ${s.up ? "text-emerald-600" : "text-rose-600"}`}>{s.change}</div>
                )}
              </div>
            ))}
          </div>
          {/* Bar chart */}
          <div className="text-[9px] text-gray-600 mb-1">Cash Flow Trend (₹ Cr)</div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={cashflowData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 11, color: "#1e293b" }} cursor={{ fill: "rgba(0,0,0,0.02)" }}/>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {cashflowData.map((_, i) => <Cell key={i} fill={i === cashflowData.length - 1 ? "#60a5fa" : "#1e3a5f"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-[9px] text-gray-600">
            <span>Working Capital Cycle: <span className="text-gray-900 font-semibold">46 Days</span></span>
            <span className="text-emerald-600 font-semibold">▼ 9 Days</span>
          </div>
        </div>
      </div>

      {/* ── Row 3: Strategies + Control & Capacity + Market Signals ── */}
      <div className="grid grid-cols-12 gap-3">

        {/* Strategies & Execution Overview */}
        <div className="col-span-4 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900">Strategies & Execution Overview</span>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View all strategies</button>
          </div>
          <div className="space-y-2.5">
            {strategies.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="text-[11px] font-semibold text-gray-700 truncate">{s.initiative}</div>
                    <div className="text-[9px] text-gray-600 truncate">{s.objective}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] text-gray-500">{s.owner}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                      s.impact === "High" ? "bg-red-500/15 text-rose-600" : "bg-amber-500/15 text-amber-400"
                    }`}>{s.impact}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#f1f5f9" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.progress}%`,
                        backgroundColor: s.progress > 65 ? "#34d399" : s.progress > 45 ? "#f59e0b" : "#f97316",
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 w-7 text-right">{s.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control & Capacity Snapshot */}
        <div className="col-span-4 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-900">Control & Capacity Snapshot</span>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View full details</button>
          </div>
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            <GaugeRing pct={78} color="#60a5fa"  size={90} label="People Capacity"   value="78%" sub="Utilization Rate"/>
            <GaugeRing pct={68} color="#34d399"  size={90} label="Operational Capacity" value="68%" sub="Utilization Rate"/>
            <GaugeRing pct={74} color="#a78bfa"  size={90} label="Technology & Systems" value="74%" sub="Readiness Score"/>
          </div>
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
            <div className="text-[10px] font-bold text-gray-400 mb-2">Top Capacity Constraints</div>
            <div className="space-y-1">
              {[
                { n:1, text:"Skilled Manpower (BuildMax Infra)", sev:"High",   c:"text-rose-600" },
                { n:2, text:"Plant Capacity (AutoX Industries)",  sev:"Medium", c:"text-amber-400" },
                { n:3, text:"Working Capital (AgriPure Foods)",   sev:"Medium", c:"text-amber-400" },
              ].map(c => (
                <div key={c.n} className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-600">{c.n}.</span>
                  <span className="flex-1 text-[10px] text-gray-400 truncate">{c.text}</span>
                  <span className={`text-[9px] font-semibold ${c.c}`}>{c.sev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market & External Signals */}
        <div className="col-span-4 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900">Market & External Signals</span>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View all</button>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 mb-3">
            {["All","Risk","Opportunity","Regulatory","Industry"].map(t => (
              <button key={t} onClick={() => setSignalTab(t)}
                className={`px-2 py-1 text-[9px] font-semibold rounded-md transition-colors ${
                  signalTab === t
                    ? "bg-blue-600/30 text-blue-300"
                    : "text-gray-600 hover:text-gray-400"
                }`}>{t}</button>
            ))}
          </div>
          <div className="space-y-2">
            {marketSignals.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${s.color}20`, color: s.color }}
                >{s.tag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-700 leading-snug">{s.text}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] text-gray-600">{s.industry}</span>
                    <span className="text-[8px] text-gray-700">·</span>
                    <span className="text-[8px] text-gray-600">{s.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-2 text-[10px] text-blue-400 hover:underline font-semibold">View all signals</button>
        </div>
      </div>

      {/* ── Row 4: Alerts + Recent Reports ── */}
      <div className="grid grid-cols-12 gap-3">

        {/* Alerts */}
        <div className="col-span-4 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Alerts</span>
              <span className="text-[9px] font-semibold text-gray-500">(8 Unread)</span>
            </div>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View all alerts</button>
          </div>
          <div className="space-y-2">
            {alertsData.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ backgroundColor: a.bg, border: `1px solid ${a.color}20` }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: a.color }}/>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold mb-0.5" style={{ color: a.color }}>{a.priority}</div>
                  <div className="text-[10px] text-gray-700 leading-snug">{a.text}</div>
                </div>
                <div className="text-[9px] text-gray-600 whitespace-nowrap flex-shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="col-span-8 rounded-xl border p-4" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900">Recent Reports</span>
            <button className="text-[10px] text-blue-400 hover:underline font-semibold">View all reports</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Report Name","Entity","Category","Generated On",""].map(h => (
                    <th key={h} className="text-left text-[9px] text-gray-600 font-semibold pb-2 pr-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "#f1f5f9" }}>
                    <td className="py-2.5 pr-3">
                      <div className="text-[11px] font-semibold text-gray-700">{r.name}</div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{r.entity}</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                        style={{ backgroundColor: "rgba(96,165,250,0.15)", color: "#60a5fa" }}>
                        {r.cat}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[9px] text-gray-600 whitespace-nowrap">{r.date}</td>
                    <td className="py-2.5">
                      <button className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-blue-600/20 transition-colors"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                        <Download size={11} className="text-gray-400"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
