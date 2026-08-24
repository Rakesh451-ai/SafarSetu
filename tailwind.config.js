/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safar: {
          navy: '#12355B',
          'navy-dark': '#0E2845',
          'navy-light': '#1D4E82',
          teal: '#168A72',
          'teal-light': '#1FA68B',
          saffron: '#F28C28',
          'saffron-light': '#FB9E42',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#172033',
          muted: '#64748B',
          border: '#E2E8F0',
          safe: '#16A34A',
          caution: '#F59E0B',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 2px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
