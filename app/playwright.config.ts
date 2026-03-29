import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

export default defineConfig({
  testDir: './e2e',
  testIgnore: ['**/demo-walkthrough.spec.ts', '**/readme-gif-walkthrough.spec.ts', '**/readme-cli-walkthrough.spec.ts'],
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev:e2e -- --host 127.0.0.1 --port ${PORT}`,
    env: {
      ...process.env,
      VITE_CONTENT_SOURCE: 'fixtures',
    },
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
