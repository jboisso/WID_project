from fastapi import FastAPI

app = FastAPI()

@app.get("/api/v1/pedData")
def get_caps(ort: str, date: str):
    
        return "hallo"