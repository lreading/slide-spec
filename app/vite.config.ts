import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['localhost', '06ed-64-223-218-131.ngrok-free.app']
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        perFile: true,
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      exclude: [
        'src/main.ts',
        'src/assets/**',
        'e2e/fixtures/content/**',
        'e2e/fixtures/content-demo/**',
        '../docs/fixtures/reference-project/**',
      ],
    },
  },
})
