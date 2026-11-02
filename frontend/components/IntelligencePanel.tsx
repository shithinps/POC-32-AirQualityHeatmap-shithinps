"use client";

import React, { useEffect, useState } from "react";

interface IntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: {
    region?: any[] | any;
    operator?: string;
  };
  metrics: {
    total_stations: number;
    operators: number;
    countries: number;
  };
}

export function IntelligencePanel({
  isOpen,
  onClose,
  filters,
  metrics,
}: IntelligencePanelProps) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  const [topOperators, setTopOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOperators = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters?.region) {
          if (Array.isArray(filters.region)) {
            filters.region.forEach((id) => {
              if (id && id !== "ALL" && id !== "") {
                params.append("country_id", id.toString());
              }
            });
          } else if (filters.region !== "ALL" && filters.region !== "") {
            params.append("country_id", filters.region.toString());
          }
        }

        if (filters?.operator && filters.operator !== "") {
          params.append("operator_id", filters.operator.toString());
        }

        const queryStr = params.toString() ? `?${params.toString()}` : "";
        const res = await fetch(`${API}/api/top-operators${queryStr}`);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTopOperators(data.slice(0, 6));
          }
        }
      } catch (err) {
        console.error("Error fetching filtered operators:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, [isOpen, filters, API]);

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 z-40 h-screen w-80 sm:w-96 border-l border-emerald-500/20 bg-[#060b13]/95 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto text-slate-200 shadow-2xl transition-all">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              SECTION A — RAIL INTELLIGENCE
            </p>
            <h2 className="text-lg font-bold text-white mt-1">
              Global EV Charging Network
            </h2>
            <p className="text-xs text-slate-400">Supply Chain Rail · Data Layer</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Section A: Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-800 bg-[#0b1320] p-3">
            <p className="text-base font-bold text-emerald-400">
              {metrics.total_stations.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase font-mono text-slate-400">Total Stations</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0b1320] p-3">
            <p className="text-base font-bold text-emerald-400">
              {metrics.operators.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase font-mono text-slate-400">Operators</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0b1320] p-3">
            <p className="text-base font-bold text-emerald-400">
              {metrics.countries.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase font-mono text-slate-400">Countries</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0b1320] p-3">
            <p className="text-base font-bold text-emerald-400">99.4%</p>
            <p className="text-[10px] uppercase font-mono text-slate-400">Network Density</p>
          </div>
        </div>

        {/* Section B: Narrative */}
        <div className="space-y-2 border-t border-slate-800/80 pt-4">
          <p className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
            SECTION B — WHY THIS MATTERS
          </p>
          <p className="text-xs leading-relaxed text-slate-300">
            EV charging infrastructure forms the operational backbone of the electric mobility ecosystem. Without sufficient network density, adoption slows regardless of vehicle affordability or policy incentives. High-density regions accelerate usage through convenience and reliability.
          </p>
        </div>

        {/* Section C: Live Dynamic Top Operators */}
        <div className="space-y-3 border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              SECTION C — WHO CONTROLS THE RAIL
            </p>
            {loading && (
              <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
                Updating...
              </span>
            )}
          </div>

          <div className="space-y-2">
            {topOperators.length > 0 ? (
              topOperators.map((op, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/50"
                >
                  <span className="text-slate-300 truncate max-w-[200px]">
                    {op.operator_name || "Independent"}
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {op.count?.toLocaleString() || 0}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between text-xs py-1 text-slate-500">
                <span>No specific operators found</span>
                <span className="font-mono">0</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-4 text-[10px] font-mono tracking-widest text-slate-500 uppercase text-center">
        REAL RAILS · EV INTELLIGENCE
      </div>
    </aside>
  );
}