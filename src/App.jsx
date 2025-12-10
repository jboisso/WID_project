import { useState, useEffect } from "react";
import "./App.css";
import dayjs from "dayjs";
import { Header } from "./Header";
import { MainArea } from "./MainArea";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { ZoomInOutlined } from "@mui/icons-material";

//dies ist ein Test
//ein weiterer Test

export function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [datum, setDatum] = useState(dayjs().format("2022-12-05"));
  const [messstationListe, setMessstationListe] = useState([
    "Bahnhofstrasse (Mitte)",
  ]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/Locations?&datum=${datum}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setMessstationListe(data[0].locations);
        }
      });
  }, [datum]);

  const rtlListe = {
    "Bahnhofstrasse (Mitte)": "Bürkliplatz",
    "Bahnhofstrasse (Nord)": "Hauptbahnhof",
    "Bahnhofstrasse (Süd)": "Hauptbahnhof",
    Lintheschergasse: "Uraniastrasse",
  };
  const ltrListe = {
    "Bahnhofstrasse (Mitte)": "Hauptbahnhof",
    "Bahnhofstrasse (Nord)": "Bürkliplatz",
    "Bahnhofstrasse (Süd)": "Bürkliplatz",
    Lintheschergasse: "Hauptbahnhof",
  };

  const [rtl, setRtl] = useState(rtlListe[0]);
  const [ltr, setLtr] = useState(ltrListe[0]);
  const [messstation, setMessstation] = useState(messstationListe[0]);
  const [personengruppe, setPersonengruppe] = useState("Alle");
  const [zone, setZone] = useState("all");

  useEffect(() => {
    setRtl(rtlListe[messstation]);
    setLtr(ltrListe[messstation]);
  }, [messstation]);

  //const [totltr, setTotltr] = useState(""); - Weitermachen
  console.log(datum);
  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Header
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        datum={datum}
        messstation={messstation}
      />
      <MainArea
        datum={datum}
        messstation={messstation}
        personengruppe={personengruppe}
        zone={zone}
        rtl={rtl}
        ltr={ltr}
      />
      <Sidebar
        datum={datum}
        setDatum={setDatum}
        messstation={messstation}
        setMessstation={setMessstation}
        messstationListe={messstationListe}
        personengruppe={personengruppe}
        setPersonengruppe={setPersonengruppe}
        zone={zone}
        setZone={setZone}
      />
      <Footer />
    </div>
  );
}
