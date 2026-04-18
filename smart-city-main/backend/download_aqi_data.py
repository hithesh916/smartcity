import kagglehub
import shutil
import os

def download_dataset():
    print("Downloading AQI dataset...")
    # Download latest version
    path = kagglehub.dataset_download("rajanbhateja/indian-cities-aqi-2020-2024")
    print("Path to dataset files:", path)
    
    # Move to backend/data/aqi_india
    target_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "aqi_india")
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    for filename in os.listdir(path):
        src = os.path.join(path, filename)
        dst = os.path.join(target_dir, filename)
        if os.path.isfile(src):
            shutil.copy2(src, dst)
            print(f"Copied {filename} to {target_dir}")

if __name__ == "__main__":
    download_dataset()
