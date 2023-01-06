import { defineConfig } from 'cypress';
import plugin from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
	video: false,
	env: {
		...process.env
	},

	reporter: '../../node_modules/mochawesome/src/mochawesome.js',
	reporterOptions: {
		reportPageTitle: 'Hot or Not Cypress Report',
		embeddedScreenshots: true,
		inlineAssets: true,
		saveAllAttempts: false,
		saveJson: false,
		saveHtml: true,
		overwrite: true,
		reportDir: 'cypress/reports/mochawesome-report'
	},
	e2e: {
		setupNodeEvents(on, config) {
			config.env.TEST_HOST = process.env.TEST_HOST;
			config.env.IC0_HOST = process.env.IC0_HOST;
			plugin(on);
			return config;
		}
	}
});
