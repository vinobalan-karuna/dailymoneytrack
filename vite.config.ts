import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative asset paths work on GitHub Pages (`/dailymoneytrack/`) and local preview.
export default defineConfig({
  root: "web",
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
