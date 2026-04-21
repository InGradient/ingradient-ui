import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { IngradientGlobalStyle, IngradientThemeProvider } from '../src/tokens'

initialize({
  onUnhandledRequest: 'bypass',
  quiet: true,
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
      test: 'todo',
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
    theme: {
      name: 'Theme',
      description: 'Preview theme',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'portalDark', title: 'Portal Dark' },
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

      return (
        <IngradientThemeProvider>
          <IngradientGlobalStyle />
          <div
            data-ig-theme={context.globals.theme}
            data-ig-density={context.globals.density}
            data-ig-role={context.globals.role}
            data-ig-data-scale={context.globals.dataScale}
            style={{
              minHeight: '100vh',
              padding,
              transition: 'padding 160ms ease',
            }}
          >
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <Story />
            </div>
          </div>
        </IngradientThemeProvider>
      )
    },
  ],
}

export default preview
