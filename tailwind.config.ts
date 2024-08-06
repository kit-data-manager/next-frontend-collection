import type { Config } from 'tailwindcss';
import flowbite from "flowbite-react/tailwind";

const config = {
  darkMode: ['class'],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    flowbite.content()
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--primary)",
        foreground: "var(--primary-foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        },
        success: {
          DEFAULT: "var(--success)"
        },
        info: {
          DEFAULT: "var(--info)"
        },
        warn: {
          DEFAULT: "var(--warn)"
        },
        root: {
          DEFAULT: "var(--root)"
        },
        data: {
          DEFAULT: "var(--data)"
        },
        contextual: {
          DEFAULT: "var(--contextual)"
        },
        error: {
          DEFAULT: "var(--error)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "w-grow": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "slide-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" }
        },
        "slide-left-reverse": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" }
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "w-grow": "w-grow 0.1s ease",
        "slide-left": "slide-left .5s ease",
        "slide-left-reverse": "slide-left-reverse .5s ease",
        "fade-out": "fade-out .5s ease",
        "fade-in": "fade-in .5s ease"
      }
    }
  },

  plugins: [
      flowbite.plugin(),
      require('@tailwindcss/forms'),
      require("tailwindcss-animate"),
  ]
}

export default config;
