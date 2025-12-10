from fastapi import FastAPI
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Datensatz aufbereiten
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

df_raw = pd.read_csv("backend/Gesamtdatensatz.csv")     # import Datensatz

#----------------------------------------------------------------------------
# relevante Spalten behalten
df_copy = df_raw.copy(deep=False)
df_pedData = df_copy[[
    'timestamp', 'location_name',
    'weather_condition', 'temperature',
    'pedestrians_count', 'ltr_pedestrians_count',
    'rtl_pedestrians_count', 'adult_ltr_pedestrians_count',
    'adult_rtl_pedestrians_count', 'child_rtl_pedestrians_count',
    'child_ltr_pedestrians_count', 'rtl_label',
    'ltr_label', 'collection_type',
    'zone_1_ltr_pedestrians_count', 'zone_1_rtl_pedestrians_count',
    'zone_2_ltr_pedestrians_count', 'zone_2_rtl_pedestrians_count',
    'zone_3_ltr_pedestrians_count', 'zone_3_rtl_pedestrians_count',
]]
df_pedData = df_pedData.rename(columns={'temperature': 'Temperatur'}) # Temperatur umbenennen für Chartbeschriftun

#-----------------------------------------------------------------------------
# zusätzliche Spalten erzeugen
df_pedData['weather_icon'] = 'src/assets/' + df_pedData['weather_condition'] + '.png'
df_pedData['date'] = pd.to_datetime(df_pedData['timestamp']).dt.date
df_pedData['hour'] = pd.to_datetime(df_pedData['timestamp']).dt.hour

# All Chart
df_pedData['pedestrian_same'] = df_pedData[['ltr_pedestrians_count', 'rtl_pedestrians_count']].min(axis=1)
df_pedData['pedestrian_diff'] = abs((df_pedData['ltr_pedestrians_count'] - df_pedData['rtl_pedestrians_count']))
df_pedData['max_val'] = (
    df_pedData.groupby(['date'])[['ltr_pedestrians_count', 'rtl_pedestrians_count']]
      .transform('max')      
      .max(axis=1)           
)+20

# Child Chart
df_pedData['child_pedestrian_same'] = df_pedData[['child_ltr_pedestrians_count', 'child_rtl_pedestrians_count']].min(axis=1)
df_pedData['child_pedestrian_diff'] = abs((df_pedData['child_ltr_pedestrians_count'] - df_pedData['child_rtl_pedestrians_count']))
df_pedData['child_max_val'] = (
    df_pedData.groupby(['date'])[['child_ltr_pedestrians_count', 'child_rtl_pedestrians_count']]
      .transform('max')      
      .max(axis=1)           
)+20

# Adult Chart
df_pedData['adult_pedestrian_same'] = df_pedData[['adult_ltr_pedestrians_count', 'adult_rtl_pedestrians_count']].min(axis=1)
df_pedData['adult_pedestrian_diff'] = abs((df_pedData['adult_ltr_pedestrians_count'] - df_pedData['adult_rtl_pedestrians_count']))
df_pedData['adult_max_val'] = (
    df_pedData.groupby(['date'])[['adult_ltr_pedestrians_count', 'adult_rtl_pedestrians_count']]
      .transform('max')     
      .max(axis=1)          
)+20




# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# FastAPI
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

app = FastAPI()


# ---------------------------------------------------------------------------
# CORS konfigurieren
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
# API Endpoints 
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

# Chart Endpoint
@app.get("/api/v1/pedData")
def get_pedData(ort: str, datum: str, zone: str):
    datum_dt = pd.to_datetime(datum).date()

    df_pedData_filtered = df_pedData.query('location_name == @ort and date== @datum_dt')
    if zone != "all":
        print(zone)
        df_pedData_filtered['ltr_pedestrians_count'] = df_pedData_filtered[f'zone_{zone}_ltr_pedestrians_count']
        df_pedData_filtered['rtl_pedestrians_count'] = df_pedData_filtered[f'zone_{zone}_rtl_pedestrians_count']
        df_pedData_filtered['pedestrian_same'] = df_pedData_filtered[['ltr_pedestrians_count', 'rtl_pedestrians_count']].min(axis=1)
        df_pedData_filtered['pedestrian_diff'] = ((df_pedData_filtered['ltr_pedestrians_count'] - df_pedData_filtered['rtl_pedestrians_count'])**2)**0.5
        df_pedData_filtered['max_val'] = (
        df_pedData.groupby(['date'])[[f'ltr_pedestrians_count', f'rtl_pedestrians_count']]
            .transform('max')      # max per column per date
            .max(axis=1)           # max across the two columns
            )+20
        data_json = df_pedData_filtered.to_dict(orient='records')
    else:
        data_json = df_pedData_filtered.to_dict(orient='records')

    return data_json

@app.get("/api/v1/Locations")
def get_location(datum: str):

    datum_dt = pd.to_datetime(datum).date()
    df_pedData_filtered = df_pedData.query('date == @datum_dt')
    df_pedData_filtered = df_pedData_filtered[df_pedData_filtered["collection_type"] == "measured"]
    df_pedData_filtered = df_pedData_filtered.drop_duplicates(subset=["date", "location_name"])


    df_grouped = (
        df_pedData_filtered
        .groupby("date")["location_name"]
        .apply(list)
        .reset_index(name="locations")
    )
    data_json = df_grouped.to_dict(orient="records")
    return data_json



# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Dummy Abfrage / Ausführung
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

# http://127.0.0.1:8000/api/v1/pedData?ort=Bahnhofstrasse%20(Mitte)&datum=2021-09-30

# fastapi dev backend/api.py