import { useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import { Header } from "./Header";
import { MainArea } from "./MainArea";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [datum, setDatum] = useState(dayjs().format("DD.MM.YYYY"));
  const messstationListe = [
    "Bahnhofstrasse",
    "Bundesplatz",
    "Bernerstrasse",
    "Langstrasse",
    "Test",
  ];
  const [messstation, setMessstation] = useState(messstationListe[0]);
  const [personengruppe, setPersonengruppe] = useState("alle");
  const [vergleichsart, setVergleichsart] = useState("tot");
  //const [totltr, setTotltr] = useState(""); - Weitermachen

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Header
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        datum={datum}
        messstation={messstation}
        // totltr={totltr} -weitermachen
        // ltr={ltr} -weitermachen
        // totrtl={totrtl} -weitermachen
        // rtl={rtl} -weitermachen
      />
      <MainArea
        datum={datum}
        messstation={messstation}
        personengruppe={personengruppe}
        vergleichsart={vergleichsart}
      />
      <Sidebar
        datum={datum}
        setDatum={setDatum}
        messstation={messstation}
        setMessstation={setMessstation}
        messstationListe={messstationListe}
        personengruppe={personengruppe}
        setPersonengruppe={setPersonengruppe}
        vergleichsart={vergleichsart}
        setVergleichsart={setVergleichsart}
      />
      <Footer />
    </div>
  );
}
