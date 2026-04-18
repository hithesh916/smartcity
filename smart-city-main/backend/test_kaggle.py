import kagglehub
import pandas as pd

try:
    path = kagglehub.dataset_download("ankushnarwade/indian-climate-dataset-20242025")
    print("Dataset path:", path)
    import os
    files = os.listdir(path)
    print("Files:", files)
    
    # Load the first csv found
    for file in files:
        if file.endswith('.csv'):
            df = pd.read_csv(os.path.join(path, file))
            print(f"--- Data from {file} ---")
            print("Columns:", list(df.columns))
            print("Shape:", df.shape)
            print("Head:\n", df.head())
            break
except Exception as e:
    print(f"Error: {e}")
