/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#bd2427',
          'red-dark': '#9a1c1f',
          'red-light': '#d94548',
          green: '#166935',
          'green-dark': '#0f4d26',
          'green-light': '#1e8a45',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        'marquee': 'marquee 30s linear infinite',
        'counter': 'counter 2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(13,13,13,0.8) 0%, rgba(22,105,53,0.3) 60%, rgba(189,36,39,0.2) 100%)',
      },
    },
  },
  plugins: [],
}
