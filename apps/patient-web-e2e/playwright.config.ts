import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:3000';

export default defineConfig({
  // __dirname = absolute path to apps/patient-web-e2e/
  // nxE2EPreset uses it to resolve testDir relative to this file
  ...nxE2EPreset(__dirname, { testDir: './src' }),

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'npx nx run patient-web:dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});