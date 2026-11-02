"use client";

import React, { useState, useEffect } from "react";
import { Topbar } from "../components/Topbar";
import { IntelligencePanel } from "../components/IntelligencePanel";
import { AboutModal } from "../components/AboutModal";
import MapStage from "../components/MapStage";
import FilterPanel from "../components/Filterpanel";

export default function Page() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const [metrics, setMetrics] = useState({
    total_stations: 270719,
    operators: 907,
    countries: 128,
  });
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({
    level: "ALL",
    region: [],
    operator: "",
  });
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch System Metrics
    fetch(`${API}/api/metrics`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setMetrics({
            total_stations: data.total_stations ?? data.total ?? 270719,
            operators: data.operators ?? data.total_operators ?? 907,
            countries: data.countries ?? data.total_countries ?? 128,
          });
        }
      })
      .catch((err) => console.error("Metrics fetch error:", err));

    // 2. Fetch Countries Dropdown
    fetch(`${API}/api/filters/countries`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setCountryOptions(data);
        }
      })
      .catch((err) => console.error("Countries fetch error:", err));
  }, [API]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#020617] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Topbar
        totalStations={metrics.total_stations}
        totalOperators={metrics.operators}
        totalCountries={metrics.countries}
        activeStations={activeCount ?? undefined}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Map Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <MapStage
          filters={filters}
          onCountChange={(count) => setActiveCount(count)}
          onStationClick={() => setIsIntelligenceOpen(true)}
        />

        {/* Filter Selection Panel */}
        <div className="absolute top-4 left-4 z-20">
          <FilterPanel
            filters={filters}
            onChange={(newFilters) => {
              setFilters(newFilters);
              setActiveCount(null);
            }}
            countryOptions={countryOptions}
          />
        </div>

        {/* Bottom-Right Active Count Indicator */}
        <div className="absolute bottom-6 right-6 z-20 hidden sm:flex flex-col items-end rounded-lg border border-slate-800 bg-[#060b13]/80 px-4 py-2 backdrop-blur-md">
          <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400">
            ACTIVE STATIONS
          </span>
          <span className="font-mono text-sm font-bold text-emerald-400">
            {(activeCount ?? metrics.total_stations).toLocaleString()}
          </span>
        </div>

        {/* Bottom-Left Toggle Button */}
        <button
          onClick={() => setIsIntelligenceOpen((prev) => !prev)}
          className="absolute bottom-6 left-6 z-20 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-[#060b13]/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 shadow-xl backdrop-blur-md transition hover:bg-emerald-950/40 hover:border-emerald-400"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {isIntelligenceOpen ? "Close Intelligence" : "Open Intelligence"}
        </button>
      </div>

      {/* Intelligence Side Drawer */}
      <IntelligencePanel
        isOpen={isIntelligenceOpen}
        onClose={() => setIsIntelligenceOpen(false)}
        filters={filters}
        metrics={{
          total_stations: activeCount ?? metrics.total_stations,
          operators: metrics.operators,
          countries:
            Array.isArray(filters.region) && filters.region.length > 0
              ? filters.region.length
              : metrics.countries,
        }}
      />

      {/* System Metadata Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}