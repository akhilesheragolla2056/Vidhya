export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B5BDB',
          light: '#5C7CFA',
          dark: '#364FC7',
          50: '#EDF2FF',
          100: '#DBE4FF',
          200: '#BAC8FF',
          300: '#91A7FF',
          400: '#748FFC',
          500: '#5C7CFA',
          600: '#4C6EF5',
          700: '#4263EB',
          800: '#3B5BDB',
          900: '#364FC7',
        },
        accent: {
          cyan: '#7DD3E8',
          pink: '#FFB5C5',
          orange: '#F5A623',
          yellow: '#FFD93D',
          green: '#2ECC71',
          red: '#FF6B6B',
        },
        surface: {
          light: '#E8F4FD',
          white: '#FFFFFF',
          gray: '#F8FAFC',
          dark: '#1E3A5F',
        },
        text: {
          primary: '#1A1A2E',
          secondary: '#64748B',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      backgroundSize: {
        '300%': '300%',
      }
    },
  },
  plugins: [],
}
