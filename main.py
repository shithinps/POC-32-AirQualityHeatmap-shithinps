import json
import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PoC-32: Air Quality Heatmap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join("data", "air_quality_stations.json")

def load_stations():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "PoC-32 Air Quality Heatmap"}

@app.get("/api/stations")
def get_stations(
    category: str = Query(None, description="Filter by AQI category"),
    country: str = Query(None, description="Filter by country")
):
    stations = load_stations()
    if category:
        stations = [s for s in stations if s.get("aqi_category", "").lower() == category.lower()]
    if country:
        stations = [s for s in stations if s.get("country", "").lower() == country.lower()]
    return {"count": len(stations), "data": stations}

@app.get("/api/geojson")
def get_geojson():
    stations = load_stations()
    features = []
    for s in stations:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [s["lng"], s["lat"]]
            },
            "properties": {
                "id": s["id"],
                "name": s["name"],
                "city": s["city"],
                "country": s["country"],
                "pm25": s["pm25"],
                "pm10": s["pm10"],
                "intensity": s["intensity"],
                "category": s["aqi_category"],
                "color": s["status_color"],
                "population": s["population_exposed"]
            }
        })
    return {
        "type": "FeatureCollection",
        "features": features
    }

@app.get("/api/stats")
def get_summary_stats():
    stations = load_stations()
    if not stations:
        return {"total_stations": 0, "avg_pm25": 0, "total_population_exposed": 0}

    total_pm25 = sum(s["pm25"] for s in stations)
    total_pop = sum(s["population_exposed"] for s in stations)

    categories = {}
    for s in stations:
        cat = s["aqi_category"]
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total_stations": len(stations),
        "avg_pm25": round(total_pm25 / len(stations), 2),
        "total_population_exposed": total_pop,
        "category_distribution": categories
    }