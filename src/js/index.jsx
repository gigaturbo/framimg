import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { App } from "./app";
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo, green } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: indigo,
        secondary: green,
        mode: 'dark'
    },
});

const container = document.getElementById("app");
const root = createRoot(container)
root.render(
    <StrictMode>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </StrictMode>);