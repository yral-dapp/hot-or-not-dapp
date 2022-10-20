import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const projects: PlaywrightTestConfig['projects'] =
	process.env.runner === 'macos'
		? [
				{
					name: 'webkit',
					use: {
						...devices['Desktop Safari']
					}
				}
		  ]
		: [
				{
					name: 'chromium',
					use: {
						...devices['Desktop Chrome']
					}
				}
		  ];

const config: PlaywrightTestConfig = {
	testDir: './tests',
	timeout: 30 * 1000,
	expect: {
		timeout: 5000
	},
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [['list'], ['github'], ['html']],
	use: {
		actionTimeout: 0,
		trace: 'on-first-retry'
	},

	/* Configure projects for major browsers */
	projects,

	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	// outputDir: 'test-results/',

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'npm run dev',
		port: 5173
	}
};

export default config;
