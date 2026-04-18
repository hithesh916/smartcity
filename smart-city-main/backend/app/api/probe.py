from fastapi import APIRouter, Query
import random
import math
import datetime
from app.api.data import csv_to_geojson # Reuse utils if needed
from app.services.osm import fetch_osm_features
import pandas as pd
import os

router = APIRouter()

# --- Helpers ---
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2) * math.sin(dLat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def generate_static_score(lat, lng, seed_offset=0):
    """Generates a consistent score (0-100) based on location."""
    # Simple hash based on coordinates to keep it deterministic for the same spot
    val = (lat * 1000 + lng * 1000 + seed_offset) % 100
    return abs(val)

# --- Endpoints ---

@router.get("/analyze")
def analyze_location(lat: float, lng: float, days: int = 7):
    """
    Returns comprehensive intelligence for a specific point.
    Aggregates Traffic, Environment, Safety, and Civic Data.
    days: Number of days for trend analysis (1 = 24 hours, others = N days)
    """
    
    # 1. Traffic Data (Real - from CSV)
    # We load the CSV and find the nearest point
    traffic_data = {"congestion": 0, "speed": 0, "status": "Unknown"}
    congestion = 0
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        traffic_file = os.path.join(base_dir, "data", "traffic", "traffic_flow.csv")
        
        if os.path.exists(traffic_file):
            df = pd.read_csv(traffic_file)
            # Offset Logic (Same as traffic.py to match visual)
            # Simplified for Demo Speed: Hash-pick a row to "simulate" reading
            row_idx = int((lat * 100 + lng * 100) % len(df))
            row = df.iloc[row_idx]
            
            traffic_data = {
                "congestion": float(row.get("congestion", 0)),
                "speed": float(row.get("avg_speed_kmh", 0)),
                "status": "High Traffic" if row.get("congestion", 0) > 40 else "Moderate"
            }
            congestion = float(row.get("congestion", 0))
    except Exception as e:
        print(f"Traffic lookup error: {e}")

    # 2. Simulated/calculated Metrics
    # Crime Rate (Inverse to Safety?)
    crime_index = generate_static_score(lat, lng, seed_offset=123)
    safety_score = 100 - crime_index + (random.randint(-5, 5)) # slight jitter
    
    # Air Quality (Simulated per region)
    aqi = generate_static_score(lat, lng, seed_offset=55) * 2 + 50 # Range 50-250
    
    # Water Quality
    wqi = generate_static_score(lat, lng, seed_offset=99)
    
    # 3. Nearby Amenities (Mocked or Real)
    # Let's mock counts based on "Safety Score" (Safer areas have more amenities usually)
    hospitals = int(safety_score / 20)
    parks = int(safety_score / 15)
    malls = int(crime_index / 30)

    weather_types = ["Sunny", "Cloudy", "Rainy", "Haze"]
    weather = weather_types[int(crime_index) % 4]

    # Noise Level (Simulated based on traffic)
    noise_level = int(traffic_data["congestion"] * 0.8 + random.randint(30, 50))
    noise_idx = min(100, noise_level)
    
    # 4. Reverse Geocoding (Get Street Name)
    address = "Unknown Location"
    try:
        import requests
        headers = {'User-Agent': 'SmartCityProbe/1.0'}
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}&format=json"
        
        # Real-time fetch (Timeout 1.5s to stay snappy)
        r = requests.get(url, headers=headers, timeout=1.5)
        if r.status_code == 200:
            addr_data = r.json()
            address = addr_data.get('display_name', 'Unknown Area')
            # simplify address
            address = ", ".join(address.split(",")[:3])
    except:
        address = f"Coord: {lat:.4f}, {lng:.4f}"

    # 6. Historical Trend Generation (Simulated Data)
    heatmap_aqi = []
    heatmap_traffic = []
    heatmap_humidity = []
    heatmap_water = []
    heatmap_crime = []
    
    labels = []
    
    is_hourly = (days == 1)
    num_points = 24 if is_hourly else days
    
    # Base Values
    base_aqi = int(aqi)
    base_traffic = int(traffic_data.get("congestion", 0))
    base_crime_rate = crime_index 
    base_wqi = int(wqi)
    
    # Generate Time Labels
    if is_hourly:
        # Generate 00:00 to 23:00
        for h in range(24):
            labels.append(f"{h:02d}:00")
    else:
        # Generate last N days
        weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        today = datetime.datetime.now()
        for d in range(num_points):
            date = today - datetime.timedelta(days=num_points-1-d)
            if num_points <= 7:
                 labels.append(weekdays[date.weekday()])
            elif num_points <= 30:
                 labels.append(date.strftime("%d %b"))
            else:
                 labels.append(date.strftime("%b")) 
                 
    if days == 365:
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        num_points = 12

    for i in range(num_points):
        # Seed Variance
        seed = int(lat * 1000 + lng * 1000 + i)
        
        # Day Factor
        factor = 1.0
        if not is_hourly and days < 30 and (i % 7) > 4: 
             factor = 0.8
        
        if is_hourly:
            if 8 <= i <= 10 or 17 <= i <= 19:
                factor = 1.4
            elif 0 <= i <= 5:
                factor = 0.2
        
        noise = (seed % 20) - 10
        
        sim_aqi = max(20, min(300, int(base_aqi * factor + noise)))
        sim_traffic = max(0, min(100, int(base_traffic * factor + noise)))
        
        h_noise = (seed % 10) - 5
        sim_humidity = max(40, min(95, 60 + h_noise + (10 if not is_hourly else 0)))
        
        sim_water = max(0, min(100, base_wqi + ((seed%5)-2)))
        
        c_factor = 1.0
        if is_hourly:
            if 22 <= i or i <= 4: c_factor = 1.5 
        else:
            if (i % 7) > 4: c_factor = 1.2 
            
        sim_crime = max(0, min(10, (base_crime_rate/10.0) * c_factor))
        
        heatmap_aqi.append(sim_aqi)
        heatmap_traffic.append(sim_traffic)
        heatmap_humidity.append(int(sim_humidity))
        heatmap_water.append(int(sim_water))
        heatmap_crime.append(round(sim_crime, 1))

    trends = {
        "days": labels,
        "aqi": heatmap_aqi,
        "traffic": heatmap_traffic,
        "humidity": heatmap_humidity,
        "water": heatmap_water,
        "crime": heatmap_crime
    }

    # 7. Regional Comparison
    regional = []
    district_names = ["Downtown", "Westside", "North Hills", "Industrial"]
    
    for idx, d_name in enumerate(district_names):
        if d_name == "Industrial":
            r_aqi = base_aqi + 40
            r_safe = max(10, safety_score - 20)
        elif d_name == "North Hills":
            r_aqi = max(20, base_aqi - 30)
            r_safe = min(100, safety_score + 10)
        else:
            var_aqi = generate_static_score(lat, lng, seed_offset=300+idx) % 40 - 20
            r_aqi = max(20, base_aqi + var_aqi)
            r_safe = safety_score 
            
        regional.append({
            "name": d_name,
            "aqi": int(r_aqi),
            "safety": "Safe" if r_safe > 70 else ("Good" if r_safe > 50 else "Risk")
        })

    # 8. Generate Verdict
    pros = []
    cons = []

    if safety_score > 80:
        pros.append("High Safety Rating")
    elif safety_score < 50:
        cons.append("Safety Concerns Detected")

    if aqi < 50:
        pros.append("Excellent Air Quality")
    elif aqi > 150:
        cons.append("Poor Air Quality")
    elif aqi > 100:
        cons.append("Moderate Pollution")

    if wqi > 80:
        pros.append("Clean Water Supply")

    if noise_idx > 70:
        cons.append("High Noise Levels")

    if traffic_data.get("congestion", 0) > 60:
        cons.append("Heavy Traffic Congestion")
    elif traffic_data.get("congestion", 0) < 30:
        pros.append("Low Traffic Zone")

    if hospitals > 1:
        pros.append("Good Medical Access")
    if parks > 1:
        pros.append("Green Spaces Nearby")
    if malls > 1:
        pros.append("Shopping Options Available")

    if not pros:
        pros.append("Developing Area")
    if not cons:
        cons.append("No Major Issues")

    verdict = {
        "pros": pros,
        "cons": cons
    }

    return {
        "location": {"lat": lat, "lng": lng, "address": address},
        "verdict": verdict,
        "traffic": traffic_data,
        "environment": {
            "aqi": {"value": int(aqi), "status": "Poor" if aqi > 150 else "Good"},
            "water": {"value": int(wqi), "status": "Potable" if wqi > 80 else "Needs Treatment"},
            "weather": {"condition": weather, "temp": f"{28 + (int(wqi)%5)}°C"},
            "noise": {"value": f"{noise_idx} dB", "status": "High" if noise_idx > 70 else "Moderate"}
        },
        "safety": {
            "score": int(safety_score),
            "crime_rate": f"{crime_index:.1f}/100",
            "rating": "Safe" if safety_score > 70 else "Caution",
            "reviews": int(safety_score * 12)
        },
        "nearby": {
            "hospitals": hospitals + 1,
            "parks": parks + 1,
            "malls": malls,
            "parking_score": int(100 - congestion),
            "transport_score": int(traffic_data["speed"] + 40)
        },
        "analytics": trends,
        "regional": regional
    }
