
import os
import pandas as pd
from fastapi import APIRouter
from typing import Optional

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "traffic")
CSV_FILE = os.path.join(DATA_DIR, "traffic_flow.csv")

@router.get("/")
def get_traffic_flow(
    min_lat: float = None, max_lat: float = None,
    min_lng: float = None, max_lng: float = None
):
    """
    Returns the latest traffic flow data as GeoJSON.
    Filters by timestamp to get the most recent snapshot.
    """
    if not os.path.exists(CSV_FILE):
        return {"type": "FeatureCollection", "features": []}

    try:
        # Load data
        df = pd.read_csv(CSV_FILE)
        
        # Ensure timestamp is datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Get latest timestamp
        latest_time = df['timestamp'].max()
        
        # Filter for latest data snapshot
        latest_df = df[df['timestamp'] == latest_time]
        
        features = []
        for _, row in latest_df.iterrows():
            # ORIGINAL DATA IS IN KYIV (50.45, 30.52)
            # TARGET IS CHENNAI (13.0827, 80.2707)
            # OFFSET: Lat -37.37, Lon +49.75
            
            original_lat = row.get("lat")
            original_lng = row.get("lon")
            
            # Apply offset to move to Chennai
            lat = original_lat - 37.3673
            lng = original_lng + 49.7507
            
            # Filter by BBox (using new coordinates)
            if min_lat is not None:
                if not (min_lat <= lat <= max_lat and min_lng <= lng <= max_lng):
                    continue

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "properties": {
                    "intersection_id": row.get("intersection_id"),
                    "congestion": row.get("congestion"),
                    "flow_vpm": row.get("flow_vpm"),
                    "avg_speed": row.get("avg_speed_kmh"),
                    "incidents": row.get("incidents"),
                    "timestamp": str(row.get("timestamp"))
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    except Exception as e:
        print(f"Error serving traffic data: {e}")
        return {"type": "FeatureCollection", "features": []}
