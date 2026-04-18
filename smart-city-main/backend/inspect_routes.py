from app.main import app
import json

print("\n--- ROUTES ---")
for route in app.routes:
    print(route.path)
print("--------------\n")
