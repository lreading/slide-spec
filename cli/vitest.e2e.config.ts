import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['e2e/**/*.e2e.spec.ts'],
    exclude: ['e2e/**/*.connectors.e2e.spec.ts'],
    testTimeout: 120000,
    hookTimeout: 120000,
  },
})
