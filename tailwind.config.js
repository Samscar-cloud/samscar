/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6', // Neon Blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#facc15', // Neon Yellow
          600: '#eab308',
          700: '#ca8a04',
        },
        accent: {
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        carbon: {
          50: '#27272a',
          100: '#1f1f2e',
          200: '#181825',
          300: '#12121a', // Base Dark
          400: '#0d0d12', // Deep Dark
        }
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}