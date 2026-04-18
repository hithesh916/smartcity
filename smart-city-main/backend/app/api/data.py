from fastapi import APIRouter, HTTPException
import pandas as pd
import os
import json

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")

def csv_to_geojson(df, lat_col="Latitude", lon_col="Longitude", props=[]):
    features = []
    for _, row in df.iterrows():
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [row[lon_col], row[lat_col]]
            },
            "properties": {col: row[col] for col in props}
        }
        features.append(feature)
    return {"type": "FeatureCollection", "features": features}

@router.get("/air-quality")
def get_air_quality(
    min_lat: float = None, max_lat: float = None, 
    min_lng: float = None, max_lng: float = None
):
    """
    Get Real Air Quality data, optionally filtered by Bounding Box.
    """
    file_path = os.path.join(DATA_DIR, "aqi_delhi.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="AQI Data source not found")
        
    try:
        df = pd.read_csv(file_path)
        
        # Filter by BBox if provided
        if min_lat is not None and max_lat is not None and min_lng is not None and max_lng is not None:
             df = df[
                (df["Latitude"] >= min_lat) & (df["Latitude"] <= max_lat) & 
                (df["Longitude"] >= min_lng) & (df["Longitude"] <= max_lng)
            ]

        # Props to include in GeoJSON
        props = ["StationId", "StationName", "City", "Date", "AQI", "PM2.5", "PM10", "NO2"]
        return csv_to_geojson(df, props=props)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data processing error: {str(e)}")

@router.get("/water-quality")
def get_water_quality(
    min_lat: float = None, max_lat: float = None, 
    min_lng: float = None, max_lng: float = None
):
    """
    Get Real Water Quality data from seeded CSV, filterable by Bbox.
    """
    file_path = os.path.join(DATA_DIR, "water_delhi.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Water Data source not found")
        
    try:
        df = pd.read_csv(file_path)
        
        # Filter by BBox
        if min_lat is not None and max_lat is not None and min_lng is not None and max_lng is not None:
             df = df[
                (df["Latitude"] >= min_lat) & (df["Latitude"] <= max_lat) & 
                (df["Longitude"] >= min_lng) & (df["Longitude"] <= max_lng)
            ]

        # Note CSV has 'p H' or 'pH' check case sensitive
        # Adjusting prop names to match CSV headers exactly
        return csv_to_geojson(df, props=["StationCode", "Location", "State", "WQI", "pH", "DO", "BOD"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data processing error: {str(e)}")
