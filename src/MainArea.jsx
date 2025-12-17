import { useVegaEmbed } from "react-vega";
import { useState, useEffect, useRef } from "react";

// Import Chart Specifications
import all_chart from "./assets/chart_all.json";
import adult_chart from "./assets/chart_adult.json";
import child_chart from "./assets/chart_child.json";

//-------------------------------------------------------------------------
const charts = {
  Alle: all_chart,
  Erwachsene: adult_chart,
  Kinder: child_chart,
};
// -----------------------------------------------------------------------
export const MainArea = ({
  datum,
  messstation,
  personengruppe,
  zone,
  rtl,
  ltr,
}) => {
  // Charts und Daten Initialisieren und laden
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_PATH
      }api/v1/pedData?ort=${messstation}&datum=${datum}&zone=${zone}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch failed:", err));
  }, [datum, messstation, zone]);

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Chart auswählen und Daten anhängen
  const spec = charts[personengruppe];
  const ref = useRef(null);
  const embed = useVegaEmbed({
    ref,
    spec,
    options: { mode: "vega-lite" },
  });
  // Grafik aktualisieren bei geänderten Daten
  useEffect(() => {
    embed?.view.data("data", data).runAsync();
  }, [embed, data]);

  //_________________________________________________________________________
  // Darstellung in Main Area
  return (
    <main>
      <div className="grafik">
        <h2 className="titel" id="grafikTitel">
          Herrschte am {new Date(datum).toLocaleDateString("de-CH")}{" "}
          Fussgängerstau in Richtung {ltr}?
        </h2>

        <h3 className="titel" id="grafikUntertitel">
          Summen der stündlichen Fussgängerzählung an der {messstation} in
          Zürich (Schweiz)
        </h3>

        <div ref={ref} />

        <div className="achsbeschriftung">
          <h5>Personen in Richtung {ltr}</h5>
          <h5>Personen in Richtung {rtl}</h5>
        </div>
        <p></p>
      </div>
    </main>
  );
};
