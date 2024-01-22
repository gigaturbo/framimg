import { createRoot } from "react-dom/client";
import { App } from "./app";
import CssBaseline from '@mui/material/CssBaseline';

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<><CssBaseline /><App /></>);