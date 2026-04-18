
import requests
import json
import os

BASE_URL = "http://localhost:8001"

def test_search():
    print("Testing Search API...")
    try:
        query = "Chennai"
        url = f"{BASE_URL}/api/geocode/search"
        print(f"GET {url}?q={query}")
        resp = requests.get(url, params={"q": query})
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"Success! Found {len(data)} results.")
            if len(data) > 0:
                print(f"First result: {data[0].get('display_name')}")
                return data[0]
            else:
                print("No results found.")
        else:
            print(f"Failed: {resp.status_code} - {resp.text}")
            
    except Exception as e:
        print(f"Exception: {e}")
    return None

def test_probe(lat, lon):
    print("\nTesting Probe API...")
    try:
        url = f"{BASE_URL}/api/probe/analyze"
        print(f"GET {url}?lat={lat}&lng={lon}")
        resp = requests.get(url, params={"lat": lat, "lng": lon})
        
        if resp.status_code == 200:
            data = resp.json()
            print("Success!")
            print(json.dumps(data, indent=2)[:500] + "...")
        else:
            print(f"Failed: {resp.status_code} - {resp.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    result = test_search()
    if result:
        lat = result.get('lat')
        lon = result.get('lon')
        test_probe(lat, lon)
