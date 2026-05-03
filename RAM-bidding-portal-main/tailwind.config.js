/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ram: {
          primary: '#C20831',
          'primary-dark': '#9C0626',
          secondary: '#4A1E2C',
          'secondary-dark': '#2E1119',
          gold: '#C9A86A',
          'gold-light': '#E0C893',
          'gold-dark': '#A88A4F',
        },
        bg: {
          DEFAULT: '#F8F8F8',
          subtle: '#FFFFFF',
          dark: '#1A1A1A',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
      },
      fontFamily: {
        display: ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-ram': 'linear-gradient(135deg, #C20831 0%, #4A1E2C 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A86A 0%, #A88A4F 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2E1119 100%)',
        'moroccan-pattern': "url('/patterns/moroccan-bg.svg')",
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'gold': '0 4px 20px rgba(201, 168, 106, 0.3)',
        'ram': '0 4px 20px rgba(194, 8, 49, 0.25)',
      },
    },
  },
  plugins: [],
}
