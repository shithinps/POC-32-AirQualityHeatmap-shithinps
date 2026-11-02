"use client";

import React from "react";

interface TopbarProps {
  totalStations?: number;
  totalOperators?: number;
  totalCountries?: number;
  activeStations?: number;
  onOpenAbout: () => void;
}

export function Topbar({
  totalStations = 270719,
  totalOperators,
  totalCountries,
  activeStations,
  onOpenAbout,
}: TopbarProps) {
  const displayCount =
    typeof activeStations === "number" && activeStations > 0
      ? activeStations
      : totalStations;

  return (
    <header className="relative z-30 flex h-14 w-full items-center justify-between border-b border-emerald-500/20 bg-[#060b13]/90 px-6 backdrop-blur-md">
      {/* Brand & Heading */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
          <h1 className="text-sm font-bold uppercase tracking-wider text-white">
            EV Network Command Centre
          </h1>
        </div>
        <span className="text-[10px] text-slate-500 font-mono tracking-widest hidden sm:inline-block">
          ELECTRIC VEHICLE INTELLIGENCE NETWORK
        </span>
      </div>

      {/* Top Right Controls & Status */}
      <div className="flex items-center gap-5">
        {/* Network Status Indicator */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase text-slate-500">
              NETWORK
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-400">
              ONLINE
            </span>
          </div>
        </div>

        {/* Dynamic Station Count */}
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase text-slate-500">
            STATIONS
          </span>
          <span className="text-xs font-bold font-mono tracking-wide text-white">
            {displayCount.toLocaleString()}
          </span>
        </div>

        {/* System Metadata Modal Button */}
        <button
          onClick={onOpenAbout}
          title="System Metadata"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400 hover:bg-slate-800"
        >
          <span className="font-serif italic font-semibold text-xs">i</span>
        </button>
      </div>
    </header>
  );
}