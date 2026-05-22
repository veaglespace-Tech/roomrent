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
        ink: "#1F2937",
        mist: "#F4F7FB",
        brand: "#0F766E",
        accent: "#F97316"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"]
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
          secondary: "#F97316",
          accent: "#14B8A6",
          neutral: "#1F2937",
          "base-100": "#FFFFFF",
          "base-200": "#F4F7FB",
          "base-300": "#E5ECF3",
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

