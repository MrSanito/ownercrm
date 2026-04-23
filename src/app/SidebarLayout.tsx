"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, TrendingUp, Gauge, BarChart2,
  Bell, Settings, LogOut, Search, Plus, ChevronDown,
  MessageSquare, Sparkles, Building2, Hammer, Leaf,
  HeartPulse, Landmark, Cpu, X, Target, Sliders, Activity, FileText
} from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "dashboard",          label: "Dashboard",                  icon: LayoutDashboard, initial: "DB" },
  { id: "strategies",         label: "Strategy & Execution",       icon: Target,          initial: "SE" },
  { id: "control-capacity",   label: "Control & Capacity",         icon: Sliders,         initial: "CC" },
  { id: "market-signals",     label: "Market Signals",             icon: Activity,        initial: "MS" },
  { id: "reports",            label: "Reports",                    icon: FileText,        initial: "RT" },
  { id: "alerts",             label: "Alerts",                     icon: Bell,            initial: "AL" },
];

const entities = [
  { id: "autox",     label: "AutoX Industries",  sub: "Automotive",        icon: Building2, color: "#60a5fa" },
  { id: "buildmax",  label: "BuildMax Infra",    sub: "Construction",      icon: Hammer,    color: "#f97316" },
  { id: "agripure",  label: "AgriPure Foods",    sub: "FMCO",              icon: Leaf,      color: "#34d399" },
  { id: "healthplus",label: "HealthPlus",        sub: "Healthcare",        icon: HeartPulse,color: "#f472b6" },
  { id: "finedge",   label: "FinEdge Capital",   sub: "Financial Services",icon: Landmark,  color: "#a78bfa" },
  { id: "technova",  label: "TechNova Systems",  sub: "Technology",        icon: Cpu,       color: "#22d3ee" },
];

export default function SidebarLayout({ children, currentPage, onNavigate }: SidebarLayoutProps) {
  const [aiSearch, setAiSearch] = useState("");
  const [activeEntity, setActiveEntity] = useState("autox");

  return (
    <div
      className="flex h-screen overflow-hidden font-sans"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* ═══════════════════════════════════════
          SIDEBAR — matches Image 2
      ═══════════════════════════════════════ */}
      <aside
        className="flex-shrink-0 flex flex-col overflow-hidden"
        style={{ width: 220, backgroundColor: "#0d1220", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* AI Search bar */}
        <div className="px-3 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="flex items-start gap-2 rounded-xl p-3 cursor-text"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
              <span className="text-white text-[10px] font-black">Ai</span>
            </div>
            <div className="flex-1 min-w-0">
              <input
                value={aiSearch}
                onChange={e => setAiSearch(e.target.value)}
                placeholder="Ask anything about your business..."
                className="bg-transparent text-white text-[11px] w-full focus:outline-none placeholder-gray-500 leading-snug"
              />
              <p className="text-[9px] text-gray-600 mt-1 leading-tight">
                Search across all entities, departments, finances, operations, people and external data
              </p>
            </div>
          </div>
        </div>

        {/* OVERVIEW section */}
        <div className="px-3 pt-3 pb-1">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-1 opacity-50">Overview</p>
        </div>

        {/* Nav items */}
        <nav className="px-2 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all group"
                style={{
                  backgroundColor: isActive ? "rgba(96,165,250,0.12)" : "transparent",
                  color: isActive ? "#60a5fa" : "#94a3b8",
                }}
              >
                <div 
                  className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500 group-hover:bg-white/10'}`}
                  style={{ minWidth: 24 }}
                >
                  {item.initial}
                </div>
                <span className="text-[12px] font-medium truncate">{item.label}</span>
                {item.id === "alerts" && (
                  <span className="ml-auto bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg">8</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ENTITIES section */}
        <div className="px-3 mt-4 pb-1 flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 px-2">Entities (6)</p>
          <button className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600/30 transition-colors">
            <Plus size={11}/>
          </button>
        </div>

        <div className="px-2 space-y-0.5 flex-1 overflow-y-auto pb-2">
          {entities.map(ent => {
            const Icon = ent.icon;
            const isActive = activeEntity === ent.id;
            return (
              <button
                key={ent.id}
                onClick={() => setActiveEntity(ent.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${ent.color}20` }}
                >
                  <Icon size={11} style={{ color: ent.color }}/>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-gray-300 truncate leading-tight">{ent.label}</div>
                  <div className="text-[9px] text-gray-600">{ent.sub}</div>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ent.color }}/>}
              </button>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="px-2 pb-4 space-y-0.5 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="pt-3"/>
          {[{ icon: Settings, label: "Settings" }, { icon: LogOut, label: "Log out" }].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all"
                style={{ color: "#475569" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#475569"; }}
              >
                <Icon size={14} className="flex-shrink-0"/>
                <span className="text-[12px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="h-13 flex items-center px-5 gap-4 flex-shrink-0"
          style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #f1f5f9", height: 52 }}
        >
          {/* AI search */}
          <div className="flex-1 max-w-lg relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-[8px] font-black">Ai</span>
            </div>
            <input
              placeholder="Ask anything about your business..."
              className="w-full h-9 pl-10 pr-4 text-[12px] rounded-lg focus:outline-none placeholder-gray-400 text-gray-900 shadow-sm"
              style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Sparkles size={13} className="text-blue-600"/>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <button className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}>
              <Bell size={15} className="text-gray-500"/>
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>
            </button>

            {/* Date */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-gray-500 shadow-sm"
              style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}>
              <span>📅</span> Today, 20 May 2024
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 cursor-pointer shadow-md">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#ffffff" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
