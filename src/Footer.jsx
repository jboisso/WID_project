import { Typography, Link, Container, Stack } from "@mui/material";

export const Footer = () => {
  return (
    <footer>
      <Container maxWidth="md">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2" color="#48a8e8ff" align="center">
            © 2025 — Entwickelt von{" "}
            <Link
              href="https://github.com/jboisso"
              target="_blank"
              rel="noopener"
              underline="hover"
              color="#c07b27"
            >
              Jonathan Boissonas
            </Link>{" "}
            und{" "}
            <Link
              href="https://github.com/asterixgis"
              target="_blank"
              rel="noopener"
              underline="hover"
              color="#c07b27"
            >
              Tobias Schulthess
            </Link>{" "}
            im Modul 3050 WID - Daten: ©{" "}
            <Link
              href="https://data.stadt-zuerich.ch/dataset/hystreet_fussgaengerfrequenzen"
              target="_blank"
              rel="noopener"
              underline="hover"
              color="#c07b27"
            >
              Stadt Zürich
            </Link>
          </Typography>
        </Stack>
      </Container>
    </footer>
  );
};
