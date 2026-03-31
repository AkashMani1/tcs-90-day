/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          obsidian: {
            DEFAULT: '#080808',
            surface: '#131313',
            'surface-low': '#1C1B1B',
            'surface-high': '#2A2A2A',
            'surface-highest': '#353534',
          },
          'neon-indigo': {
            DEFAULT: '#6366F1',
            dim: '#4B4DD8',
            tint: '#C0C1FF',
          },
          'neon-cyan': {
            DEFAULT: '#06B6D4',
            dim: '#03B5D3',
            tint: '#4CD7F6',
          },
          'neon-purple': {
            DEFAULT: '#A855F7',
            dim: '#862DD4',
            tint: '#DDB7FF',
          },
          slate: {
            900: '#0f172a',
            800: '#1e293b',
            700: '#334155',
            600: '#475569',
            500: '#64748b',
            400: '#94a3b8',
            300: '#cbd5e1',
            200: '#e2e8f0',
            100: '#f1f5f9',
            50: '#f8fafc',
          },
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'shimmer': 'shimmer 2s linear infinite',
          'fade-in': 'fadeIn 0.5s ease-out',
          'slide-up': 'slideUp 0.4s ease-out',
        },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
