import requests
import sys
import time

BASE_URL = "http://localhost:8000/api"

def test_endpoint(name, url):
    print(f"Testing {name} ({url})...")
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            print(f"[PASS] {name}: {len(resp.content)} bytes")
            return True
        else:
            print(f"[FAIL] {name}: Status {resp.status_code}")
            print(resp.text[:200])
            return False
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        return False

def main():
    # Wait for server to be ready
    print("Waiting for server...")
    time.sleep(3) 
    
    # Test Root
    # Test Search (Nominatim Proxy)
    search_ok = test_endpoint("Geo Search", f"{BASE_URL}/geocode/search?q=Delhi")
    
    # Test Air Quality (CSV)
    aqi_ok = test_endpoint("Air Data", f"{BASE_URL}/data/air-quality")
    
    # Test Water Quality (CSV)
    water_ok = test_endpoint("Water Data", f"{BASE_URL}/data/water-quality")

    if search_ok and aqi_ok and water_ok:
        print("\nAll Systems Go!")
        sys.exit(0)
    else:
        print("\nSome tests failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
