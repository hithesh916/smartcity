import requests
from fastapi import HTTPException
import logging

logger = logging.getLogger("uvicorn")

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

def search_location(query: str):
    """
    Search location using Nominatim API.
    """
    params = {
        "q": query,
        "format": "json",
        "limit": 5,
        "addressdetails": 1,
        "countrycodes": "in" # Limit to India
    }
    headers = {
        "User-Agent": "SmartCityDashboard/Backend-1.0"
    }
    try:
        resp = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Nominatim Error: {e}")
        raise HTTPException(status_code=502, detail="Geocoding service unavailable")

def fetch_osm_features(
    city_name: str = "New Delhi", 
    feature_type: str = "hospital",
    bbox: tuple = None # (min_lat, min_lng, max_lat, max_lng)
):
    """
    Fetch features using Overpass API and convert to GeoJSON.
    Supports City Name OR Bounding Box.
    """
    # Map feature types to OSM tags
    tags = {
        "hospital": '"amenity"="hospital"',
        "police": '"amenity"="police"',
        "fire_station": '"amenity"="fire_station"',
        "park": '"leisure"="park"'
    }
    
    tag_query = tags.get(feature_type, '"amenity"="hospital"')
    
    # Construct Query
    if bbox:
        # Overpass bbox format: (south, west, north, east) -> (min_lat, min_lng, max_lat, max_lng)
        bbox_str = f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}"
        query = f"""
        [out:json][timeout:25];
        (
          node[{tag_query}]({bbox_str});
          way[{tag_query}]({bbox_str});
          relation[{tag_query}]({bbox_str});
        );
        out center;
        """
    else:
        # Fallback to City Name
        query = f"""
        [out:json][timeout:25];
        area[name="{city_name}"]->.searchArea;
        (
          node[{tag_query}](area.searchArea);
          way[{tag_query}](area.searchArea);
          relation[{tag_query}](area.searchArea);
        );
        out center;
        """
    
    try:
        resp = requests.post(OVERPASS_URL, data={"data": query}, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        
        # Convert to GeoJSON
        features = []
        for element in data.get("elements", []):
            lat = element.get("lat") or element.get("center", {}).get("lat")
            lon = element.get("lon") or element.get("center", {}).get("lon")
            
            if lat and lon:
                feat = {
                    "type": "Feature",
                    "properties": {
                        "id": element.get("id"),
                        "name": element.get("tags", {}).get("name", "Unknown"),
                        "type": feature_type,
                        "details": element.get("tags", {})
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lon, lat]
                    }
                }
                features.append(feat)
                
        return {
            "type": "FeatureCollection",
            "features": features
        }

    except Exception as e:
        logger.error(f"Overpass Error: {e}")
        # Return empty collection on error to not break frontend
        return {"type": "FeatureCollection", "features": []}
