import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

export default defineConfig({
  testDir: './e2e',
  outputDir: '../assets/readme-gif-artifacts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  timeout: 300_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'off',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    launchOptions: {
      slowMo: 550,
    },
  },
  projects: [{ name: 'chromium-readme-gif', use: {} }],
  webServer: {
    command: `npm run dev:e2e -- --host 127.0.0.1 --port ${PORT}`,
    env: {
      ...process.env,
      VITE_CONTENT_SOURCE: 'docs-reference',
      VITE_PRESENTATION_URL_MODE: 'true',
    },
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
