from fastapi import FastAPI
import pandas as pd
import os
import datetime as dt
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Datensatz aufbereiten
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

# import Datensatz
#___________________________________
df_raw = pd.read_csv("backend/Gesamtdatensatz.csv")

# relevante Spalten behalten
#___________________________________
df_copy = df_raw.copy(deep=False)
df_pedData = df_copy[['timestamp', 'location_name',
                    'weather_condition', 'temperature',
                    'pedestrians_count', 'ltr_pedestrians_count',
                    'rtl_pedestrians_count', 'adult_ltr_pedestrians_count',
                    'adult_rtl_pedestrians_count', 'child_rtl_pedestrians_count',
                    'child_ltr_pedestrians_count']]

image_paths = ["src/assets/clear-day.png","src/assets/clear-night.png", "src/assets/cloudy.png", "src/assets/fog.png", "src/assets/partly-cloudy-day.png", "src/assets/partly-cloudy-night.png", "src/assets/rain.png", "src/assets/snow.png"]


# zusätzliche Spalten erzeugen
#___________________________________
df_pedData['weather_icon'] = df_copy['weather_condition'].map({
    os.path.splitext(os.path.basename(p))[0]: p
    for p in image_paths
})
df_pedData['timestamp'] = pd.to_datetime(df_pedData['timestamp'])
print(df_pedData.dtypes)
df_pedData['date'] = df_pedData['timestamp'].dt.date
df_pedData['hour'] = df_pedData['timestamp'].dt.hour
df_pedData['pedestrian_grey'] = df_pedData[['ltr_pedestrians_count', 'rtl_pedestrians_count']].min(axis=1)
df_pedData['pedestrian_diff'] = ((df_pedData['ltr_pedestrians_count'] - df_pedData['rtl_pedestrians_count'])**2)**0.5
df_pedData['max_val'] = (
    df_pedData.groupby(['date'])[['ltr_pedestrians_count', 'rtl_pedestrians_count']]
      .transform('max')      # max per column per date
      .max(axis=1)           # max across the two columns
)+20

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# FastAPI indizieren
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

app = FastAPI()


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# CORS konfigurieren
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

origins = [
    "http://localhost",
    "http://localhost:8080",
    'http://localhost:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['GET'],
    allow_headers=["*"],
    max_age= 5961600

)

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# API erzeugen
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

@app.get("/api/v1/pedData")
def get_caps(ort: str, datum: str):

        # Daten gemäss Querry aufbereiten
        #___________________________________
        datum_dt = pd.to_datetime(datum).date()

        df_pedData_filterd = df_pedData.query('location_name == @ort and date== @datum_dt')
        data_json = df_pedData_filterd.to_dict(orient='records')

        return data_json


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Dummy Abfrage
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

# http://127.0.0.1:8000/api/v1/pedData?ort=Bahnhofstrasse%20(Mitte)&datum=2021-09-30