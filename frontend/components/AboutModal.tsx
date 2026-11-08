"use client";

import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl p-6 text-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#21262d]">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              Air Quality Heatmap
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2.5 py-1 rounded border border-[#30363d] hover:bg-[#21262d] transition text-xs font-mono"
          >
            ESC / CLOSE
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5 text-xs text-gray-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <h3 className="text-emerald-400 font-mono uppercase tracking-wider text-[11px] mb-1">
              01. Purpose & Health Impact
            </h3>
            <p>
              Fine particulate matter (PM2.5 and PM10) penetrates deep into lung tissue and enters the bloodstream. Sustained exposure exceeding WHO guidelines poses critical cardiovascular and respiratory hazards. This platform translates raw telemetry into actionable geographic intelligence to identify high-risk exposure zones in real time.
            </p>
          </div>

          <div>
            <h3 className="text-emerald-400 font-mono uppercase tracking-wider text-[11px] mb-1">
              02. Network Architecture & Governance
            </h3>
            <p>
              Telemetry across 1,800 active monitoring nodes is ingested from validated global environmental aggregators, national environmental protection agencies, and open-sensor networks. Telemetry is geocoded and served via a FastAPI backend feeding a MapLibre geospatial frontend.
            </p>
          </div>

          <div>
            <h3 className="text-emerald-400 font-mono uppercase tracking-wider text-[11px] mb-2">
              03. AQI Classification & Operational Decision Protocol
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="p-2.5 rounded bg-[#161b22] border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block">0 - 50 AQI (Good)</span>
                Air quality is satisfactory. No restrictions on outdoor activity.
              </div>
              <div className="p-2.5 rounded bg-[#161b22] border border-yellow-500/30">
                <span className="text-yellow-400 font-bold block">51 - 100 AQI (Moderate)</span>
                Acceptable quality; sensitive individuals should monitor prolonged exposure.
              </div>
              <div className="p-2.5 rounded bg-[#161b22] border border-orange-500/30">
                <span className="text-orange-400 font-bold block">101 - 200 AQI (Unhealthy)</span>
                Public health advisory. Sensitive cohorts require indoor air filtration.
              </div>
              <div className="p-2.5 rounded bg-[#161b22] border border-red-500/30">
                <span className="text-red-400 font-bold block">200+ AQI (Hazardous)</span>
                Emergency condition. Direct industrial alert triggers and school advisories.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-[#21262d] flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>Real Rails Batch 8 — Engineering PoC 32</span>
          <span>FastAPI + Next.js + MapLibre GL</span>
        </div>
      </div>
    </div>
  );
}
