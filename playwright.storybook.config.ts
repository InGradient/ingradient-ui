import { defineConfig, devices } from '@playwright/test'

const storybookPort = Number(process.env.STORYBOOK_VISUAL_PORT ?? '6007')
const baseURL = process.env.STORYBOOK_VISUAL_BASE_URL ?? `http://127.0.0.1:${storybookPort}`

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    viewport: { width: 1440, height: 1200 },
    colorScheme: 'dark',
  },
  webServer: {
    command: `python3 -m http.server ${storybookPort} --bind 127.0.0.1 --directory storybook-static`,
    url: baseURL,
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
      },
    },
  ],
})
