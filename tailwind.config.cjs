/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.html", "./src/assets/**/*.js"],
  theme: {
    extend: {
      colors: {
        /* Surface hierarchy — high-contrast dark editorial */
        surface: {
          DEFAULT: "#0F1117",
          dim: "#0F1117",
          bright: "#2C2E38",
          container: {
            lowest: "#0A0C10",
            low: "#161820",
            DEFAULT: "#1E2130",
            high: "#262A3A",
            highest: "#30354A",
          },
          variant: "#30354A",
          tint: "#2DD4E8",
        },
        "on-surface": {
          DEFAULT: "#E8E6E3",
          variant: "#9AA0B8",
        },
        /* Electric cyan primary — 9.5:1 contrast vs surface base */
        primary: {
          DEFAULT: "#2DD4E8",
          container: "#0EA5C0",
          fixed: "#A5F0F7",
          "fixed-dim": "#2DD4E8",
        },
        "on-primary": {
          DEFAULT: "#00272E",
          container: "#001F25",
          fixed: "#00151A",
          "fixed-variant": "#003D4D",
        },
        "inverse-primary": "#0098B3",
        secondary: {
          DEFAULT: "#34D399",
          container: "#059669",
          fixed: "#6EE7B7",
          "fixed-dim": "#34D399",
        },
        "on-secondary": {
          DEFAULT: "#022C1E",
          container: "#011F15",
          fixed: "#011209",
          "fixed-variant": "#034A30",
        },
        tertiary: {
          DEFAULT: "#F97316",
          container: "#C2440A",
          fixed: "#FED7AA",
          "fixed-dim": "#F97316",
        },
        "on-tertiary": {
          DEFAULT: "#3A1100",
          container: "#2C0D00",
          fixed: "#1A0600",
          "fixed-variant": "#4E1800",
        },
        outline: {
          DEFAULT: "#6B7280",
          variant: "#374151",
        },
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
        "on-error": {
          DEFAULT: "#690005",
          container: "#ffdad6",
        },
        background: "#0F1117",
        "on-background": "#E8E6E3",
        "inverse-surface": "#E8E6E3",
        "inverse-on-surface": "#313030",
        /* Semantic shorthand tokens */
        ink: {
          950: "#0A0C10",
          900: "#0F1117",
          800: "#161820",
          700: "#1E2130",
          600: "#262A3A",
          500: "#30354A",
        },
        "cyan-arc": {
          DEFAULT: "#2DD4E8",
          dim: "#0EA5C0",
          bright: "#A5F0F7",
        },
        "slatey": {
          100: "#E8E6E3",
          200: "#9AA0B8",
          400: "#6B7280",
          600: "#374151",
        },
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.25rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
      },
      fontFamily: {
        headline: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        label: ["Space Grotesk", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}
