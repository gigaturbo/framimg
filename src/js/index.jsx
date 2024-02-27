import { NoSsr } from "@mui/base/NoSsr";
import CssBaseline from "@mui/material/CssBaseline";
import { green, indigo } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { settings } from "pixi.js";
import { AppSettingsProvider, ImageSettingsProvider } from "./providers";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// TODO put into settings + localStorage
settings.RESOLUTION = window.devicePixelRatio;
settings.RENDER_OPTIONS.antialias = false; //SETTINGS.render.antialias;
settings.RENDER_OPTIONS.autoDensity = true; //SETTINGS.render.autoDensity;
settings.ROUND_PIXELS = true; //SETTINGS.render.roundPixels;

// const theme = createTheme({
//   palette: {
//     primary: indigo,
//     secondary: green,
//     // mode: "dark",
//   },
// });

const theme = createTheme({
  palette: {
    mode: "dark",
    common: { black: "rgba(0, 0, 0, 1)", white: "rgba(255, 255, 255, 1)" },
    background: {
      paper: "rgba(25, 25, 25, 1)",
      default: "rgba(25, 25, 25, 1)",
    },
    primary: {
      light: "#ffe680",
      main: "#ffcc00",
      dark: "#aa8800",
      contrastText: "#fff",
    },
    secondary: {
      light: "#80e5ff",
      main: "#37abc8",
      dark: "#216778",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(255, 255, 255, 1)",
      secondary: "rgba(255, 255, 255, 0.55)",
      disabled: "rgba(255, 255, 255, 0.33)",
      hint: "rgba(255, 250, 250, 0.33)",
    },
  },
  typography: { body1: { color: "#ffffff" } },
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <NoSsr>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppSettingsProvider>
          <ImageSettingsProvider>
            <App />
          </ImageSettingsProvider>
        </AppSettingsProvider>
      </ThemeProvider>
    </NoSsr>
  </StrictMode>,
);
