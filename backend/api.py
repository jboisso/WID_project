from fastapi import FastAPI
import pandas as pd
import os

#----------------------------------------------------
df = pd.read_csv("Gesamtdatensatz.csv")
# define keeping columns
df_copy = df.copy(deep=False)
df_copy = df_copy[['timestamp', 'location_name',
                    'weather_condition', 'temperature',
                    'pedestrians_count', 'ltr_pedestrians_count',
                    'rtl_pedestrians_count', 'adult_ltr_pedestrians_count',
                    'adult_rtl_pedestrians_count', 'child_rtl_pedestrians_count',
                    'child_ltr_pedestrians_count']]

image_paths = ["src/assets/clear-day.png","src/assets/clear-night.png", "src/assets/cloudy.png", "src/assets/fog.png", "src/assets/partly-cloudy-day.png", "src/assets/partly-cloudy-night.png", "src/assets/rain.png", "src/assets/snow.png"]

# add Columns
df['weather_icon'] = df['weather_condition'].map({
    os.path.splitext(os.path.basename(p))[0]: p
    for p in image_paths
})
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['date'] = df['timestamp'].dt.date
df['hour'] = df['timestamp'].dt.hour
df['pedestrian_grey'] = df[['ltr_pedestrians_count', 'rtl_pedestrians_count']].min(axis=1)
df['pedestrian_diff'] = ((df['ltr_pedestrians_count'] - df['rtl_pedestrians_count'])**2)**0.5
df['max_val'] = (
    df.groupby(['date'])[['ltr_pedestrians_count', 'rtl_pedestrians_count']]
      .transform('max')      # max per column per date
      .max(axis=1)           # max across the two columns
)+20


#----------------------------------------------------
app = FastAPI()

@app.get("/api/v1/pedData")
def get_caps(ort: str, date: str):
    
        return "hallo"