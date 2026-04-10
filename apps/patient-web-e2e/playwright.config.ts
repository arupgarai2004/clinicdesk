import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:3000';

export default defineConfig({
  ...nxE2EPreset({ testDir: './src' }), // ✅ FIXED (removed __filename)

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
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});