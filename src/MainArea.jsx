import { useVegaEmbed } from "react-vega";
import { useState, useEffect } from "react";
import React from "react";
import all_chart from "./chart_all.json";
import adult_chart from "./chart_adult.json";
import child_chart from "./chart_child.json";

//import data from "./time_loc_data.json";

export const MainArea = ({
  datum,
  messstation,
  personengruppe,
  vergleichsart,
  rtl,
  ltr,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8000/api/v1/pedData?ort=${messstation}&datum=${datum}`
    )
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [datum, messstation]);

  // set charts dictionnary
  const charts = {
    Alle: all_chart,
    Erwachsene: adult_chart,
    Kinder: child_chart,
  };

  // set correct spec
  const spec = charts[personengruppe] ?? all_chart;

  const ref = React.useRef(null);
  const embed = useVegaEmbed({
    ref,
    spec,
    options: { mode: "vega-lite" },
  });

  useEffect(() => {
    embed?.view.data("data", data).runAsync();
  }, [embed, data]);

  return (
    <main>
      <div className="grafik">
        <h1 className="titel" id="grafikTitel">
          Herrschte am {new Date(datum).toLocaleDateString("de-CH")}{" "}
          Fussgängerstau in Richtung {ltr}?
        </h1>
        <h3 className="titel" id="grafikuntertitel">
          Summen der stündlichen Fussgängerzählung an der {messstation} in
          Zürich (Schweiz)
        </h3>
        <div ref={ref} />
        <div className="achsbeschriftung">
          <h5>Personen in Richtung {ltr}</h5>
          <h5>Personen in Richtung {rtl}</h5>
        </div>
        <p>
          Davon sind so und so viele Passanten in Zone XY, soviele in YZ und
          noch einige in AB durchgelaufen.
        </p>
      </div>
      <p>Gewähltes datum: {datum}</p>
      <p>Gewählte Messstation: {messstation}</p>
      <p>Gewählte Personengruppe: {personengruppe}</p>
      <p>Gewählte Vergleichsart: {vergleichsart}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
};
