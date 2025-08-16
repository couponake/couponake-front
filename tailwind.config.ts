import plugin from "tailwindcss/plugin";
import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|autocomplete|avatar|badge|button|chip|divider|drawer|dropdown|image|input|link|listbox|modal|navbar|pagination|popover|progress|select|skeleton|snippet|spinner|toggle|tabs|ripple|form|scroll-shadow|menu).js",
  ],

  theme: {
    backgroundImage: {},
    fontFamily: {
      inherit: ["inherit"],
      cairo: ["var(--font-cairo)", "var(--font-poppins)", "monospace"],
      poppins: ["var(--font-poppins)", "var(--font-cairo)", "monospace"],
    },
    container: {
      center: "true",
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
      },
      screens: {
        "2xl": "1370px",
      },
    },
    extend: {
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "meteor-effect": "meteor 5s linear infinite",
        "shiny-text": "shiny-text 8s infinite",
        "shimmer-slide":
          "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        meteor: "meteor 5s linear infinite",
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        bell: "bell 1s ease-in-out infinite",
        swing: "swing 1s infinite",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        bell: {
          "0%, 100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(-15deg)" },
          "50%": { transform: "rotate(15deg)" },
        },
        swing: {
          "0%,100%": { transform: "rotate(15deg)" },
          "50%": { transform: "rotate(-15deg)" },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        meteor: {
          "0%": {
            transform: "rotate(215deg) translateX(0)",
            opacity: "1",
          },
          "70%": {
            opacity: "1",
          },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shiny-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shiny-width)) 0",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - var(--gap)))",
          },
        },
        "marquee-vertical": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(calc(-100% - var(--gap)))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xs: "576px",
        mid: "768px",
        "3xl": "1600px",
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
      colors: {
        main: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#7214d1",
          600: "#5b0faa",
          700: "#470b87",
          800: "#350865",
          900: "#27064d",
          950: "#150230",
        },
        red: {
          "50": "#fef2f2",
          "100": "#fecdcd",
          "200": "#fda4a4",
          "300": "#fb7185",
          "400": "#f43f5e",
          "500": "#e11d48",
          "600": "#be123c",
          "700": "#9b1136",
          "800": "#771d24",
          "900": "#5d2a2a",
          "950": "#3f1d1d",
        },
        green: {
          250: "#1B998B",
        },
        orangeCoupoonat: {
          200: "#fbd872",
          500: "#fca809",
          900: "#f69839",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      spacing: {
        11: "2.75rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        16: "4rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        21: "5.25rem",
        22: "5.5rem",
        25: "6.25rem",
        26: "6.5rem",
        27: "6.75rem",
        29: "7.25rem",
        30: "7.5rem",
        31: "7.75rem",
        34: "8.5rem",
        35: "8.75rem",
        39: "9.75rem",
        40: "10rem",
        44: "11rem",
        45: "11.25rem",
        46: "11.5rem",
        49: "12.25rem",
        50: "12.5rem",
        52: "13rem",
        54: "13.5rem",
        55: "13.75rem",
        59: "14.75rem",
        60: "15rem",
        65: "16.25rem",
        67: "16.75rem",
        70: "17.5rem",
        73: "18.25rem",
        75: "18.75rem",
        90: "22.5rem",
        94: "23.5rem",
        95: "23.75rem",
        100: "25rem",
        115: "28.75rem",
        125: "31.25rem",
        150: "37.5rem",
        180: "45rem",
        203: "50.75rem",
        230: "57.5rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        10.5: "2.625rem",
        11.5: "2.875rem",
        12.5: "3.125rem",
        13.5: "3.375rem",
        14.5: "3.625rem",
        15.5: "3.875rem",
        16.5: "4.125rem",
        17.5: "4.375rem",
        18.5: "4.625rem",
        19.5: "4.875rem",
        21.5: "5.375rem",
        22.5: "5.625rem",
        24.5: "6.125rem",
        25.5: "6.375rem",
        27.5: "6.875rem",
        29.5: "7.375rem",
        32.5: "8.125rem",
        34.5: "8.625rem",
        36.5: "9.125rem",
        37.5: "9.375rem",
        39.5: "9.875rem",
        42.5: "10.625rem",
        47.5: "11.875rem",
        52.5: "13.125rem",
        54.5: "13.625rem",
        55.5: "13.875rem",
        62.5: "15.625rem",
        67.5: "16.875rem",
        72.5: "18.125rem",
        132.5: "33.125rem",
        171.5: "42.875rem",
        187.5: "46.875rem",
        242.5: "60.625rem",
      },
      maxWidth: {
        3: "0.75rem",
        4: "1rem",
        11: "2.75rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        25: "6.25rem",
        30: "7.5rem",
        34: "8.5rem",
        35: "8.75rem",
        40: "10rem",
        44: "11rem",
        45: "11.25rem",
        70: "17.5rem",
        90: "22.5rem",
        94: "23.5rem",
        125: "31.25rem",
        150: "37.5rem",
        180: "45rem",
        203: "50.75rem",
        230: "57.5rem",
        270: "67.5rem",
        280: "70rem",
        2.5: "0.625rem",
        22.5: "5.625rem",
        42.5: "10.625rem",
        132.5: "33.125rem",
        142.5: "35.625rem",
        242.5: "60.625rem",
        292.5: "73.125rem",
      },
      maxHeight: {
        35: "8.75rem",
        70: "17.5rem",
        90: "22.5rem",
        300: "18.75rem",
        550: "34.375rem",
      },
      minWidth: {
        75: "18.75rem",
        22.5: "5.625rem",
        42.5: "10.625rem",
        47.5: "11.875rem",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#7214d1",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#7214d1",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
    require("tailwindcss-animate"),
    plugin(function spicyGradients({ addUtilities }) {
      addUtilities({
        ".bg-none": { "background-image": "none" },
        ".bg-gradient-to-t": {
          "background-image":
            "linear-gradient(to top, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to top, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to top, var(--tw-gradient-stops))",
            },
        },
        ".bg-gradient-to-b": {
          "background-image":
            "linear-gradient(to bottom, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to bottom, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to bottom, var(--tw-gradient-stops))",
            },
        },
        ".bg-gradient-to-l": {
          "background-image":
            "linear-gradient(to left, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to left, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to left, var(--tw-gradient-stops))",
            },
        },
        ".bg-gradient-to-r": {
          "background-image":
            "linear-gradient(to right, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to right, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to right, var(--tw-gradient-stops))",
            },
        },
        ".bg-gradient-to-tl": {
          "background-image":
            "linear-gradient(to top left, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to top left, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to top left, var(--tw-gradient-stops))",
            },
        },
        ".bg-gradient-to-tr": {
          "background-image":
            "linear-gradient(to top right, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to top right, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to top right, var(--tw-gradient-stops))",
            },
        },
        ".bg-gradient-to-bl": {
          "background-image":
            "linear-gradient(to bottom left, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to bottom left, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to bottom left, var(--tw-gradient-stops))",
            },
        },
        ".bg-gradient-to-br": {
          "background-image":
            "linear-gradient(to bottom right, var(--tw-gradient-stops))",
          "@supports (background: linear-gradient(in oklch to bottom right, black, white))":
            {
              "background-image":
                "linear-gradient(in oklch to bottom right, var(--tw-gradient-stops))",
            },
        },
      });
    }),
  ],
};
