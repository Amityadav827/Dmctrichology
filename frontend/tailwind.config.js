/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme palette
        ink: "#0F172A",
        mist: "#E2E8F0",
        sand: "#F8FAFC",
        coral: "#3B82F6",         // repurposed as blue accent
        // Primary brand — blue
        primary: "#2563EB",
        primaryLight: "#EFF6FF",
        primaryHover: "#1D4ED8",
        // Background system
        lightBg: "#F8FAFC",
        lightCard: "#FFFFFF",
        // Borders
        borderLight: "#E2E8F0",
        // Text
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        // Status colours (light)
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        // Gradient pair (blue/cyan subtle)
        gradientStart: "#2563EB",
        gradientEnd: "#0EA5E9",
        // Legacy dark tokens kept for Login page only
        darkBg: "#0D0D1A",
        darkCard: "#111827",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        panel: "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.06)",
        card: "0 2px 8px rgba(15,23,42,0.08)",
        glow: "0 0 20px rgba(37,99,235,0.15)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
