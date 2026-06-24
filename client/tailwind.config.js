const daisyui = require("daisyui");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,mdx}", "./components/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f0f4ff",
        brand: "#6366f1",
        "brand-deep": "#4f46e5",
        "brand-light": "#8b5cf6",
        accent: "#a78bfa",
        surface: "#f8faff",
        slate: {
          900: "#0f172a",
          950: "#030712",
        }
      },
      fontFamily: {
        sans: ["Bricolage Grotesque", "Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui"],
        heading: ["Bricolage Grotesque", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(99,102,241,0.1), 0 1px 3px rgba(0,0,0,0.04)",
        "card-md": "0 8px 40px -8px rgba(99,102,241,0.14), 0 2px 8px rgba(0,0,0,0.06)",
        "card-lg": "0 16px 64px -16px rgba(99,102,241,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        glow: "0 0 24px -6px rgba(99,102,241,0.45)",
        "glow-sm": "0 0 14px -4px rgba(99,102,241,0.3)",
        "inset-glow": "inset 0 1px 0 rgba(255,255,255,0.9)",
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(ellipse 80% 60% at 0% 0%, rgba(99,102,241,0.07), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(139,92,246,0.06), transparent 45%)",
        "indigo-gradient":
          "linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%)",
        "hero-gradient":
          "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(99,102,241,0.12), transparent 50%), linear-gradient(145deg, #f0f4ff 0%, #f8faff 60%, #eef1ff 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "bounce-in": "bounceIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-slide": "fadeSlideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "fade-in": "overlayIn 0.3s ease both",
        "reveal-up": "revealUp 0.52s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        roomrent: {
          primary: "#6366f1",
          "primary-focus": "#4f46e5",
          secondary: "#8b5cf6",
          accent: "#a78bfa",
          neutral: "#0f172a",
          "base-100": "#f8faff",
          "base-200": "#f0f4ff",
          "base-300": "#e8eeff",
          "base-content": "#0f172a",
          info: "#6366f1",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444"
        }
      }
    ]
  }
};
