module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ledger: {
          base: '#08090d',
          surface: '#111318',
          elevated: '#1a1d25',
          border: '#252830',
          text: {
            primary: '#e8e9ed',
            secondary: '#8b8d97',
          },
          amber: '#e5a440',
          green: '#3dd68c',
          blue: '#6c8aff',
        },
      },
      keyframes: {
        'fade-slide-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'expand-down': {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '120px' },
        },
      },
      animation: {
        'fade-slide-in': 'fade-slide-in 0.25s ease-out both',
        'expand-down': 'expand-down 0.2s ease-out both',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ]
}
