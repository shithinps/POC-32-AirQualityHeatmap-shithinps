"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Filters = {
  region: any[] | any;
  operator: string;
};

type Props = {
  onCountChange?: (count: number) => void;
  filters?: Filters;
  onStationClick?: (station: any) => void;
};

export default function MapStage({ onCountChange, filters, onStationClick }: Props) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<any>(null);
  const isLoadedRef = useRef(false);

  const shouldMoveRef = useRef(false);
  const isFilterModeRef = useRef(false);
  const blockNextMoveRef = useRef(false);

  const fetchStations = async () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    const zoom = map.getZoom();
    let params: URLSearchParams;

    const isFiltered =
      (Array.isArray(filters?.region) && filters.region.length > 0) ||
      (!!filters?.operator && filters.operator !== "");

    if (isFiltered && shouldMoveRef.current) {
      params = new URLSearchParams({
        min_lat: "-90",
        max_lat: "90",
        min_lng: "-180",
        max_lng: "180",
        zoom: Math.floor(zoom).toString(),
      });
    } else {
      const bounds = map.getBounds();
      if (!bounds) return;

      params = new URLSearchParams({
        min_lat: bounds.getSouth().toString(),
        max_lat: bounds.getNorth().toString(),
        min_lng: bounds.getWest().toString(),
        max_lng: bounds.getEast().toString(),
        zoom: Math.floor(zoom).toString(),
      });
    }

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

    const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const url = `${API}/api/stations/filtered?${params.toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) return;

      const data = await res.json();
      const featuresArray = data?.features || [];

      const geojson: any = {
        type: "FeatureCollection",
        features: featuresArray.map((p: any) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [p.lng, p.lat],
          },
          properties: p,
        })),
      };

      const source = map.getSource("stations") as maplibregl.GeoJSONSource;
      if (source) source.setData(geojson);

      // Always report the current count back to Topbar and Dashboard
      const totalCount = data?.total ?? featuresArray.length ?? 0;
      onCountChange?.(totalCount);

      // Camera Fly-To bounds handling
      if (shouldMoveRef.current && (data.bounds || featuresArray.length > 0)) {
        blockNextMoveRef.current = true;

        if (
          data.bounds &&
          Array.isArray(data.bounds) &&
          data.bounds.length === 4 &&
          (data.bounds[0] !== 0 || data.bounds[2] !== 0)
        ) {
          const [minLng, minLat, maxLng, maxLat] = data.bounds;
          map.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            { padding: 80, duration: 1200, maxZoom: 8 }
          );
        } else if (featuresArray.length > 0) {
          let minLng = Infinity;
          let maxLng = -Infinity;
          let minLat = Infinity;
          let maxLat = -Infinity;

          featuresArray.forEach((p: any) => {
            if (p.lng < minLng) minLng = p.lng;
            if (p.lng > maxLng) maxLng = p.lng;
            if (p.lat < minLat) minLat = p.lat;
            if (p.lat > maxLat) maxLat = p.lat;
          });

          if (minLng === maxLng && minLat === maxLat) {
            map.flyTo({
              center: [minLng, minLat],
              zoom: 6,
              duration: 1200,
            });
          } else {
            map.fitBounds(
              [
                [minLng, minLat],
                [maxLng, maxLat],
              ],
              { padding: 90, duration: 1200, maxZoom: 8 }
            );
          }
        }

        shouldMoveRef.current = false;
        return;
      }
    } catch (err) {
      console.error("Error fetching stations:", err);
    }
  };

  const debouncedFetch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchStations, 300);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [10, 50],
      zoom: 3.5,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      isLoadedRef.current = true;

      map.addSource("stations", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Emerald Green Nodes
      map.addLayer({
        id: "stations-layer",
        type: "circle",
        source: "stations",
        paint: {
          "circle-radius": 3.5,
          "circle-color": "#10b981",
          "circle-opacity": 0.85,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#34d399",
          "circle-stroke-opacity": 0.5,
        },
      });

      map.on("click", "stations-layer", (e) => {
        if (e.features && e.features[0] && onStationClick) {
          onStationClick(e.features[0].properties);
        }
      });

      map.on("mouseenter", "stations-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "stations-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      fetchStations();
    });

    map.on("moveend", () => {
      if (blockNextMoveRef.current) {
        blockNextMoveRef.current = false;
        return;
      }
      if (isFilterModeRef.current) return;
      debouncedFetch();
    });

    map.on("zoomend", () => {
      if (blockNextMoveRef.current) {
        blockNextMoveRef.current = false;
        return;
      }
      if (isFilterModeRef.current) return;
      debouncedFetch();
    });

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (isLoadedRef.current) {
      const isFiltered =
        (Array.isArray(filters?.region) && filters.region.length > 0) ||
        (!!filters?.operator && filters.operator !== "");

      shouldMoveRef.current = true;
      isFilterModeRef.current = isFiltered;

      fetchStations();
    }
  }, [JSON.stringify(filters)]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#020617]"
    />
  );
}