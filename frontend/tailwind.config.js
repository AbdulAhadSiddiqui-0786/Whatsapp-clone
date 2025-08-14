/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enable dark mode via class
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "wa-green": "#25D366",
        "wa-dark": "#111B21",
        "wa-chat": "#005C4B",
        "wa-gray": "#202C33",
      },
      fontFamily: {
        whatsapp: [
          "Segoe UI",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
