import { VegaEmbed } from "react-vega";
import chart from "./chart.json";

export const MainArea = ({
  datum,
  messstation,
  personengruppe,
  vergleichsart,
}) => {
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
