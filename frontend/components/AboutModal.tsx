"use client";

import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[340px] rounded-2xl border border-emerald-500/30 bg-[#060b13] p-6 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              SYSTEM METADATA
            </p>
            <h2 className="text-lg font-bold text-white mt-0.5">
              EV Network Command Centre
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-sm pt-0.5"
          >
            ✕
          </button>
        </div>

        {/* Compact Stack of Cards */}
        <div className="mt-5 space-y-2.5">
          <div className="rounded-xl border border-slate-800/80 bg-[#0b1320] px-4 py-2.5">
            <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">
              ARCHITECT
            </p>
            <p className="text-xs font-medium text-slate-200 mt-0.5">
              shithin ps
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-[#0b1320] px-4 py-2.5">
            <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">
              BATCH
            </p>
            <p className="text-xs font-medium text-slate-200 mt-0.5">
              Batch 8 Interns
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-[#0b1320] px-4 py-2.5">
            <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">
              STACK
            </p>
            <p className="text-xs font-medium text-slate-200 mt-0.5">
              Next.js · FastAPI · Tailwind CSS · Map Engine
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-[#0b1320] px-4 py-2.5">
            <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">
              DATA SOURCE
            </p>
            <p className="text-xs font-medium text-slate-200 mt-0.5">
              OpenChargeMap
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] font-mono tracking-widest text-slate-600 uppercase mt-5">
          REAL RAILS · EV INTELLIGENCE PLATFORM
        </p>
      </div>
    </div>
  );
}