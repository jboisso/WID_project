import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const Header = ({ collapsed, setCollapsed, datum, messstation }) => {
  return (
    <header className="header">
      <a
        href="https://www.fhnw.ch/de"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="src/assets/fhnw-logo-small.svg" alt="FHNW Logo" />
      </a>
      <Typography variant="h5">
        Fussgängerzählung Bahnhofstrasse Zürich
        {/*insgesammt {totltr} Fussgänger nach {ltr} und {totrtl} Fussgänger nach {rtl}*/}
      </Typography>
      <Button variant="contained" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "☰ Menü zeigen" : "✕ Menü ausblenden"}
      </Button>
    </header>
  );
};
