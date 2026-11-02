"use client";

import React, { useState } from "react";

interface FilterPanelProps {
  filters: {
    country: string;
    operator: string;
    region: string[];
  };
  onChange: (filters: any) => void;
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps): React.JSX.Element {
  const [isExporting, setIsExporting] = useState(false);

  const countries = [
    { code: "", label: "Global Network (All)" },
    { code: "India", label: "India" },
    { code: "Egypt", label: "Egypt" },
    { code: "United States", label: "United States" },
    { code: "China", label: "China" },
    { code: "United Kingdom", label: "United Kingdom" },
    { code: "Germany", label: "Germany" },
  ];

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      country: e.target.value,
    });
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/geojson");
      const data = await res.json();

      let features = data.features || [];
      if (filters.country) {
        features = features.filter(
          (f: any) =>
            f.properties?.country?.toLowerCase() === filters.country.toLowerCase()
        );
      }

      const headers = [
        "Station ID",
        "Station Name",
        "City",
        "Country",
        "Longitude",
        "Latitude",
        "PM2.5 (ug/m3)",
        "PM10 (ug/m3)",
        "AQI Category",
      ];

      const escapeCsv = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = features.map((f: any) => {
        const p = f.properties || {};
        const coords = f.geometry?.coordinates || ["", ""];
        return [
          escapeCsv(p.id ?? p.station_id ?? "N/A"),
          escapeCsv(p.station_name ?? p.name ?? "Unknown Node"),
          escapeCsv(p.city ?? "N/A"),
          escapeCsv(p.country ?? "N/A"),
          coords[0],
          coords[1],
          p.pm25 ?? 0,
          p.pm10 ?? 0,
          escapeCsv(p.aqi_category ?? "Moderate"),
        ].join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `air_quality_telemetry_${
          filters.country ? filters.country.toLowerCase() : "global"
        }.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-[#0B1117]/90 backdrop-blur-md border border-[#1F2937] p-2.5 rounded-xl shadow-xl">
      {/* Country Filter Select */}
      <div className="relative">
        <select
          value={filters.country}
          onChange={handleCountrySelect}
          className="bg-[#161B22] border border-[#30363D] text-gray-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono transition cursor-pointer"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* CSV Export Button */}
      <button
        onClick={handleExportCSV}
        disabled={isExporting}
        className="flex items-center gap-1.5 bg-[#21262D] hover:bg-[#30363D] active:scale-95 text-gray-200 border border-[#30363D] text-xs font-mono px-3 py-1.5 rounded-lg transition disabled:opacity-50"
      >
        <span className="text-emerald-400 font-bold">↓</span>
        {isExporting ? "Exporting..." : "Export CSV"}
      </button>
    </div>
  );
}