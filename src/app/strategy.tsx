"use client";
import React, { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area,
} from "recharts";
import {
  TrendingUp, ChevronDown, Plus, MoreVertical, ArrowRight,
  Download, Filter, Settings2, Users, Target, DollarSign,
  Lightbulb, RefreshCw, AlertTriangle, CheckCircle, Clock,
} from "lucide-react";

/* ═══════════════════ SHARED HELPERS ═══════════════════ */
function Spark({ data, color }: { data: number[]; color: string }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const W = 80, H = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - mn) / rng) * (H - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-20 h-7">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MiniSpark({ data, color }: { data: number[]; color: string }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const W = 60, H = 20;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - mn) / rng) * (H - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-14 h-4">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{pct}%</span>
    </div>
  );
}

/* ═══════════════════ DATA ═══════════════════ */
const trendGreen = [10, 12, 11, 14, 13, 15, 14, 16, 15, 18];
const trendAmber = [18, 17, 16, 15, 14, 15, 13, 14, 12, 13];
const trendRed   = [12, 11, 10, 9, 8, 9, 7, 8, 6, 7];

const focusAreas = [
  { label: "Revenue Growth",        pct: "37%", count: "9 Initiatives",  icon: TrendingUp,   color: "#6366f1", bg: "bg-indigo-50"  },
  { label: "Operational Excellence",pct: "25%", count: "6 Initiatives",  icon: Settings2,    color: "#3b82f6", bg: "bg-blue-50"    },
  { label: "Cost Optimization",     pct: "17%", count: "4 Initiatives",  icon: DollarSign,   color: "#22c55e", bg: "bg-green-50"   },
  { label: "Market Expansion",      pct: "13%", count: "3 Initiatives",  icon: Target,       color: "#f59e0b", bg: "bg-amber-50"   },
  { label: "Innovation & Digital",  pct: "8%",  count: "2 Initiatives",  icon: Lightbulb,    color: "#a855f7", bg: "bg-purple-50"  },
];

const initiatives = [
  {
    name: "Market Expansion – North India", sub: "Expand presence in North India markets",
    entities: ["AutoX","BuildMax","HealthPlus","+1"], entityColors: ["#6366f1","#f97316","#ec4899"],
    objective: "Increase market share to 15% in North India by FY25",
    owner: "Rohit S.", ownerRole: "Group CEO",
    status: "On Track", statusC: "bg-green-100 text-green-700",
    progress: 72, impactC: "bg-red-100 text-red-700", impact: "High",
    timeline: "Dec 2024", roi: "₹45 Cr",
  },
  {
    name: "Product Innovation Program", sub: "Launch next-gen product portfolio",
    entities: ["AgriPure","TechNova"], entityColors: ["#34d399","#22d3ee"],
    objective: "Launch 5 new products in FY25",
    owner: "Neha K.", ownerRole: "COO",
    status: "At Risk", statusC: "bg-amber-100 text-amber-700",
    progress: 45, impactC: "bg-red-100 text-red-700", impact: "High",
    timeline: "Mar 2025", roi: "₹38 Cr",
  },
  {
    name: "Cost Optimization Initiative", sub: "Reduce operating costs across entities",
    entities: ["All Entities"], entityColors: ["#94a3b8"],
    objective: "Reduce operating costs by 12% by FY25",
    owner: "Vikas M.", ownerRole: "CFO",
    status: "On Track", statusC: "bg-green-100 text-green-700",
    progress: 68, impactC: "bg-amber-100 text-amber-700", impact: "Medium",
    timeline: "Dec 2024", roi: "₹28 Cr",
  },
  {
    name: "Digital Transformation", sub: "Implement ERP across all units",
    entities: ["AutoX","BuildMax","TechNova","+2"], entityColors: ["#6366f1","#f97316","#22d3ee"],
    objective: "100% ERP coverage across entities",
    owner: "Anita P.", ownerRole: "CTO",
    status: "On Track", statusC: "bg-green-100 text-green-700",
    progress: 52, impactC: "bg-red-100 text-red-700", impact: "High",
    timeline: "Jun 2025", roi: "₹32 Cr",
  },
  {
    name: "Working Capital Optimization", sub: "Improve cash conversion cycle",
    entities: ["All Entities"], entityColors: ["#94a3b8"],
    objective: "Improve CCC by 15 days",
    owner: "Sameer A.", ownerRole: "CFO",
    status: "At Risk", statusC: "bg-amber-100 text-amber-700",
    progress: 30, impactC: "bg-red-100 text-red-700", impact: "High",
    timeline: "Sep 2024", roi: "₹22 Cr",
  },
  {
    name: "Talent & Leadership Program", sub: "Build leadership bench strength",
    entities: ["All Entities"], entityColors: ["#94a3b8"],
    objective: "Develop next-gen leaders across the group",
    owner: "Priya N.", ownerRole: "CHRO",
    status: "On Track", statusC: "bg-green-100 text-green-700",
    progress: 60, impactC: "bg-amber-100 text-amber-700", impact: "Medium",
    timeline: "Dec 2024", roi: "₹12 Cr",
  },
];

/* ── Section 2 data ── */
const keyResultsDonut = [
  { name: "Ahead of Plan", value: 8,  pct: "32%", color: "#22c55e" },
  { name: "On Track",      value: 13, pct: "36%", color: "#3b82f6" },
  { name: "At Risk",       value: 8,  pct: "22%", color: "#f59e0b" },
  { name: "Behind Plan",   value: 4,  pct: "11%", color: "#ef4444" },
  { name: "Not Started",   value: 3,  pct: "8%",  color: "#94a3b8" },
];

const resourceDonut = [
  { name: "Revenue Growth",        value: 156, pct: "38%", color: "#6366f1" },
  { name: "Operational Excellence",value: 98,  pct: "24%", color: "#3b82f6" },
  { name: "Cost Optimization",     value: 74,  pct: "18%", color: "#22c55e" },
  { name: "Innovation & Digital",  value: 56,  pct: "14%", color: "#f59e0b" },
  { name: "Market Expansion",      value: 28,  pct: "6%",  color: "#a855f7" },
];

const risks = [
  { name: "Raw material price volatility",  sev: "High",   sevC: "bg-red-100 text-red-700",    impact: "₹28 Cr",  owner: "Vikas M.",  mitStatus: "In Progress", mitC: "bg-blue-100 text-blue-700"    },
  { name: "Regulatory changes (EV policy)", sev: "High",   sevC: "bg-red-100 text-red-700",    impact: "₹18 Cr",  owner: "Neha K.",   mitStatus: "In Progress", mitC: "bg-blue-100 text-blue-700"    },
  { name: "Receivables collection delay",   sev: "Medium", sevC: "bg-amber-100 text-amber-700",impact: "₹15 Cr",  owner: "Rohit S.",  mitStatus: "Planned",     mitC: "bg-gray-100 text-gray-600"    },
  { name: "Skilled manpower availability",  sev: "Medium", sevC: "bg-amber-100 text-amber-700",impact: "₹12 Cr",  owner: "Priya N.",  mitStatus: "In Progress", mitC: "bg-blue-100 text-blue-700"    },
  { name: "IT system integration delay",    sev: "Low",    sevC: "bg-green-100 text-green-700",impact: "₹6 Cr",   owner: "Anita P.",  mitStatus: "Planned",     mitC: "bg-gray-100 text-gray-600"    },
];

const entitiesPerf = [
  { name: "AutoX Industries",  sub: "Automotive",         progress: 72, onTrack: 4, atRisk: 1, behind: 1, invest: "₹126 Cr", impact: "₹184 Cr", impPct: "+16%", trend: [30,35,32,40,38,45,42,50], tC: "#22c55e", initiatives: 6 },
  { name: "BuildMax Infra",    sub: "Construction",       progress: 58, onTrack: 2, atRisk: 2, behind: 1, invest: "₹98 Cr",  impact: "₹112 Cr", impPct: "+8%",  trend: [20,22,21,24,23,22,20,21], tC: "#f59e0b", initiatives: 5 },
  { name: "AgriPure Foods",    sub: "FMCO",               progress: 65, onTrack: 2, atRisk: 1, behind: 1, invest: "₹64 Cr",  impact: "₹78 Cr",  impPct: "+12%", trend: [18,20,19,22,21,23,22,24], tC: "#22c55e", initiatives: 4 },
  { name: "HealthPlus",        sub: "Healthcare",         progress: 44, onTrack: 1, atRisk: 3, behind: 1, invest: "₹54 Cr",  impact: "₹44 Cr",  impPct: "+3%",  trend: [15,14,16,14,15,13,14,12], tC: "#ef4444", initiatives: 5 },
  { name: "FinEdge Capital",   sub: "Financial Services", progress: 68, onTrack: 3, atRisk: 1, behind: 0, invest: "₹38 Cr",  impact: "₹56 Cr",  impPct: "+22%", trend: [8,10,9,12,11,13,12,15],  tC: "#22c55e", initiatives: 4 },
  { name: "TechNova Systems",  sub: "Technology",         progress: 75, onTrack: 4, atRisk: 1, behind: 0, invest: "₹32 Cr",  impact: "₹65 Cr",  impPct: "+18%", trend: [5,7,6,9,8,11,10,13],    tC: "#22c55e", initiatives: 5 },
];

const entityColors: Record<string, string> = {
  "AutoX Industries": "#6366f1", "BuildMax Infra": "#f97316",
  "AgriPure Foods": "#34d399",  "HealthPlus": "#ec4899",
  "FinEdge Capital": "#a78bfa", "TechNova Systems": "#22d3ee",
};

const impactSummary = [
  { icon:"📈", label:"Revenue Impact",   value:"₹539 Cr", change:"+14.6% vs LY", up:true,  color:"#22c55e" },
  { icon:"💰", label:"Cost Savings",     value:"₹112 Cr", change:"+11.3% vs LY", up:true,  color:"#3b82f6" },
  { icon:"📊", label:"EBITDA Impact",    value:"₹186 Cr", change:"+17.8% vs LY", up:true,  color:"#f59e0b" },
  { icon:"🏦", label:"Cash Flow Impact", value:"₹154 Cr", change:"+13.2% vs LY", up:true,  color:"#a855f7" },
];

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function StrategyPage() {
  const [groupBy, setGroupBy] = useState("None");
  const [sortBy,  setSortBy]  = useState("Priority");
  const [viewBy,  setViewBy]  = useState("Entity");

  return (
    <div className="p-5 space-y-6 bg-white min-h-full">

      {/* ════════════════════════════════
          SECTION 1 — Strategies & Execution Overview
      ════════════════════════════════ */}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Strategies & Execution</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track strategic initiatives across all entities and drive execution.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            🏢 All Entities <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            🏭 All Industries <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus size={15} /> New Strategic Initiative
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Total Strategic Initiatives */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Total Strategic Initiatives</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Target size={14} className="text-indigo-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">24</div>
          <div className="text-xs text-gray-400 mt-0.5">Across 6 Entities</div>
        </div>

        {/* On Track */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-2">On Track</div>
          <div className="text-3xl font-black text-gray-900">12</div>
          <div className="text-xs text-gray-400 mt-0.5">50% of total</div>
          <Spark data={trendGreen} color="#22c55e" />
        </div>

        {/* At Risk */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-2">At Risk</div>
          <div className="text-3xl font-black text-amber-500">7</div>
          <div className="text-xs text-gray-400 mt-0.5">29% of total</div>
          <Spark data={trendAmber} color="#f59e0b" />
        </div>

        {/* Off Track */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-2">Off Track</div>
          <div className="text-3xl font-black text-red-500">5</div>
          <div className="text-xs text-gray-400 mt-0.5">21% of total</div>
          <Spark data={trendRed} color="#ef4444" />
        </div>

        {/* Overall Execution Score */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-2">Overall Execution Score</div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-gray-900">68 <span className="text-sm font-normal text-gray-400">/100</span></div>
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 48 48" className="w-12 h-12">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="5"
                  strokeDasharray={`${(68/100)*125.6} ${125.6-(68/100)*125.6}`}
                  strokeLinecap="round" transform="rotate(-90 24 24)" />
              </svg>
            </div>
          </div>
          <div className="text-xs text-green-500 font-semibold mt-0.5">↑ 6 pts vs last month</div>
        </div>
      </div>

      {/* Strategic Focus Areas */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Strategic Focus Areas <span className="font-normal text-gray-400">(Distribution by Impact)</span>
        </div>
        <div className="grid grid-cols-6 gap-4 items-center">
          {focusAreas.map((fa, i) => {
            const Icon = fa.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-xl ${fa.bg} flex items-center justify-center mb-2`}>
                  <Icon size={18} style={{ color: fa.color }} />
                </div>
                <div className="text-xl font-black" style={{ color: fa.color }}>{fa.pct}</div>
                <div className="text-[11px] font-semibold text-gray-700 mt-0.5">{fa.label}</div>
                <div className="text-[10px] text-gray-400">{fa.count}</div>
              </div>
            );
          })}
          {/* Total donut */}
          <div className="flex flex-col items-center text-center border-l border-gray-100 pl-4">
            <div className="relative w-16 h-16 mb-1">
              <ResponsiveContainer width={64} height={64}>
                <PieChart>
                  <Pie data={focusAreas.map(f=>({value:parseInt(f.pct)}))} cx="50%" cy="50%" innerRadius={20} outerRadius={30} dataKey="value" strokeWidth={0}>
                    {focusAreas.map((fa, i) => <Cell key={i} fill={fa.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xl font-black text-gray-900">24</div>
            <div className="text-[10px] text-gray-400">Total Programs</div>
            <div className="text-[10px] text-gray-400">Across 6 Entities</div>
          </div>
        </div>
      </div>

      {/* Strategic Initiatives Overview Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-900">Strategic Initiatives Overview</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Group by:</span>
            <button className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
              {groupBy} <ChevronDown size={11} />
            </button>
            <span className="text-xs text-gray-400">Sort by:</span>
            <button className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
              {sortBy} <ChevronDown size={11} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Settings2 size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Initiative","Linked Entity / Entities","Strategic Objective","Owner","Status","Progress","Impact","Timeline","ROI Potential",""].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {initiatives.map((ini, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  {/* Initiative */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Target size={13} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-gray-800 whitespace-nowrap">{ini.name}</div>
                        <div className="text-[10px] text-gray-400">{ini.sub}</div>
                      </div>
                    </div>
                  </td>
                  {/* Entities */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {ini.entities.map((e, ei) => (
                        <span key={ei} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{ backgroundColor: `${ini.entityColors[ei] || "#94a3b8"}18`, color: ini.entityColors[ei] || "#64748b" }}>
                          {e}
                        </span>
                      ))}
                    </div>
                  </td>
                  {/* Objective */}
                  <td className="px-4 py-3 max-w-[160px]">
                    <div className="text-[11px] text-gray-600 leading-snug">{ini.objective}</div>
                  </td>
                  {/* Owner */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                        {ini.owner.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-700">{ini.owner}</div>
                        <div className="text-[9px] text-gray-400">{ini.ownerRole}</div>
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${ini.statusC}`}>{ini.status}</span>
                  </td>
                  {/* Progress */}
                  <td className="px-4 py-3 w-32">
                    <ProgressBar pct={ini.progress} color={ini.status === "On Track" ? "#22c55e" : ini.status === "At Risk" ? "#f59e0b" : "#ef4444"} />
                  </td>
                  {/* Impact */}
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${ini.impactC}`}>{ini.impact}</span>
                  </td>
                  {/* Timeline */}
                  <td className="px-4 py-3 text-[11px] text-gray-600 whitespace-nowrap">{ini.timeline}</td>
                  {/* ROI */}
                  <td className="px-4 py-3 text-[11px] font-semibold text-gray-800 whitespace-nowrap">{ini.roi}</td>
                  {/* Menu */}
                  <td className="px-4 py-3">
                    <button className="text-gray-300 hover:text-gray-500 transition-colors"><MoreVertical size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-50">
          <button className="flex items-center gap-1.5 text-indigo-600 text-sm font-semibold hover:underline transition-colors">
            View all initiatives <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 2 — Key Results, Resources, Risks, Entity Performance
      ════════════════════════════════ */}

      {/* Row: Key Results + Resource Allocation + Risks */}
      <div className="grid grid-cols-12 gap-4">

        {/* Key Results Overview */}
        <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-0.5">Key Results Overview</div>
          <div className="text-xs text-gray-400 mb-3">Overall progress on strategic objectives</div>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0" style={{ width: 130, height: 130 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={keyResultsDonut} cx="50%" cy="50%" innerRadius={42} outerRadius={60} dataKey="value" strokeWidth={2} stroke="#fff" startAngle={90} endAngle={-270}>
                    {keyResultsDonut.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xs text-gray-400">Overall</div>
                <div className="text-xs text-gray-400">Progress</div>
                <div className="text-xl font-black text-gray-900">61%</div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {keyResultsDonut.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{d.value} ({d.pct})</span>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-3 flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline">
            View key results <ArrowRight size={12} />
          </button>
        </div>

        {/* Resource Allocation */}
        <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-0.5">Resource Allocation <span className="text-xs font-normal text-gray-400">(Across All Entities)</span></div>
          <div className="text-xs text-gray-400 mb-3">Investing in what drives the highest impact</div>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0" style={{ width: 130, height: 130 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={resourceDonut} cx="50%" cy="50%" innerRadius={42} outerRadius={60} dataKey="value" strokeWidth={2} stroke="#fff" startAngle={90} endAngle={-270}>
                    {resourceDonut.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }}
                    formatter={(v: any) => [`₹${v} Cr`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xs text-gray-400">Total</div>
                <div className="text-xs text-gray-400">Allocation</div>
                <div className="text-base font-black text-gray-900">₹412 Cr</div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {resourceDonut.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600 truncate">{d.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700 whitespace-nowrap ml-1">₹{d.value} Cr ({d.pct})</span>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-3 flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline">
            View allocation details <ArrowRight size={12} />
          </button>
        </div>

        {/* Risks & Dependencies */}
        <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-0.5">Risks & Dependencies</div>
          <div className="text-xs text-gray-400 mb-3">Top risks that can impact strategy execution</div>
          <div className="space-y-1.5">
            <div className="grid grid-cols-4 gap-2 text-[9px] text-gray-400 font-semibold uppercase tracking-wide pb-1 border-b border-gray-100">
              <span className="col-span-1">Risk / Dependency</span>
              <span className="text-center">Severity</span>
              <span className="text-center">Impact</span>
              <span className="text-right">Mitigation</span>
            </div>
            {risks.map((r, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center py-1 border-b border-gray-50 last:border-b-0">
                <div className="col-span-1 text-[11px] font-medium text-gray-700 leading-tight">{r.name}</div>
                <div className="text-center">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${r.sevC}`}>{r.sev}</span>
                </div>
                <div className="text-center text-[11px] font-semibold text-gray-700">{r.impact}</div>
                <div className="text-right">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${r.mitC}`}>{r.mitStatus}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 text-indigo-600 text-xs font-semibold hover:underline">View all risks</button>
        </div>
      </div>

      {/* Row: Initiatives by Entity + Strategic Impact Summary */}
      <div className="grid grid-cols-12 gap-4">

        {/* Initiatives by Entity / Industry */}
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div>
              <div className="text-sm font-bold text-gray-900">Initiatives by Entity / Industry</div>
              <div className="text-xs text-gray-400 mt-0.5">Compare strategic execution across businesses and industries</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">View by:</span>
              <button className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100">
                {viewBy} <ChevronDown size={11} />
              </button>
              <span className="text-xs text-gray-400">Industry:</span>
              <button className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100">
                All <ChevronDown size={11} />
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100">
                <Download size={11} /> Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Entity / Industry","Strategic Initiatives","Overall Progress","On Track","At Risk","Behind","Investment (YTD)","Impact (YTD)","Trend",""].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[9px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entitiesPerf.map((e, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
                          style={{ backgroundColor: entityColors[e.name] }}>
                          {e.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-gray-800">{e.name}</div>
                          <div className="text-[9px] text-gray-400">{e.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[11px] font-semibold text-gray-700 text-center">{e.initiatives}</td>
                    <td className="px-3 py-3 w-28">
                      <ProgressBar pct={e.progress} color={e.progress >= 65 ? "#22c55e" : e.progress >= 50 ? "#f59e0b" : "#ef4444"} />
                    </td>
                    <td className="px-3 py-3 text-center text-[11px] font-semibold text-green-600">{e.onTrack}</td>
                    <td className="px-3 py-3 text-center text-[11px] font-semibold text-amber-600">{e.atRisk}</td>
                    <td className="px-3 py-3 text-center text-[11px] font-semibold text-red-500">{e.behind}</td>
                    <td className="px-3 py-3 text-[11px] text-gray-600 whitespace-nowrap">{e.invest}</td>
                    <td className="px-3 py-3">
                      <div className="text-[11px] font-semibold text-gray-800">{e.impact}</div>
                      <div className="text-[9px] text-green-500 font-semibold">{e.impPct}</div>
                    </td>
                    <td className="px-3 py-3"><MiniSpark data={e.trend} color={e.tC} /></td>
                    <td className="px-3 py-3">
                      <button className="text-gray-300 hover:text-gray-500 transition-colors"><ChevronDown size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <button className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline">
              View all entities performance <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Strategic Impact Summary */}
        <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-0.5">Strategic Impact Summary (YTD)</div>
          <div className="text-xs text-gray-400 mb-4">Cumulative impact delivered through strategic initiatives</div>
          <div className="space-y-3">
            {impactSummary.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-400">{s.label}</div>
                  <div className="text-xl font-black text-gray-900">{s.value}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-green-500 whitespace-nowrap">{s.change}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline">
            View impact analysis <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
