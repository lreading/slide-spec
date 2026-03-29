import { defineConfig, devices } from '@playwright/test'

const PORT = 4176
const DEMO_PROJECT = '../assets/readme-cli-demo-project'

export default defineConfig({
  testDir: './e2e',
  outputDir: '../assets/readme-gif-artifacts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  timeout: 240_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'off',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 800 },
    video: { mode: 'on', size: { width: 1280, height: 800 } },
    launchOptions: {
      slowMo: 220,
    },
  },
  projects: [{ name: 'chromium-readme-cli' }],
  webServer: {
    command:
      `rm -rf "./e2e/fixtures/content-cli-demo" ` +
      `&& mkdir -p "./e2e/fixtures/content-cli-demo" ` +
      `&& mkdir -p "${DEMO_PROJECT}" ` +
      `&& npm --prefix ../cli run cli -- init "${DEMO_PROJECT}" --presentation-id 2026-demo --title "Slide Spec Demo" --subtitle "Default Slides" --from-date 2026-01-01 --force ` +
      `&& cp -R "${DEMO_PROJECT}/content/." "./e2e/fixtures/content-cli-demo/" ` +
      `&& npm run dev:e2e -- --host 127.0.0.1 --port ${PORT}`,
    env: {
      ...process.env,
      VITE_CONTENT_SOURCE: 'cli-demo',
      VITE_PRESENTATION_URL_MODE: 'true',
    },
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
