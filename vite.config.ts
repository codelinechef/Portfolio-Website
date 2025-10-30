import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // Use BASE_PATH for GitHub Pages project sites (e.g., "/repo-name/"). Defaults to "/".
  base: '/Portfolio-Website/',
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          animations: ["framer-motion"],
          audio: ["howler"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
