import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-dark': '#07051a',
        'star-gold': '#f4d03f',
        ivory: '#faf7f0',
        'rose-red': '#c0392b',
        'prince-blue': '#2980b9',
        'prince-gold': '#f39c12',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        handwriting: ['"IM Fell English"', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
