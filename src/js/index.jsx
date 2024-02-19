// import { NoSsr } from "@mui/base/NoSsr";
import CssBaseline from "@mui/material/CssBaseline";
import { green, indigo } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { settings } from "pixi.js";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

settings.RESOLUTION = window.devicePixelRatio;
settings.RENDER_OPTIONS.antialias = false; //SETTINGS.render.antialias;
settings.RENDER_OPTIONS.autoDensity = true; //SETTINGS.render.autoDensity;
settings.ROUND_PIXELS = true; //SETTINGS.render.roundPixels;

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: green,
    mode: "dark",
  },
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    {/* <NoSsr> */}
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    {/* </NoSsr> */}
  </StrictMode>,
);
