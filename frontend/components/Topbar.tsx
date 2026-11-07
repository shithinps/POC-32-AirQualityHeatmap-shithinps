"use client";

import React from "react";

interface TopbarProps {
  totalStations?: number;
  totalOperators?: number;
  totalCountries?: number;
  activeStations?: number;
  onOpenAbout?: () => void;
}

export function Topbar({
  totalStations = 1800,
  activeStations,
  onOpenAbout = () => {},
}: TopbarProps) {
  const displayCount = activeStations ?? totalStations;

  return (
    <header className="absolute top-0 left-0 right-0 z-30 h-14 bg-[#0a0e14]/80 backdrop-blur-md border-b border-[#1f2937] px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <h1 className="text-sm font-semibold tracking-wide text-white">
          AIR QUALITY HEATMAP
        </h1>
        <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
          GLOBAL MONITORING NETWORK
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 font-medium">
            ONLINE
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] font-mono uppercase text-gray-400">
            STATIONS
          </span>
          <span
            suppressHydrationWarning
            className="text-xs font-bold font-mono tracking-wider text-white"
          >
            {displayCount?.toLocaleString()}
          </span>
        </div>

        <button
          onClick={onOpenAbout}
          className="text-xs px-2.5 py-1 rounded bg-[#161b22] hover:bg-[#1f2937] text-gray-300 border border-[#30363d] transition-colors"
        >
          Info
        </button>
      </div>
    </header>
  );
}
