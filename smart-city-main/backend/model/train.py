
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle

df = pd.read_csv("data/smart_city_data.csv")
X = df.drop(["area","label"],axis=1)
y = LabelEncoder().fit_transform(df["label"])

model = RandomForestClassifier()
model.fit(X,y)
pickle.dump(model, open("model.pkl","wb"))
