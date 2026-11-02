"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Topbar } from "@/components/Topbar";
import FilterPanel from "@/components/Filterpanel";
import IntelligencePanel from "@/components/IntelligencePanel";
import AboutModal from "@/components/AboutModal";

const MapStage = dynamic(() => import("@/components/MapStage"), {
  ssr: false,
});

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<any>({
    country: "",
    operator: "",
    region: [],
  });
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [metrics, setMetrics] = useState({
    total_stations: 1800,
    avg_pm25: 0,
    total_population_exposed: 0,
  });
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
    setIsIntelligenceOpen(true);
  };

  const countValue = activeCount ?? metrics.total_stations;
  const formattedCount = mounted ? countValue.toLocaleString() : String(countValue);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0e14] text-white">
      {/* Top Header Navigation */}
      <Topbar
        totalStations={metrics.total_stations}
        activeStations={activeCount ?? undefined}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Filter Control Bar Overlay */}
      <div className="absolute top-16 left-6 z-20">
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      {/* Main Map Visualization */}
      <div className="w-full h-full">
        <MapStage
          filters={filters}
          onCountChange={(count: number) => setActiveCount(count)}
          onStationSelect={handleStationClick}
        />
      </div>

      {/* Active Station Counter Footer Widget */}
      <div className="absolute bottom-6 right-6 z-20 bg-[#0B1117]/90 backdrop-blur-md border border-[#1F2937] px-4 py-2.5 rounded-lg flex flex-col items-end shadow-xl">
        <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
          ACTIVE STATIONS
        </span>
        <span className="font-mono text-sm font-bold text-emerald-400">
          {formattedCount}
        </span>
      </div>

      {/* Side Intelligence / Detail Drawer */}
      {isIntelligenceOpen && (
        <IntelligencePanel
          station={selectedStation}
          onClose={() => setIsIntelligenceOpen(false)}
        />
      )}

      {/* About & Governance Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}