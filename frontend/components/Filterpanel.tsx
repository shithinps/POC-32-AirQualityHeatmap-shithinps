"use client";

import { useState, useMemo, useRef, useEffect } from "react";

type FilterState = {
  level?: string;
  region?: string[];
  country?: string;
  operator?: string;
  search?: string;
};

type CountryOption = {
  country_id: number;
  country_name: string;
};

const DEFAULT_COUNTRIES: CountryOption[] = [
  { country_id: 1, country_name: "India" },
  { country_id: 2, country_name: "China" },
  { country_id: 3, country_name: "Japan" },
  { country_id: 4, country_name: "United Kingdom" },
  { country_id: 5, country_name: "France" },
  { country_id: 6, country_name: "United States" },
  { country_id: 7, country_name: "Germany" },
  { country_id: 8, country_name: "Brazil" },
  { country_id: 9, country_name: "Australia" },
  { country_id: 10, country_name: "United Arab Emirates" },
  { country_id: 11, country_name: "Egypt" },
  { country_id: 12, country_name: "Singapore" },
  { country_id: 13, country_name: "South Korea" },
  { country_id: 14, country_name: "Mexico" },
];

type Props = {
  filters?: FilterState;
  onChange?: (filters: FilterState) => void;
  countryOptions?: CountryOption[];
};

export default function FilterPanel({
  filters = { level: "ALL", region: [], operator: "" },
  onChange = () => {},
  countryOptions = [],
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCountries = useMemo(() => {
    return countryOptions.length > 1 ? countryOptions : DEFAULT_COUNTRIES;
  }, [countryOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    return activeCountries.filter((c) =>
      c.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeCountries, searchTerm]);

  const selectedCountryName = useMemo(() => {
    if (!filters.region || filters.region.length === 0) return "Select Country";
    const selected = activeCountries.find(
      (c) => String(c.country_id) === filters.region?.[0] || c.country_name === filters.country
    );
    return selected?.country_name || filters.country || "Select Country";
  }, [filters.region, filters.country, activeCountries]);

  const handleSelectCountry = (country: CountryOption) => {
    const isAlreadySelected = filters.region?.includes(String(country.country_id));
    if (isAlreadySelected) {
      onChange({
        ...filters,
        region: [],
        country: "",
      });
    } else {
      onChange({
        ...filters,
        region: [String(country.country_id)],
        country: country.country_name,
      });
    }
    setIsOpen(false);
  };

  return (
    <div className="bg-[#0B1117]/90 backdrop-blur-md border border-[#1F2937] px-4 py-3 rounded-lg flex gap-3 items-center z-50">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-xs px-3 py-1.5 rounded w-56 text-left flex justify-between items-center transition ${
            filters.region && filters.region.length > 0
              ? "bg-[#030712] border border-[#38BDF8] text-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.4)]"
              : "bg-[#030712] border border-[#1F2937] text-[#E5E7EB]"
          }`}
        >
          <span className="truncate">{selectedCountryName}</span>
          <span className="text-[10px] opacity-50">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="absolute top-11 left-0 w-64 bg-[#0D141C] border border-[#1F2937] rounded shadow-2xl flex flex-col z-50">
            <input
              autoFocus
              placeholder="Search countries..."
              className="p-2.5 text-xs bg-[#161B22] border-b border-[#1F2937] outline-none text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto p-1">
              <div
                onClick={() => {
                  onChange({ ...filters, region: [], country: "" });
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#1F2937] cursor-pointer text-xs text-gray-400 rounded"
              >
                All Countries (Reset)
              </div>
              {filteredCountries.map((c) => {
                const isChecked = filters.region?.includes(String(c.country_id));
                return (
                  <div
                    key={c.country_id}
                    onClick={() => handleSelectCountry(c)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#1F2937] cursor-pointer text-xs text-gray-300 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="accent-[#38BDF8]"
                    />
                    {c.country_name}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <input
        placeholder="Search station or city"
        value={filters.operator || ""}
        onChange={(e) => onChange({ ...filters, operator: e.target.value })}
        className={`text-xs px-3 py-1.5 rounded w-48 transition-all duration-200 ${
          filters.operator
            ? "bg-[#030712] border border-[#38BDF8] text-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.4)]"
            : "bg-[#030712] border border-[#1F2937] text-[#E5E7EB]"
        }`}
      />
    </div>
  );
}