/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include the dag-grid component source files so Tailwind can scan for classes
    "../../src/**/*.{js,ts,jsx,tsx}",
    // Also include the built files as a fallback
    "../../dist/**/*.{js,mjs}",
    // Include node_modules dag-grid if using the linked version
    "./node_modules/dag-grid/**/*.{js,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
