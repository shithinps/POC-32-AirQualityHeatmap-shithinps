# Functional User Acceptance Testing (UAT) Checklist — Gate 2

- **PoC Number:** 32
- **PoC Title:** Air Quality Heatmap
- **Verification Environment:** Next.js (Localhost:3000) + FastAPI (Localhost:8000)
- **Date:** 2026-11-02

---

## Functional Verification Matrix

| Verification Item | Scope & Test Method | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- |
| **Filters** | Filter by country dropdown | **PASS** | Country selection restricts markers and recalibrates active station counts. |
| **Tooltips / Markers** | Station marker selection | **PASS** | Clicking coordinates triggers `IntelligencePanel` with specific node metadata. |
| **Loading States** | Asynchronous data hydration | **PASS** | Hydration-safe initial state with smooth population from `/api/stats` and `/api/geojson`. |
| **User Interactions** | Map pan, zoom, click, panel dismiss | **PASS** | Smooth pan/zoom with MapLibre GL; close buttons dismiss drawer and modal reliably. |
| **Navigation** | HUD alignment and viewport anchors | **PASS** | Navigation bar pinned cleanly; active station badge dynamically updates. |
| **Responsiveness** | Resolution and boundary testing | **PASS** | Dashboard scales across 1080p desktop and compact displays without clipping. |
| **Edge Cases** | Out-of-bounds clicks, global reset | **PASS** | Selecting "Global Network (All)" resets viewport bounding box. |
| **Error Handling** | API fallback and resilience | **PASS** | Nullish coalescing in telemetry drawer prevents crashes when properties are partially defined. |
| **Data Correctness** | Coordinate alignment and metric values | **PASS** | 1,800 active stations verified across valid latitude/longitude coordinate bounds. |
| **User Workflow** | End-to-end analytical flow | **PASS** | Locate station -> Inspect PM2.5/PM10 -> Review WHO threshold -> Export filtered CSV. |
| **Frontend/Backend Comm**| JSON/GeoJSON payload exchange | **PASS** | Clean HTTP 200 responses from `/api/stats` and `/api/geojson`. |
| **Browser Refresh** | State re-hydration on F5 | **PASS** | Zero Next.js hydration errors or console uncaught promise rejections on hard reload. |
| **Data Export** | Download telemetry as CSV | **PASS** | Export button generates well-formed CSV file reflecting active filters. |

---

## Final Gate Verification

- **Issues Identified:** Initial hydration mismatch on dynamic counters; absence of contextual health thresholds.
- **Issues Resolved:** Server-side synchronization for station count; WHO threshold integration; client CSV export.
- **Known Limitations:** Offline telemetry interpolation is limited to ground station availability.
- **UAT Status:** **UAT PASS**