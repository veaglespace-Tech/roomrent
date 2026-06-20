import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        mist: "#EEF3F8",
        brand: "#0F766E",
        accent: "#334155"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        card: "0 20px 40px -24px rgba(15, 23, 42, 0.28)"
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(circle at top left, rgba(15,118,110,0.22), transparent 36%), radial-gradient(circle at right, rgba(249,115,22,0.14), transparent 26%)"
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        roomrent: {
          primary: "#0F766E",
          secondary: "#334155",
          accent: "#14B8A6",
          neutral: "#102033",
          "base-100": "#F9FBFD",
          "base-200": "#EEF3F8",
          "base-300": "#D9E4EC",
          info: "#2563EB",
          success: "#16A34A",
          warning: "#F59E0B",
          error: "#DC2626"
        }
      }
    ]
  }
};

export default config;
