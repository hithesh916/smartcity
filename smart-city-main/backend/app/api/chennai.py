from fastapi import APIRouter, HTTPException
import pandas as pd
import os
from datetime import datetime

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "chennai")

# Hardcoded Coordinates for Chennai Reservoirs
RESERVOIR_COORDS = {
    "POONDI": [79.86, 13.19],
    "CHOLAVARAM": [80.14, 13.23],
    "REDHILLS": [80.18, 13.16],
    "CHEMBARAMBAKKAM": [80.06, 13.01]
}

@router.get("/reservoirs")
def get_reservoir_levels():
    """
    Get latest available water levels for Chennai Reservoirs.
    Returns GeoJSON.
    """
    file_path = os.path.join(DATA_DIR, "chennai_reservoir_levels.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Chennai Data not found")
        
    try:
        # Read CSV
        df = pd.read_csv(file_path)
        
        # Get latest row
        if df.empty:
            return {"type": "FeatureCollection", "features": []}
            
        latest = df.iloc[-1]
        date = latest["Date"]
        
        features = []
        for name, coords in RESERVOIR_COORDS.items():
            if name in latest:
                level = latest[name]
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": coords # [lon, lat]
                    },
                    "properties": {
                        "name": name,
                        "level_mcft": float(level),
                        "date": date,
                        "type": "reservoir"
                    }
                }
                features.append(feature)
                
        return {"type": "FeatureCollection", "features": features}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")
