"use client";

import React from "react";

type IntelligencePanelProps = {
  station: any | null;
  onClose: () => void;
};

export default function IntelligencePanel({
  station,
  onClose,
}: IntelligencePanelProps) {
  if (!station) return null;

  const props = station.properties || station;

  return (
    <aside className="fixed top-16 right-6 z-40 w-80 bg-[#0B1117]/95 backdrop-blur-md border border-[#1F2937] rounded-lg p-5 shadow-2xl text-white">
      <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide">
            Station Intelligence
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded border border-[#1F2937] hover:bg-[#1F2937] transition"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 space-y-3 text-xs">
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-mono">
            Station Name
          </span>
          <p className="font-medium text-gray-200">
            {props.station_name || props.name || "Unknown Station"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1F2937]/50">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-mono">
              Country
            </span>
            <p className="font-semibold text-gray-200">
              {props.country || "N/A"}
            </p>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-mono">
              City
            </span>
            <p className="font-semibold text-gray-200">
              {props.city || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1F2937]/50">
          <div className="bg-[#161B22] p-2 rounded border border-[#1F2937]">
            <span className="text-gray-400 block text-[9px] uppercase font-mono">
              PM2.5 (µg/m³)
            </span>
            <p className="text-sm font-mono font-bold text-amber-400">
              {props.pm25 !== undefined ? props.pm25 : "N/A"}
            </p>
          </div>
          <div className="bg-[#161B22] p-2 rounded border border-[#1F2937]">
            <span className="text-gray-400 block text-[9px] uppercase font-mono">
              PM10 (µg/m³)
            </span>
            <p className="text-sm font-mono font-bold text-sky-400">
              {props.pm10 !== undefined ? props.pm10 : "N/A"}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1F2937]/50">
          <span className="text-gray-400 block text-[10px] uppercase font-mono">
            AQI Category
          </span>
          <p className="font-medium text-emerald-400">
            {props.aqi_category || props.status || "Moderate"}
          </p>
        </div>
      </div>
    </aside>
  );
}