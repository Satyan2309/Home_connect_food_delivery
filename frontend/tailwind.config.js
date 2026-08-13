/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* light gray */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* warm terracotta */
        background: "var(--color-background)", /* warm off-white */
        foreground: "var(--color-foreground)", /* deep charcoal */
        primary: {
          DEFAULT: "var(--color-primary)", /* warm terracotta */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* fresh herb green */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* warm red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* light gray */
          foreground: "var(--color-muted-foreground)", /* sophisticated gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* golden saffron */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* deep charcoal */
        },
        card: {
          DEFAULT: "var(--color-card)", /* white */
          foreground: "var(--color-card-foreground)", /* deep charcoal */
        },
        success: {
          DEFAULT: "var(--color-success)", /* deeper green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* bright golden yellow */
          foreground: "var(--color-warning-foreground)", /* deep charcoal */
        },
        error: {
          DEFAULT: "var(--color-error)", /* warm red */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
        caption: ['Nunito Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      animation: {
        "fade-in": "fadeIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        "slide-up": "slideUp 300ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        "bounce-gentle": "bounceGentle 300ms cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
      },
      boxShadow: {
        'warm': '0 4px 12px rgba(230, 126, 34, 0.08)',
        'warm-sm': '0 2px 8px rgba(230, 126, 34, 0.06)',
        'warm-lg': '0 8px 24px rgba(230, 126, 34, 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}