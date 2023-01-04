import { defineConfig } from 'cypress';

export default defineConfig({
	video: false,
	env: {
		...process.env
	},
	e2e: {
		setupNodeEvents(on, config) {
			config.env.TEST_HOST = process.env.TEST_HOST;
			config.env.IC0_HOST = process.env.IC0_HOST;
			return config;
		}
	}
});
