import { useState, useEffect } from "react";

import dayjs from "dayjs";

import "./App.css";
import { Header } from "./Header";
import { MainArea } from "./MainArea";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function App() {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const [collapsed, setCollapsed] = useState(false);

  const [datum, setDatum] = useState(dayjs().format("2022-12-05"));

  const [messstationListe, setMessstationListe] = useState([
    "Bahnhofstrasse (Mitte)",
  ]);
  const [messstation, setMessstation] = useState(messstationListe[0]);

  const [personengruppe, setPersonengruppe] = useState("Alle");

  const [zone, setZone] = useState("all");

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

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/Locations?&datum=${datum}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setMessstationListe(data[0].locations);
        }
      });
  }, [datum]);

  useEffect(() => {
    setRtl(rtlListe[messstation]);
    setLtr(ltrListe[messstation]);
  }, [messstation]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Header
        datum={datum}
        messstation={messstation}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <MainArea
        datum={datum}
        messstation={messstation}
        personengruppe={personengruppe}
        rtl={rtl}
        ltr={ltr}
        zone={zone}
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
