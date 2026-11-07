"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Topbar } from "@/components/Topbar";
import { FilterPanel, FilterState } from "@/components/FilterPanel";
import IntelligencePanel from "@/components/IntelligencePanel";
import { AboutModal } from "@/components/AboutModal";

const MapStage = dynamic(() => import("@/components/MapStage"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0e14] text-gray-400 font-mono text-sm">
      Initializing Geospatial Map Engine...
    </div>
  ),
});

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    country: "All",
    status: "All",
    showStations: true,
    showHeatmap: true,
  });

  const [metrics, setMetrics] = useState<{
    total_stations?: number;
    active_stations?: number;
    countries_covered?: number;
  }>({});

  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    fetch("http://127.0.0.1:8000/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.total_stations) {
          setMetrics(data);
          setActiveCount(data.total_stations);
        }
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  const handleStationClick = (station: any) => {
    setSelectedStation(station);
  };

  const countValue = activeCount ?? metrics.total_stations;
  const formattedCount = mounted ? countValue?.toLocaleString() : String(countValue || "---");

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0e14] flex flex-col">
      {/* Top Header Navigation */}
      <Topbar
        totalStations={metrics.total_stations}
        activeStations={activeCount ?? undefined}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* 70/30 Main Content Workspace */}
      <div className="relative flex-1 w-full flex overflow-hidden pt-14">
        {/* 70% Visualization (Map Area) */}
        <div className="relative w-[70%] h-full">
          {/* Filter Control Bar Overlay */}
          <div className="absolute top-4 left-6 z-20">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>

          <MapStage
            filters={filters}
            onCountChange={(count: number) => setActiveCount(count)}
            onStationSelect={handleStationClick}
          />

          {/* Active Station Counter Footer Widget */}
          <div className="absolute bottom-6 right-6 z-20 bg-[#0B1117]/90 backdrop-blur-md border border-[#1F2937] px-4 py-2.5 rounded-lg flex flex-col items-end shadow-xl">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
              ACTIVE STATIONS
            </span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {formattedCount}
            </span>
          </div>
        </div>

        {/* 30% Intelligence Workspace */}
        <div className="w-[30%] h-full">
          <IntelligencePanel
            station={selectedStation}
            onClose={() => setSelectedStation(null)}
          />
        </div>
      </div>

      {/* About & Governance Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}
