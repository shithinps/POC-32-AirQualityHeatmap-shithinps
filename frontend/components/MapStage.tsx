"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Approximate center coordinates for country flying
const COUNTRY_COORDINATES: Record<string, [number, number, number]> = {
  India: [78.9629, 20.5937, 4.5],
  China: [104.1954, 35.8617, 4],
  Japan: [138.2529, 36.2048, 5],
  "United Kingdom": [-3.4359, 55.3781, 5],
  France: [2.2137, 46.2276, 5],
  "United States": [-95.7129, 37.0902, 4],
  Germany: [10.4515, 51.1657, 5],
  Brazil: [-51.9253, -14.2350, 4],
  Australia: [133.7751, -25.2744, 4],
  "United Arab Emirates": [53.8478, 23.4241, 6],
  Egypt: [30.8025, 26.8206, 5],
  Singapore: [103.8198, 1.3521, 10],
  "South Korea": [127.7669, 35.9078, 6],
  Mexico: [-102.5528, 23.6345, 5],
};

interface MapStageProps {
  filters?: { country?: string; search?: string };
  onCountChange?: (count: number) => void;
  onStationSelect?: (station: any) => void;
  onSelectStation?: (station: any) => void;
}

export default function MapStage({
  filters,
  onCountChange,
  onStationSelect,
  onSelectStation,
}: MapStageProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [20, 20],
      zoom: 1.8,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      map.current.addSource("air-quality", {
        type: "geojson",
        data: "http://127.0.0.1:8000/api/geojson",
      });

      // Air Quality Heatmap Layer
      map.current.addLayer({
        id: "air-quality-heat",
        type: "heatmap",
        source: "air-quality",
        maxzoom: 9,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "intensity"],
            0, 0,
            50, 0.5,
            150, 1,
            250, 1.5,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 1,
            9, 3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(0, 255, 128, 0)",
            0.2, "#10b981",
            0.4, "#f59e0b",
            0.6, "#f97316",
            0.8, "#ef4444",
            1.0, "#7f1d1d",
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 4,
            9, 24,
          ],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7, 1,
            9, 0.4,
          ],
        },
      });

      // Individual Station Point Circles
      map.current.addLayer({
        id: "air-quality-point",
        type: "circle",
        source: "air-quality",
        minzoom: 3,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3, 3,
            8, 6,
            12, 10,
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1,
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3, 0.4,
            6, 0.8,
            8, 1,
          ],
        },
      });

      fetch("http://127.0.0.1:8000/api/stats")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.total_stations && onCountChange) {
            onCountChange(data.total_stations);
          }
        })
        .catch(() => {});

      map.current.on("click", "air-quality-point", (e) => {
        if (!e.features || !e.features[0]) return;
        const feature = e.features[0];
        const props = feature.properties as any;
        const coordinates = (feature.geometry as any).coordinates.slice();

        const callback = onStationSelect || onSelectStation;
        if (callback) callback(props);

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div style="color: #111; padding: 4px; font-family: sans-serif;">
              <h3 style="font-weight: bold; margin: 0 0 4px 0;">${props.name}</h3>
              <p style="margin: 2px 0;"><strong>City:</strong> ${props.city}, ${props.country}</p>
              <p style="margin: 2px 0;"><strong>PM2.5:</strong> ${props.pm25} µg/m³</p>
              <p style="margin: 2px 0;"><strong>PM10:</strong> ${props.pm10} µg/m³</p>
              <p style="margin: 2px 0;"><strong>Status:</strong> <span style="color: ${props.color}; font-weight: bold;">${props.category}</span></p>
              <p style="margin: 2px 0;"><strong>Exposed Pop.:</strong> ${Number(props.population).toLocaleString()}</p>
            </div>
          `)
          .addTo(map.current!);
      });

      map.current.on("mouseenter", "air-quality-point", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "air-quality-point", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Fly to country and filter features when country selection changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const country = filters?.country;
    if (country && country !== "All") {
      const target = COUNTRY_COORDINATES[country];
      if (target) {
        map.current.flyTo({
          center: [target[0], target[1]],
          zoom: target[2],
          essential: true,
          speed: 1.2,
        });
      }

      // Filter layer to that country
      map.current.setFilter("air-quality-point", ["==", ["get", "country"], country]);
      map.current.setFilter("air-quality-heat", ["==", ["get", "country"], country]);
    } else {
      // Reset filter and view
      map.current.setFilter("air-quality-point", null);
      map.current.setFilter("air-quality-heat", null);
      map.current.flyTo({ center: [20, 20], zoom: 1.8, essential: true });
    }
  }, [filters?.country]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full min-h-[600px]" />
    </div>
  );
}