import { useEffect } from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import "dayjs/locale/de"; // <--- wichtig
dayjs.locale("de"); // <--- aktiviert deutsche Darstellung (Tag.Monat.Jahr)

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
  CircleMarker,
} from "react-leaflet";

import messflaeche from "./assets/hystreet_locations.json";
import plaetze from "./assets/plaetze.json";
import plaetze_linth from "./assets/plaetze_linth.json";

export const Sidebar = ({
  datum,
  setDatum,
  messstation,
  setMessstation,
  messstationListe,
  personengruppe,
  setPersonengruppe,
  zone,
  setZone,
}) => {
  useEffect(() => {
    if (personengruppe !== "alle") {
      setZone("all"); // default value when disabled
    }
  }, [personengruppe]);

  return (
    <aside>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Ort/Datum</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Messstation-Auswahl */}
          <Box sx={{ minWidth: 120, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="messstation-select-label">
                Messstation auswählen
              </InputLabel>
              <Select
                labelId="messstation-select-label"
                id="messstation-select"
                value={messstation}
                label="Messstation auswählen"
                onChange={(event) => setMessstation(event.target.value)}
              >
                {messstationListe.map((station, index) => (
                  <MenuItem key={index} value={station}>
                    {station}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* MUI DatePicker */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <DatePicker
              label="Datum auswählen"
              value={datum ? dayjs(datum) : null} // datum im State: YYYY-MM-DD
              onChange={(newValue) => {
                // speichert das Datum im Format YYYY-MM-DD
                setDatum(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
              }}
              format="DD.MM.YYYY" // Anzeigeformat
              minDate={dayjs("2022-09-28")}
              maxDate={dayjs("2025-07-29")}
            />
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Filter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ minWidth: 120, mt: 2 }}>
            <FormControl fullWidth disabled={personengruppe !== "Alle"}>
              <InputLabel id="zone-select-label">Zone</InputLabel>
              <Select
                labelId="zone-select-label"
                id="zone-select"
                label="Zone"
                value={zone}
                onChange={(event) => setZone(event.target.value)}
              >
                <MenuItem value={"all"}>Ganzer Bereich</MenuItem>
                <MenuItem value={"1"}>Zone 1</MenuItem>
                <MenuItem value={"2"}>Zone 2</MenuItem>
                <MenuItem value={"3"}>Zone 3</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Filter-Auswahl */}
          <Box sx={{ minWidth: 120, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="personengruppe-select-label">
                Personengruppe
              </InputLabel>
              <Select
                labelId="personengruppe-select-label"
                id="personengruppe-select"
                label="Personengruppe"
                value={personengruppe}
                onChange={(event) => setPersonengruppe(event.target.value)}
              >
                <MenuItem value={"Alle"}>Alle</MenuItem>
                <MenuItem value={"Kinder"}>Kinder</MenuItem>
                <MenuItem value={"Erwachsene"}>Erwachsene</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Karte</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MapContainer
            key={messstation} //Aktualisiert Karte, wenn sich Variable ändert
            center={[47.37252199854119, 8.539605834531509]}
            zoom={14}
            style={{ height: "35vh", width: "100%" }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
          >
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <GeoJSON
              data={messflaeche}
              filter={(feature) => feature.properties.name === messstation}
              style={{
                color: "red",
                weight: 2,
                fillColor: "red",
                fillOpacity: 0.3,
              }}
            />
            <GeoJSON
              data={
                messstation === "Lintheschergasse" ? plaetze_linth : plaetze
              }
              pointToLayer={(feature, latlng) =>
                L.circleMarker(latlng, {
                  radius: 0,
                  fillOpacity: 0,
                  opacity: 0,
                }).bindTooltip(feature.properties.name, {
                  permanent: true,
                  className: "place-label",
                })
              }
            />
          </MapContainer>
        </AccordionDetails>
      </Accordion>
    </aside>
  );
};
