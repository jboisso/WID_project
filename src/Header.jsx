import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const Header = ({ collapsed, setCollapsed }) => {
  return (
    <header className="header">
      <a
        href="https://www.fhnw.ch/de"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="src/assets/fhnw-logo-small.svg" alt="FHNW Logo" />
      </a>
      <Typography variant="h5" color="#f0f0f0">
        Fussgängerzählung Bahnhofstrasse Zürich
      </Typography>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#1c5a9f", color: "#f0f0f0" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "☰ Menü zeigen" : "✕ Menü ausblenden"}
      </Button>
    </header>
  );
};
