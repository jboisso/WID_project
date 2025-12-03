import { useVegaEmbed } from "react-vega";
import { useEffect } from "react";
import React from "react";
import chart from "./chart.json";
import data from "./time_loc_data.json";

export const MainArea = ({
  datum,
  messstation,
  personengruppe,
  vergleichsart,
}) => {
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
      <p>Gewähltes datum: {datum}</p>
      <p>Gewählte Messstation: {messstation}</p>
      <p>Gewählte Personengruppe: {personengruppe}</p>
      <p>Gewählte Vergleichsart: {vergleichsart}</p>
      <div ref={ref} />
    </main>
  );
};
