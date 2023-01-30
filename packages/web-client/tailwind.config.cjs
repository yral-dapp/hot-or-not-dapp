const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        sans: ['sans-serif'],
      },
      boxShadow: {
        'button-primary': '0px 4px 10px rgba(255, 113, 33, 0.2)',
        'up': [
          '0px -20px 25px -5px rgba(0,0,0,0.5)',
          '0px -8px 10px -6px rgba(0,0,0,0.5)',
        ],
      },
      colors: {
        primary: '#E96B25',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

module.exports = config
