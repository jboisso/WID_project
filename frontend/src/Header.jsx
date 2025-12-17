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
      <Typography className="titel" variant="h3" color="#000000ff">
        Fussgängermonitor
      </Typography>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#024987", color: "#f0f0f0" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "☰ Menü zeigen" : "✕ Menü ausblenden"}
      </Button>
    </header>
  );
};
