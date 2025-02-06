// @ts-ignore
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBlue: "#1E3A8A",
        customDarkPurple: "#2c2638",
        customSmoky:"#5e586e",
        customMartinique: "#3c364c",
        customMirage: "#111825"
      },
      spacing: {
        128: "32rem",
      },
      borderRadius: {
        xl: "1.5rem",
      }
    },
  },
  plugins: [],
} satisfies Config;
