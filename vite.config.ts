import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   build: {
//     rollupOptions: {
//       input: {
//         popup: resolve(__dirname, "index.html"),
//         background: resolve(__dirname, "src/background.ts"),
//         content: resolve(__dirname, "src/content.ts"),
//       },
//       output: {
//         entryFileNames: (chunk) => {
//           if (chunk.name === "background") return "background.js";
//           if (chunk.name === "content") return "content.js";
//           return "[name].js";
//         },
//       },
//     },
//   },
// });

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        contentScript: "src/content-script.tsx",
        background: "src/background.ts", // jeśli masz background w TS
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
  },
  plugins: [react(), tailwindcss()],
});
