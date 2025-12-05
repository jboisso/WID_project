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

export const Sidebar = ({
  datum,
  setDatum,
  messstation,
  setMessstation,
  messstationListe,
  personengruppe,
  setPersonengruppe,
  vergleichsart,
  setVergleichsart,
}) => {
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
            <FormControl fullWidth>
              <InputLabel id="vergleichsart-select-label">
                Vergleichsart
              </InputLabel>
              <Select
                labelId="vergleichsart-select-label"
                id="vergleichsart-select"
                label="Vergleichsart"
                value={vergleichsart}
                onChange={(event) => setVergleichsart(event.target.value)}
              >
                <MenuItem value={"diff"}>Differenz zeigen</MenuItem>
                <MenuItem value={"tot"}>Total zeigen</MenuItem>
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
            center={[47.374972, 8.540444]}
            zoom={13}
            style={{ height: "20vh", width: "100%" }}
          >
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </MapContainer>
        </AccordionDetails>
      </Accordion>
    </aside>
  );
};
