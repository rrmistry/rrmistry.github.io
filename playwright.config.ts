import { defineConfig } from '@playwright/test';

// 5 minutes timeout (in milliseconds)
let COMMON_TIMEOUT = 5 * 60 * 1000;

export default defineConfig({
	// Reference: https://playwright.dev/docs/test-webserver
	webServer: {
		command: 'npm run preview',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		stdout: 'pipe',
		stderr: 'pipe',
		timeout: COMMON_TIMEOUT
	},

	use: {
		baseURL: 'http://localhost:5173',

		// Give more time for actions
		actionTimeout: COMMON_TIMEOUT,
		navigationTimeout: COMMON_TIMEOUT
	},

	// Global test timeout
	timeout: COMMON_TIMEOUT,

	testDir: 'e2e',

	fullyParallel: true,

	// Reference: https://playwright.dev/docs/test-reporters
	reporter: [[process.env.CI ? 'github' : 'list'], ['html', { open: 'never' }]]
});
