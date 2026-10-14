/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:          '#bd2427',
          'red-dark':   '#9a1c1f',
          'red-light':  '#d94548',
          green:        '#166935',
          'green-dark': '#0f4d26',
          'green-light':'#1e8a45',
        },
        // Theme-aware via CSS vars
        surface: {
          base:     'var(--bg-base)',
          subtle:   'var(--bg-subtle)',
          muted:    'var(--bg-muted)',
          card:     'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
        },
        content: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
          faint:     'var(--text-faint)',
        },
        border: {
          subtle:  'var(--border-subtle)',
          default: 'var(--border-default)',
          strong:  'var(--border-strong)',
        },
      },
      fontFamily: {
        sans:  ['IBM Plex Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem,7vw,6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.4rem,5vw,4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.8rem,3.5vw,3rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.4rem,2.5vw,2rem)', { lineHeight: '1.2' }],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'sm':    'var(--shadow-sm)',
        'md':    'var(--shadow-md)',
        'lg':    'var(--shadow-lg)',
        'xl':    'var(--shadow-xl)',
        'brand-red':   'var(--shadow-brand-red)',
        'brand-green': 'var(--shadow-brand-green)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(13,13,13,0.85) 0%, rgba(22,105,53,0.25) 60%, rgba(189,36,39,0.18) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #bd2427, #166935)',
        'brand-gradient-r': 'linear-gradient(135deg, #166935, #bd2427)',
        'dark-gradient': 'linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)',
        'card-gradient': 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up':     'fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':     'fadeIn 0.5s ease forwards',
        'marquee':     'marquee 35s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'shimmer':     'shimmer 1.5s infinite',
        'scale-in':    'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-right': 'slideInRight 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:       { from:{opacity:'0',transform:'translateY(24px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        fadeIn:       { from:{opacity:'0'}, to:{opacity:'1'} },
        marquee:      { '0%':{transform:'translateX(0)'}, '100%':{transform:'translateX(-50%)'} },
        float:        { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-12px)'} },
        glow:         { from:{boxShadow:'0 0 20px rgba(22,105,53,0.3)'}, to:{boxShadow:'0 0 40px rgba(22,105,53,0.6)'} },
        shimmer:      { '0%':{backgroundPosition:'-200% 0'}, '100%':{backgroundPosition:'200% 0'} },
        scaleIn:      { from:{opacity:'0',transform:'scale(0.95)'}, to:{opacity:'1',transform:'scale(1)'} },
        slideInRight: { from:{opacity:'0',transform:'translateX(20px)'}, to:{opacity:'1',transform:'translateX(0)'} },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}