from fastapi import FastAPI
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Datensatz aufbereiten
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

df_raw = pd.read_csv("Gesamtdatensatz.csv")     # import Datensatz

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
df_pedData = df_pedData.rename(columns={'temperature': 'Temperatur'}) # Temperatur umbenennen für Chartbeschriftung
df_pedData = df_pedData.fillna(0)

#-----------------------------------------------------------------------------
# zusätzliche Spalten erzeugen
df_pedData['weather_icon'] = '/' + df_pedData['weather_condition'] + '.png'
df_pedData['date'] = pd.to_datetime(df_pedData['timestamp']).dt.date
df_pedData['hour'] = pd.to_datetime(df_pedData['timestamp']).dt.hour

# Grafik alle
df_pedData['pedestrian_same'] = df_pedData[['ltr_pedestrians_count', 'rtl_pedestrians_count']].min(axis=1)
df_pedData['pedestrian_diff'] = abs((df_pedData['ltr_pedestrians_count'] - df_pedData['rtl_pedestrians_count']))
df_pedData['max_val'] = (
    df_pedData.groupby(['date'])[['ltr_pedestrians_count', 'rtl_pedestrians_count']]
      .transform('max')      
      .max(axis=1)           
)+20

# Grafik Kinder
df_pedData['child_pedestrian_same'] = df_pedData[['child_ltr_pedestrians_count', 'child_rtl_pedestrians_count']].min(axis=1)
df_pedData['child_pedestrian_diff'] = abs((df_pedData['child_ltr_pedestrians_count'] - df_pedData['child_rtl_pedestrians_count']))
df_pedData['child_max_val'] = (
    df_pedData.groupby(['date'])[['child_ltr_pedestrians_count', 'child_rtl_pedestrians_count']]
      .transform('max')      
      .max(axis=1)           
)+20

# Grafik Erwachsene
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
load_dotenv()
origins = [
    "http://localhost",
    os.getenv("VITE_BACKEND_PATH"),
    os.getenv("VITE_FRONTEND_PATH")
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


#-----------------------------------------------------------------------------
# Fussgängerdaten Endpoint
@app.get("/api/v1/pedData")
def get_pedData(ort: str, datum: str, zone: str):
    datum_dt = pd.to_datetime(datum).date()
    df_filtered = df_pedData.query('location_name == @ort and date== @datum_dt') # Nach Datum & Ort filtern
   
    if zone != "all":        # Datenaufbereitung Zonen 1-3
        df_filtered['ltr_pedestrians_count'] = df_filtered[f'zone_{zone}_ltr_pedestrians_count']
        df_filtered['rtl_pedestrians_count'] = df_filtered[f'zone_{zone}_rtl_pedestrians_count']
        df_filtered['pedestrian_same'] = df_filtered[['ltr_pedestrians_count', 'rtl_pedestrians_count']].min(axis=1)
        df_filtered['pedestrian_diff'] = abs((df_filtered['ltr_pedestrians_count'] - df_filtered['rtl_pedestrians_count']))

    pedData_json = df_filtered.to_dict(orient='records')
    return pedData_json

#-----------------------------------------------------------------------------
# Locations Endpoint (welche sind wann verfügbar)
@app.get("/api/v1/Locations")
def get_location(datum: str):
    datum_dt = pd.to_datetime(datum).date()
    df_location = df_pedData.query('date == @datum_dt') # nach Datum filtern
    df_location = df_location[df_location["collection_type"] == "measured"] # Einträge ohne Messwerte entfernen
    df_location = df_location.drop_duplicates(subset=["date", "location_name"]) # Duplikate entfernen

    # Orte nach Datum gruppieren
    df_location = (
        df_location
        .groupby("date")["location_name"]
        .apply(list)
        .reset_index(name="locations")
    )
    location_json = df_location.to_dict(orient="records")
    return location_json

