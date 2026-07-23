import path from 'node:path'
import { playwright } from '@vitest/browser-playwright'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { defineConfig } from 'vitest/config'

const root = path.resolve(__dirname)
const storybookConfigDir = path.join(root, '.storybook')

export default defineConfig({
  resolve: {
    alias: {
      '@ingradient/ui/brand': path.resolve(root, 'src/brand/index.tsx'),
      '@ingradient/ui/tokens': path.resolve(root, 'src/tokens/index.ts'),
      '@ingradient/ui/primitives': path.resolve(root, 'src/primitives/index.ts'),
      '@ingradient/ui/components': path.resolve(root, 'src/components/index.ts'),
      '@ingradient/ui/patterns': path.resolve(root, 'src/patterns/index.ts'),
      '@ingradient/ui/utils': path.resolve(root, 'src/utils/index.ts'),
      '@ingradient/ui': path.resolve(root, 'src/index.ts'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.test.{ts,tsx}', 'packages/**/src/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
          coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/**/*.test.*', 'src/**/index.ts'],
            thresholds: { lines: 30, branches: 20 },
          },
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: storybookConfigDir })],
        test: {
          name: `storybook:${storybookConfigDir}`,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
