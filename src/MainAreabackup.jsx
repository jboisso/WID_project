import { VegaEmbed } from "react-vega";
import chart from "./chart.json";
import data from "./time_loc_data.json";

export const MainArea = ({
  datum,
  messstation,
  personengruppe,
  vergleichsart,
}) => {
  console.log(data);
  return (
    <main>
      <p>Gewähltes datum: {datum}</p>
      <p>Gewählte Messstation: {messstation}</p>
      <p>Gewählte Personengruppe: {personengruppe}</p>
      <p>Gewählte Vergleichsart: {vergleichsart}</p>
      <div className="image_container">
        <VegaEmbed spec={chart} />
      </div>
    </main>
  );
};
