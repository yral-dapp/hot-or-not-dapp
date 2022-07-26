const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Kumbh Sans', 'sans-serif']
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
