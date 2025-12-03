import { useVegaEmbed } from "react-vega";
import { useState, useEffect } from "react";
import React from "react";
import chart from "./chart.json";
//import data from "./time_loc_data.json";

export const MainArea = ({
  datum,
  messstation,
  personengruppe,
  vergleichsart,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8000/api/v1/pedData?ort=${messstation}&datum=${datum}`
    )
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [datum, messstation]);

  const ref = React.useRef(null);
  const embed = useVegaEmbed({
    ref,
    spec: chart,
    options: { mode: "vega-lite" },
  });

  embed?.view.data("data", data).runAsync();

  useEffect(() => {
    embed?.view.data("data", data).runAsync();
  }, [embed, data]);

  return (
    <main>
      <div ref={ref} />
      <p>Gewähltes datum: {datum}</p>
      <p>Gewählte Messstation: {messstation}</p>
      <p>Gewählte Personengruppe: {personengruppe}</p>
      <p>Gewählte Vergleichsart: {vergleichsart}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
};
