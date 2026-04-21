import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const storybookBasePath = process.env.STORYBOOK_BASE_PATH?.trim()

function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === '/') return '/'
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function resolveStorybookChunk(id: string) {
  const normalizedId = id.replace(/\\/g, '/')

  if (!normalizedId.includes('/node_modules/')) return undefined
  if (normalizedId.includes('/axe-core/')) return 'vendor-axe'
  if (normalizedId.includes('/styled-components/')) return 'vendor-styled'
  if (normalizedId.includes('/msw') || normalizedId.includes('/@mswjs/')) return 'vendor-mock'
  if (
    normalizedId.includes('/recharts/') ||
    normalizedId.includes('/d3-') ||
    normalizedId.includes('/victory-vendor/')
  ) {
    return 'vendor-charts'
  }
  if (
    normalizedId.includes('/react-day-picker/') ||
    normalizedId.includes('/date-fns/')
  ) {
    return 'vendor-date'
  }
  if (normalizedId.includes('/lucide-react/')) return 'vendor-icons'
  return undefined
}

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    '../stories/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (viteConfig) => {
    if (storybookBasePath) {
      viteConfig.base = normalizeBasePath(storybookBasePath)
    }

    const existingOutput = viteConfig.build?.rollupOptions?.output
    const normalizedExistingOutput =
      existingOutput && !Array.isArray(existingOutput) ? existingOutput : undefined
    const existingManualChunks =
      normalizedExistingOutput &&
      'manualChunks' in normalizedExistingOutput &&
      typeof normalizedExistingOutput.manualChunks === 'function'
        ? normalizedExistingOutput.manualChunks
        : undefined

    viteConfig.build = {
      ...viteConfig.build,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        ...viteConfig.build?.rollupOptions,
        output: {
          ...normalizedExistingOutput,
          manualChunks(id) {
            const explicitChunk = resolveStorybookChunk(id)
            if (explicitChunk) return explicitChunk

            if (existingManualChunks) {
              return existingManualChunks(id)
            }

            return undefined
          },
        },
      },
    }

    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        ...(viteConfig.resolve?.alias ?? {}),
        '@ingradient/ui/brand': path.resolve(__dirname, '../src/brand/index.tsx'),
        '@ingradient/ui/tokens': path.resolve(__dirname, '../src/tokens/index.ts'),
        '@ingradient/ui/primitives': path.resolve(__dirname, '../src/primitives/index.ts'),
        '@ingradient/ui/components': path.resolve(__dirname, '../src/components/index.ts'),
        '@ingradient/ui/patterns': path.resolve(__dirname, '../src/patterns/index.ts'),
        '@ingradient/ui': path.resolve(__dirname, '../src/index.ts'),
        '@storybook-support': path.resolve(__dirname, '../stories/support'),
      },
    }

    return viteConfig
  },
}

export default config
