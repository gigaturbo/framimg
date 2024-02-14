import { NoSsr } from '@mui/base/NoSsr';
import CssBaseline from '@mui/material/CssBaseline';
import { green, indigo } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { App } from "./app";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
    palette: {
        primary: indigo,
        secondary: green,
        mode: 'dark'
    },
});

const container = document.getElementById("root");
const root = createRoot(container)
root.render(
    <StrictMode>
        {/* <NoSsr> */}
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
        {/* </NoSsr> */}
    </StrictMode>
);