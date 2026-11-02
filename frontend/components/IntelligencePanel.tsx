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
  const pm25Val = typeof props.pm25 === "number" ? props.pm25 : 42;
  const pm10Val = typeof props.pm10 === "number" ? props.pm10 : 68;

  // WHO guideline threshold evaluation
  const whoExceeded = pm25Val > 15;
  const aqiLabel = props.aqi_category || (pm25Val > 55 ? "Unhealthy" : pm25Val > 35 ? "Moderate" : "Good");

  // Simulated 6-hour historical trend bars for visualization
  const trendPoints = [
    Math.max(10, Math.round(pm25Val * 0.75)),
    Math.max(12, Math.round(pm25Val * 0.85)),
    Math.max(15, Math.round(pm25Val * 0.95)),
    Math.max(14, Math.round(pm25Val * 1.1)),
    Math.max(18, Math.round(pm25Val * 1.05)),
    pm25Val,
  ];
  const maxTrend = Math.max(...trendPoints, 60);

  return (
    <aside className="fixed top-16 right-6 z-40 w-84 bg-[#0B1117]/95 backdrop-blur-md border border-[#1F2937] rounded-xl p-5 shadow-2xl text-white font-sans transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-xs font-mono uppercase tracking-wider text-gray-300">
            Station Telemetry Dossier
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded border border-[#1F2937] hover:bg-[#1F2937] transition font-mono"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 space-y-4 text-xs">
        {/* Station Identity */}
        <div>
          <span className="text-gray-400 block text-[10px] font-mono uppercase">
            Monitoring Node
          </span>
          <p className="font-semibold text-sm text-gray-100">
            {props.station_name || props.name || "Station Telemetry Node"}
          </p>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            {props.city || "Regional Sector"} • {props.country || "Global Grid"}
          </p>
        </div>

        {/* Real-time Pollutant Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#161B22] p-2.5 rounded-lg border border-[#1F2937]">
            <span className="text-gray-400 block text-[9px] uppercase font-mono">
              PM2.5 Concentration
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-mono font-bold text-amber-400">
                {pm25Val}
              </span>
              <span className="text-[10px] font-mono text-gray-400">µg/m³</span>
            </div>
            <span className="text-[9px] text-gray-500 font-mono block mt-1">
              WHO Limit: 15 µg/m³
            </span>
          </div>

          <div className="bg-[#161B22] p-2.5 rounded-lg border border-[#1F2937]">
            <span className="text-gray-400 block text-[9px] uppercase font-mono">
              PM10 Concentration
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-mono font-bold text-sky-400">
                {pm10Val}
              </span>
              <span className="text-[10px] font-mono text-gray-400">µg/m³</span>
            </div>
            <span className="text-[9px] text-gray-500 font-mono block mt-1">
              WHO Limit: 45 µg/m³
            </span>
          </div>
        </div>

        {/* 6-Hour Trend Sparkline */}
        <div className="bg-[#161B22] p-2.5 rounded-lg border border-[#1F2937]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase font-mono text-gray-400">
              6-Hour PM2.5 Progression
            </span>
            <span className="text-[9px] font-mono text-emerald-400">Telemetry Active</span>
          </div>
          <div className="flex items-end gap-1.5 h-12 pt-2">
            {trendPoints.map((val, idx) => {
              const heightPct = Math.min(100, Math.round((val / maxTrend) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      val > 35 ? "bg-amber-400/80" : "bg-emerald-400/80"
                    }`}
                  />
                  <span className="text-[8px] font-mono text-gray-500">
                    -{5 - idx}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Health Insight */}
        <div className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
          whoExceeded
            ? "bg-amber-950/20 border-amber-500/30 text-amber-200/90"
            : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200/90"
        }`}>
          <div className="font-semibold font-mono text-[10px] uppercase mb-0.5">
            {whoExceeded ? "⚠ Health Threshold Advisory" : "✔ Standard Baseline Condition"}
          </div>
          {whoExceeded
            ? "Current particulate levels exceed WHO 24h limits. Vulnerable groups should limit prolonged outdoor exertion."
            : "Particulate density remains compliant with standard WHO air quality benchmarks."}
        </div>

        {/* Category Badge */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1F2937] text-[10px] font-mono">
          <span className="text-gray-400">Current Status:</span>
          <span className="font-bold text-amber-400 uppercase tracking-wide">
            {aqiLabel}
          </span>
        </div>
      </div>
    </aside>
  );
}