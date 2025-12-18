# Zuri Fussgängermonitoring

### Semesterprojekt 3050 WID

Das Projekt Zuri Fussgängermonitoring stellt die stündlich erfassten Fussgängerzählung an der Bahnhofstrasse sowie an der Lintheschergasse in einer interaktiven Grafik dar. Die Grafik soll die folgende Fragestellung beantworten: <br/>
**Wann sind mehr Personen an der Bahnhofstrasse (Mitte) in Richtung Hauptbahnhof unterwegs, als in Richtung Bürkliplatz**<br/>

In der Grafik kann gezoomt werden, um Bereiche mit verhältnismässig wenigen Personen zu untersuchen. Zudem zeigt das Hovering mit der Maus die exakten Daten hinter der Grafik. Hierbei können Temperatur, gesamte Anzahl Personen und Personendifferenz abgefragt werden.

Über die Filter auf der rechten Seite kann der gesamte Datensatz untersucht werden. Hierbei kann ein beliebiges Datum ausgewählt werden (beschränkt auf Tage mit Daten). Anschliessend werden automatisch die Messstandorte zur Filterung zur Verfügung gestellt, welche auch Daten aufweisen am gewählten Datum.

Die Daten können nach Erwachsene / Kinder gefiltert werden. Die Auswahl der Zone erlaubt es, nur die Daten einzelner Zonen der Messstation darzustellen. Dabei stellen Zone eins und drei jeweils die Trottoirs dar, Zone zwei ist der Fahrbahnbereich. Die Zonenauswahl steht nur für die Messstandorte an der Bahnhofstrasse zur Verfügung. Auch kann nur entweder nach Personengruppe oder nach Zone gefiltert werden, da die Zonendaten nicht nach Personengruppen aufgeteilt sind.

Die Karte bietet eine grobe Übersicht über die Messbereiche. Die exakten Standorte der Messstationen sind nicht bekannt.

## Setup

### Very Quick Start

Unter dem folgenden Link ist das Deployment der Website erreichbar:<br/>
[Zürcher Fussgängermonitoring](https://zuri-fussgaengermonitoring.vercel.app/)

### Quick Start

**Python Environment**

Zur Ausführung des Backends wird ein Python (3.13.9) Environment mit den folgenden Packages benötigt:

- python-dotenv v1.2.1
- pandas v2.3.3
- altair-all v6.0.0
- fastapi[standard] v0.121.1

**.env**

Im Ordner Frontend und im Ordner Backend muss ein .env File erstellt werden, mit den folgenden Inhalten:

> Environment Variablen:<br/> > `VITE_BACKEND_PATH=http://127.0.0.1:8000`<br/> > `VITE_FRONTEND_PATH=http://localhost:5173`

Die URLs müssen die Pfade der lokalen Entwicklungsserver enthalten, jeweils **OHNE** </> am Ende!

**Applikation Starten**

**!! Es müssen die vorhergehenden Schritte erfüllt sein !!**

1. Im Ordner Backend ein Terminal öffnen und das Python Environment von oben aktivieren
2. `fastapi dev main.py` startet das Backend im Developpement Modus
3. Im Ordner Frontend ein Terminal öffnen
4. `npm install` ausführen zum Installieren aller Dependencies
5. `npm run dev` Started das Frontend im Developpement Modus

Nun sollten Frontend und Backend auf Localhost laufen. Die korrekten Ports sind den Terminals zu entnehmen. In der Regel sind diese:

**Frontend**: http://localhost:5173/
**Backend**: http://127.0.0.1:8000

Die Dokumentation der API ist unter http://127.0.0.1:8000/docs erreichbar.

## Code

### Backend

Im Backend wird der Gesamtdatensatz aufbereitet, und mittels FastAPI publiziert.<br/>

> Fastapi-Server im Terminal starten:<br/>`fastapi dev main.py`

Die API kann über folgende Endpunkte abgerufen werden:

**Pedastrians Data:**<br/>
Liefert die Fussgängerdaten Messtation und Tag.<br/>
.../api/v1/pedData`?location_name=&date=&zone=`

<br/>**location_name** = gewünschte Messtation (Zwingend)<br/>
**Verfügbare Parameter**<br/>

- Bahnhofstrasse (Mitte): Bahnhofstrasse%20(Mitte)<br/>
- Bahnhofstrasse (Nord): Bahnhofstrasse%20(Nord)<br/>
- Bahnhofstrasse (Süd): Bahnhofstrasse%20(S%C3%BCd)<br/>
- Lintheschergasse: Lintheschergasse<br/>

<br/>**date** = gewünschtes Datum (Zwingend)<br/>
**Verfügbare Parameter**<br/>

- Daten zwischen 28.09.2022 und 29.07.2025
- Im Format **JJJJ-MM-TT**

<br/>**zone** = gewünschte Zone (Zwingend)<br/>
**Verfügbare Parameter**<br/>

- 1
- 2
- 3
- all

Beispiel einer vollständigen Abfrage:<br/>
https://wid-project-9e38.vercel.app/api/v1/pedData?ort=Bahnhofstrasse%20(S%C3%BCd)&datum=2024-08-17&zone=all

**Locations Data:**<br/>
Liefert alle Messstationen, welche an dem gesuchten Tag verfügbar sind.<br/>
.../api/v1/Locations`?date=`
<br/>**date** = gewünschtes Datum im Format **JJJJ-MM-TT**

Beispiel einer vollständigen Abfrage:<br/>
https://wid-project-9e38.vercel.app/api/v1/Locations?&datum=2022-09-28

Die Grundlagendaten sind im **Gesamtdatensatz.csv** abgelegt.

### Frontend

Das Frontend ist auf Basis einer Vite-React Umgebung aufgebaut.

> Testserver im Terminal starten:<br/>`npm run dev`

Die Grafik ist mit Altair Vega erstellt und mit React-Vega eingebunden. Die Daten in der Grafik werden vom Backend bezogen und interaktiv ersetzt.

**MainArea:** Grafik eingebunden<br/>
**Sidebar:** Filter (MUI-Elemente) und Übersichtskarte (React-Leaflet)<br/>
**Header:** Titelbalken der Website mit der Möglichkeit, das Menu ein- und auszublenden<br/>
**App.jsx:** Zusammenführung aller Teile, Datenabfrage
