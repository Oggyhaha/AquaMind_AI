/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqua: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        gov: {
          navy: '#0f172a',
          blue: '#1e3a8a',
          lightBg: '#f8fafc',
          border: '#cbd5e1',
        }
      },
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px (was 10px)
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px (was 12px - 20% boost!)
        'sm': ['1rem', { lineHeight: '1.5rem' }],        // 16px (was 14px)
        'base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px (was 16px)
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        'xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '2xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
