import "./polyfills";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { initGA } from "./analytics/gtag";

initGA();

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);