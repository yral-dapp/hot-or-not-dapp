const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Kumbh Sans', 'sans-serif']
			},
			boxShadow: {
				'button-primary': '0px 4px 10px rgba(255, 113, 33, 0.2);'
			},
			colors: {
				primary: '#E96B25'
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
