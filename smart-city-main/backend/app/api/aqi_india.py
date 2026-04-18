
import os
import json
import glob
import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "aqi_india")
COORD_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "station_coordinates.json")

def load_station_coordinates():
    if not os.path.exists(COORD_FILE):
        return {}
    with open(COORD_FILE, "r") as f:
        return json.load(f)

@router.get("/")
def get_india_aqi(
    min_lat: float = None, max_lat: float = None,
    min_lng: float = None, max_lng: float = None
):
    """
    Returns the latest available AQI data for all stations in India.
    """
    coords = load_station_coordinates()
    if not coords:
        # If no coordinates yet, we can't map them.
        # Ideally, we should trigger the geocoding script or return empty.
        # For now, return empty feature collection
        return {
            "type": "FeatureCollection",
            "features": []
        }

    features = []
    
    # 1. Iterate over all city CSVs
    csv_files = glob.glob(os.path.join(DATA_DIR, "*.csv"))
    
    for file in csv_files:
        try:
            city_name = os.path.basename(file).split("_")[0].title()
            df = pd.read_csv(file)
            
            if "Location" not in df.columns:
                continue
                
            # We want the LATEST data for each location.
            # Assuming the CSV is time-series, we take the last row for each unique Location.
            # Or filter by date if needed. Taking last recorded value is a safe bet for "latest known".
            
            # Group by Location and take the last valid entry
            latest_df = df.groupby("Location").last().reset_index()
            
            for _, row in latest_df.iterrows():
                location_name = row["Location"]
                
                # Construct query key to match geocoding script
                query_key = f"{location_name}, {city_name}, India"
                
                lat = None
                lng = None
                
                # Try to find coordinates
                if query_key in coords and coords[query_key]:
                    lat = coords[query_key]["lat"]
                    lng = coords[query_key]["lng"]
                
                if lat is None or lng is None:
                    continue
                    
                # Filter by BBox if provided
                if min_lat is not None:
                     if not (min_lat <= lat <= max_lat and min_lng <= lng <= max_lng):
                         continue

                # Prepare properties
                properties = {
                    "city": city_name,
                    "location": location_name,
                    "timestamp": row.get("Timestamp", "N/A"),
                    "pm25": row.get("PM2.5", None),
                    "pm10": row.get("PM10", None),
                    "no2": row.get("NO2", None),
                    "so2": row.get("SO2", None),
                    "co": row.get("CO", None),
                    "o3": row.get("O3", None),
                    "aqi": row.get("PM2.5", 0) # Simplified AQI proxy using PM2.5 if AQI col missing
                }
                
                # Check for explicit AQI column if exists, otherwise assume PM2.5 is the main driver
                if "AQI" in row:
                     properties["aqi"] = row["AQI"]

                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "properties": properties
                }
                features.append(feature)
                
        except Exception as e:
            print(f"Error processing {file}: {e}")
            continue

    return {
        "type": "FeatureCollection",
        "features": features
    }
