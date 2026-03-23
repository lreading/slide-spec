import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

export default defineConfig({
  testDir: './e2e',
  outputDir: '../agents/playwright-demo-output',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'off',
    ...devices['Desktop Chrome'],
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    launchOptions: {
      slowMo: 280,
    },
  },
  projects: [{ name: 'chromium-demo', use: {} }],
  webServer: {
    command: `npm run dev:e2e -- --host 127.0.0.1 --port ${PORT}`,
    env: {
      ...process.env,
      VITE_CONTENT_SOURCE: 'demo',
    },
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
