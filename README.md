## Python Packages to install:

For running the Altair-Vega visualisation Jupyter notebook, the following dependencies have to be installed in the python environment:

- python-dotenv
- pandas
- altair
- fastapi[standard]

## .env

Es muss im heruntergeladenen Ordner ein .env File erstellt werden. Dieses muss die folgenden zwei Variablen enthalten:

> Environment Variablen:<br/>
> `VITE_BACKEND_PATH=http://127.0.0.1:8000`<br/>
> `VITE_FRONTEND_PATH=http://localhost:5173`

Es müssen die Pfade der lokalen Entwicklungsserver angegeben werden!

# Fussgängermonitor

## Quick Start

### !! Es müssen die Python-Packages installiert und das .env File erstellt sein für die folgdenden Schritte !!

1. Den entzipten Ordner im Terminal öffnen
2. `npm install` ausführen
3. `npm run dev` zum Starten des Frontend ausführen
4. Im selben Ordner ein weiteres Terminal öffnen und ein Python Environment mit allen benötigten Packages aktivieren
5. `fastapi dev backend/api.py` startet das Backend

### 3. Backend

Im Backend wird der Gesamtdatensatz aufbereitet, und mittels API publiziert.<br/>

> Fastapi-Server im Terminal starten:<br/>`fastapi dev backend/api.py`

Die API kann über folgende Endpunkte abgerufen werdnen:

**Pedastrians Data:**<br/>
Liefert die Fussgängerdaten Messtation und Tag.<br/>
.../api/v1/pedData`?location_name&date`
<br/>**location_name** = gewünschte Messtation
<br/>**date** = gewünschtes Datum

**Locations Data:**<br/>
Liefert alle Messstationen, welche an dem gesuchten Tag verfügbar sind.<br/>
.../api/v1/Locations`?date`
<br/>**date** = gewünschtes Datum

### 4. Frontend

> Testserver im Terminal starten:<br/>`npm run dev`
