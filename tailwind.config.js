/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ["ql-container", "ql-editor", "ql-toolbar"],
  theme: {
    extend: {
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.7)", opacity: "0.7" },
          "70%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { transform: "scale(0.7)", opacity: "0" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1s cubic-bezier(0.66, 0, 0, 1) infinite",
      },
      fontFamily: {
        signika: ["Signika", "sans-serif"],
        edu: ['"Edu NSW ACT Cursive"', "cursive"],
      },
      colors: {
        primary: "#8FA31E",
        primary2: "#cfa84d",
        secondary: "#556B2F",
        black2: "#322C2B",
      },
    },
  },
  plugins: [],
};
