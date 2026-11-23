import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: [
                "Chrome >= 70",
                "Firefox >= 68",
                "Edge >= 79"
            ],
            modernPolyfills: true,
            renderModernChunks: true
        }),
        tailwindcss(),
        mkcert()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        host: "::",
        open: "/",
    }
});