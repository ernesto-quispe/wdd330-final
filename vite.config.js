import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        problem: resolve(__dirname, "src/problem/index.html"),
        endGame: resolve(__dirname, "src/endGame/index.html")
      },
    },
  },
});
