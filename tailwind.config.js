/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1.5s step-start infinite',
        marquee: 'marquee 15s linear infinite', // Make sure this is 15s or higher
      },
      
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
