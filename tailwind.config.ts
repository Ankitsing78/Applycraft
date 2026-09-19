import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          dark: "#030712",
          card: "rgba(8, 14, 29, 0.82)",
          border: "rgba(0, 242, 254, 0.25)",
          cyan: "#00f0ff",
          blue: "#0070f3",
          purple: "#9d4edd",
          violet: "#a855f7",
          neon: "#00ff88",
          amber: "#ffb703",
          rose: "#ff007f",
        },
        primary: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 6s linear infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "rotate-slow": "spin 20s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", filter: "drop-shadow(0 0 15px rgba(0, 240, 255, 0.4))" },
          "50%": { opacity: "0.85", filter: "drop-shadow(0 0 25px rgba(168, 85, 247, 0.6))" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
