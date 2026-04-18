
import os
import time
import json
import glob
import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "aqi_india")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "station_coordinates.json")

geolocator = Nominatim(user_agent="smart_city_india_aqi_v1")

def get_unique_stations():
    stations = set()
    csv_files = glob.glob(os.path.join(DATA_DIR, "*.csv"))
    print(f"Found {len(csv_files)} CSV files.")
    
    for file in csv_files:
        try:
            df = pd.read_csv(file)
            if "Location" in df.columns:
                # Add City name to Location to be more specific
                city_name = os.path.basename(file).split("_")[0].title()
                unique_locs = df["Location"].unique()
                for loc in unique_locs:
                    if isinstance(loc, str):
                        # Construct a search query: "Location, City, India"
                        # Clean up location name if needed
                        query = f"{loc}, {city_name}, India"
                        stations.add(query)
        except Exception as e:
            print(f"Error reading {file}: {e}")
            
    return list(stations)

def geocode_stations(station_queries):
    results = {}
    
    # Load existing if available
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r") as f:
            results = json.load(f)
            
    print(f"Geocoding {len(station_queries)} stations...")
    
    for query in station_queries:
        if query in results:
            continue # Skip if already geocoded
            
        try:
            print(f"Geocoding: {query}")
            location = geolocator.geocode(query, timeout=10)
            if location:
                results[query] = {
                    "lat": location.latitude,
                    "lng": location.longitude,
                    "address": location.address
                }
                print(f"  -> Found: {location.latitude}, {location.longitude}")
            else:
                print("  -> Not found. Trying without specific station name...")
                # Fallback: Try just the city (better than nothing for now)
                city_only = query.split(",")[1].strip() + ", India"
                location = geolocator.geocode(city_only, timeout=10)
                if location:
                     results[query] = {
                        "lat": location.latitude,
                        "lng": location.longitude,
                        "fallback": True
                    }
                     print(f"  -> Fallback found: {location.latitude}, {location.longitude}")
                else:
                    print("  -> Completely failed.")
                    results[query] = None
            
            # Respect rate limits
            time.sleep(1.1) 
            
            # Save incrementally
            if len(results) % 5 == 0:
                with open(OUTPUT_FILE, "w") as f:
                    json.dump(results, f, indent=2)
                    
        except GeocoderTimedOut:
            print(f"Timeout for {query}. Skipping...")
        except Exception as e:
            print(f"Error for {query}: {e}")
            
    # Final save
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)
    
    print("Geocoding complete.")

if __name__ == "__main__":
    stations = get_unique_stations()
    print(f"Total Unique Stations: {len(stations)}")
    geocode_stations(stations)
