import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import {
  IngradientGlobalStyle,
  IngradientThemeProvider,
  PresetProvider,
  platformV001,
  type Preset,
} from '../src/tokens'

const presetRegistry: Record<string, Preset | undefined> = {
  none: undefined,
  'platform-0.0.1': platformV001,
}

function normalizeBasePath(basePath: string | undefined) {
  if (!basePath || basePath === '/') return '/'
  return basePath.endsWith('/') ? basePath : `${basePath}/`
}

const storybookBasePath = normalizeBasePath(import.meta.env.BASE_URL)

initialize({
  onUnhandledRequest: 'bypass',
  quiet: true,
  serviceWorker: {
    url: `${storybookBasePath}mockServiceWorker.js`,
    options: {
      scope: storybookBasePath,
    },
  },
})

const densityPadding = {
  compact: 16,
  default: 24,
  comfortable: 32,
} as const

const preview: Preview = {
  parameters: {
    layout: 'padded',
    a11y: {
      // Default global mode is 'error' after PR-D4/D4b/D4c sweep (2026-05-10).
      // Individual stories may opt out with `test: 'todo'` only when violations
      // are documented as out-of-scope (none currently).
      test: 'error',
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Guides', 'Foundations', 'Components', 'Patterns', 'Pages', 'Sandboxes'],
      },
    },
  },
  globalTypes: {
    preset: {
      name: 'Preset',
      description: '제품 디자인 snapshot (theme + brand + density + mode)',
      toolbar: {
        icon: 'globe',
        dynamicTitle: true,
        items: [
          { value: 'none', title: 'None (legacy toolbars)' },
          { value: 'platform-0.0.1', title: 'platform 0.0.1' },
        ],
      },
    },
    theme: {
      name: 'Theme',
      description: 'Preview theme',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'portalDark', title: 'Portal Dark' },
          { value: 'portalLight', title: 'Portal Light' },
        ],
      },
    },
    density: {
      name: 'Density',
      description: 'Preview density',
      toolbar: {
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'default', title: 'Default' },
          { value: 'comfortable', title: 'Comfortable' },
        ],
      },
    },
    role: {
      name: 'Role',
      description: 'Viewer role preset',
      toolbar: {
        icon: 'user',
        dynamicTitle: true,
        items: [
          { value: 'viewer', title: 'Viewer' },
          { value: 'editor', title: 'Editor' },
          { value: 'admin', title: 'Admin' },
        ],
      },
    },
    dataScale: {
      name: 'Data',
      description: 'Data density preset',
      toolbar: {
        icon: 'database',
        dynamicTitle: true,
        items: [
          { value: 'sparse', title: 'Sparse' },
          { value: 'realistic', title: 'Realistic' },
          { value: 'overloaded', title: 'Overloaded' },
        ],
      },
    },
  },
  initialGlobals: {
    preset: 'none',
    theme: 'portalDark',
    density: 'default',
    role: 'editor',
    dataScale: 'realistic',
  },
  loaders: [mswLoader],
  decorators: [
    (Story, context) => {
      const density = context.globals.density as keyof typeof densityPadding
      const padding = densityPadding[density] ?? densityPadding.default
      const presetKey = context.globals.preset as string
      const preset = presetRegistry[presetKey]
      const fallbackMode = context.globals.theme === 'portalLight' ? 'light' : 'dark'

      const inner = (
        <>
          <IngradientGlobalStyle />
          <div
            data-ig-theme={context.globals.theme}
            data-ig-density={context.globals.density}
            data-ig-role={context.globals.role}
            data-ig-data-scale={context.globals.dataScale}
            style={{
              minHeight: '100vh',
              padding,
              background: 'var(--ig-color-bg-canvas)',
              transition: 'padding 160ms ease, background 160ms ease',
            }}
          >
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <Story />
            </div>
          </div>
        </>
      )

      // preset 선택 시 PresetProvider 가 mode + data-ig-* attr 관리. None 일 때만 legacy toolbar 사용.
      if (preset) {
        return <PresetProvider preset={preset}>{inner}</PresetProvider>
      }
      return <IngradientThemeProvider mode={fallbackMode}>{inner}</IngradientThemeProvider>
    },
  ],
}

export default preview
