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

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
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
        features = features.filter((f: any) =>
          f.properties?.country?.toLowerCase() === filters.country.toLowerCase()
        );
      }

      const rows = [
        ["Station ID", "Station Name", "City", "Country", "Longitude", "Latitude", "PM2.5", "PM10", "AQI Category"],
        ...features.map((f: any) => [
          f.properties?.id ?? f.properties?.station_id ?? "N/A",
          `"${(f.properties?.station_name ?? f.properties?.name ?? "Unknown").replace(/"/g, '""')}"`,
          `"${(f.properties?.city ?? "").replace(/"/g, '""')}"`,
          `"${(f.properties?.country ?? "").replace(/"/g, '""')}"`,
          f.geometry?.coordinates?.[0] ?? "",
          f.geometry?.coordinates?.[1] ?? "",
          f.properties?.pm25 ?? "",
          f.properties?.pm10 ?? "",
          `"${f.properties?.aqi_category ?? ""}"`,
        ]),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `air_quality_telemetry_${filters.country ? filters.country.toLowerCase() : "global"}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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