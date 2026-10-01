import process from 'node:process'
import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test'

export interface CreatePlaywrightConfigOptions {
  testDir?: string
  previewPort?: number
}

export function createPlaywrightConfig(options: CreatePlaywrightConfigOptions = {}): PlaywrightTestConfig {
  const { testDir = './tests/e2e', previewPort = 4173 } = options

  return defineConfig({
    testDir,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
      baseURL: `http://localhost:${previewPort}`,
      trace: 'on-first-retry',
    },
    projects: [
      {
        name: 'desktop',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    webServer: {
      command: `pnpm dev --port ${previewPort} --strictPort`,
      url: `http://localhost:${previewPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        VITE_DATA_MODE: 'mock',
        VITE_FRONTEND_URL: `http://localhost:${previewPort}`,
      },
    },
  })
}
