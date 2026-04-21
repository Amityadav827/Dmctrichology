/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        sand: "#f8fafc",
        coral: "#d97757",
        moss: "#40634d",
        gold: "#b68d40",
        darkBg: "#0D0D1A",
        lightBg: "#F8FAFC",
        primary: "#00E5FF",
        gradientStart: "#8B5CF6",
        gradientEnd: "#00E5FF",
        darkCard: "#111827",
        lightCard: "#FFFFFF",
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["Epilogue", "sans-serif"],
      },
      boxShadow: {
        panel: "0 20px 45px rgba(15, 23, 42, 0.08)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
    },
  },
  plugins: [],
};
