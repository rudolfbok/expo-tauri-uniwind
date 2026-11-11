import tailwindcss from "@tailwindcss/vite";
import { uniwind } from "uniwind/vite";
import { defineConfig } from "vite";
import { rnw } from "vite-plugin-rnw";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		rnw(),
		tailwindcss(),
		uniwind({ cssEntryFile: "./src/global.css", dtsFile: "./src/uniwind-types.d.ts" }),
	],
	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent Vite from obscuring rust errors
	clearScreen: false,
	envPrefix: ["VITE_", "TAURI_ENV_"],
	server: {
		// 2. tauri expects a fixed port, fail if that port is not available
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
		// 3. tell Vite to ignore watching `src-tauri`
		watch: { ignored: ["**/src-tauri/**"] },
	},
	build: {
		target: process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari15",
		minify: process.env.TAURI_ENV_DEBUG ? false : "oxc",
		sourcemap: Boolean(process.env.TAURI_ENV_DEBUG),
	},
});
