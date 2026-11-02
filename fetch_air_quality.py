import os
import json
import random

os.makedirs("data", exist_ok=True)

# Key global urban centers (lat, lng, city, country, iso, base_aqi)
CITIES = [
    (28.6139, 77.2090, "New Delhi", "India", "IN", 185),
    (19.0760, 72.8777, "Mumbai", "India", "IN", 120),
    (13.0827, 80.2707, "Chennai", "India", "IN", 85),
    (9.9312, 76.2673, "Kochi", "India", "IN", 65),
    (12.9716, 77.5946, "Bengaluru", "India", "IN", 75),
    (39.9042, 116.4074, "Beijing", "China", "CN", 140),
    (31.2304, 121.4737, "Shanghai", "China", "CN", 110),
    (35.6762, 139.6503, "Tokyo", "Japan", "JP", 35),
    (51.5074, -0.1278, "London", "United Kingdom", "GB", 38),
    (48.8566, 2.3522, "Paris", "France", "FR", 45),
    (40.7128, -74.0060, "New York", "United States", "US", 42),
    (34.0522, -118.2437, "Los Angeles", "United States", "US", 68),
    (52.5200, 13.4050, "Berlin", "Germany", "DE", 30),
    (-23.5505, -46.6333, "São Paulo", "Brazil", "BR", 70),
    (-33.8688, 151.2093, "Sydney", "Australia", "AU", 25),
    (25.2048, 55.2708, "Dubai", "United Arab Emirates", "AE", 95),
    (30.0444, 31.2357, "Cairo", "Egypt", "EG", 155),
    (1.3521, 103.8198, "Singapore", "Singapore", "SG", 35),
    (37.5665, 126.9780, "Seoul", "South Korea", "KR", 78),
    (19.4326, -99.1332, "Mexico City", "Mexico", "MX", 88)
]

def get_category(pm25):
    if pm25 <= 12.0:
        return "Good", "#10b981"
    elif pm25 <= 35.4:
        return "Moderate", "#f59e0b"
    elif pm25 <= 55.4:
        return "Unhealthy for Sensitive Groups", "#f97316"
    elif pm25 <= 150.4:
        return "Unhealthy", "#ef4444"
    elif pm25 <= 250.4:
        return "Very Unhealthy", "#8b5cf6"
    else:
        return "Hazardous", "#7f1d1d"

stations = []
station_id = 1000

for _ in range(1800):
    station_id += 1
    lat_base, lng_base, city, country, iso, base_aqi = random.choice(CITIES)
    lat = round(lat_base + random.gauss(0, 0.35), 5)
    lng = round(lng_base + random.gauss(0, 0.35), 5)
    pm25 = max(5.0, round(random.gauss(base_aqi, 20), 1))
    pm10 = round(pm25 * random.uniform(1.3, 1.8), 1)
    category, color = get_category(pm25)

    stations.append({
        "id": station_id,
        "name": f"{city} Air Monitor #{station_id % 100:02d}",
        "city": city,
        "country": country,
        "country_code": iso,
        "lat": lat,
        "lng": lng,
        "pm25": pm25,
        "pm10": pm10,
        "intensity": pm25,
        "aqi_category": category,
        "status_color": color,
        "population_exposed": int(random.uniform(15000, 350000))
    })

output_path = "data/air_quality_stations.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(stations, f, indent=2)

print(f"Success! Generated {len(stations)} stations to {output_path}")
