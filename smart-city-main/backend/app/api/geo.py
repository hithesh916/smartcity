from fastapi import APIRouter, HTTPException, Query
from app.services.osm import search_location, fetch_osm_features

router = APIRouter()

# 1. Search API (Nominatim Proxy)
@router.get("/search")
def search_places(q: str = Query(..., min_length=2)):
    """
    Search for a location using OSM Nominatim.
    Proxies request to avoid CORS on frontend.
    """
    return search_location(q)

# 2. Places API (Map Features)
@router.get("/places")
def get_places(
    type: str = "hospital",
    min_lat: float = None, max_lat: float = None,
    min_lng: float = None, max_lng: float = None
):
    """
    Get places from OSM Overpass API.
    Supports viewport filtering via BBox query params.
    """
    if type not in ["hospital", "police", "fire_station", "park"]:
        raise HTTPException(status_code=400, detail="Invalid place type")
    
    bbox = None
    if min_lat is not None and max_lat is not None and min_lng is not None and max_lng is not None:
        bbox = (min_lat, min_lng, max_lat, max_lng)
        
    # Default to New Delhi if no bbox provided, or pass bbox
    return fetch_osm_features(city_name="New Delhi", feature_type=type, bbox=bbox)

