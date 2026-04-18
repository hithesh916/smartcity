
import kagglehub
import pandas as pd
import os
import shutil

def download_and_inspect():
    print("Downloading Smart Traffic Flow Optimizer dataset...")
    
    # Download first (returns path to cache)
    path = kagglehub.dataset_download("asiryi/smart-traffic-flow-optimizer")
    print(f"Dataset downloaded to: {path}")
    
    # List files
    files = os.listdir(path)
    print("Files found:", files)
    
    # Find the CSV
    csv_file = None
    for f in files:
        if f.endswith(".csv"):
            csv_file = os.path.join(path, f)
            break
            
    if not csv_file:
        print("No CSV file found!")
        return

    print(f"Inspecting {csv_file}...")
    df = pd.read_csv(csv_file)
    
    print("First 5 records:")
    print(df.head())
    print("\nColumns:")
    print(df.columns)
    print("\nInfo:")
    print(df.info())

    # Save to local data folder for persistence
    target_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "traffic")
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    output_path = os.path.join(target_dir, "traffic_flow.csv")
    shutil.copy2(csv_file, output_path)
    print(f"\nSaved locally to {output_path}")

if __name__ == "__main__":
    download_and_inspect()
