import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import {
  IngradientGlobalStyle,
  IngradientThemeProvider,
  PresetProvider,
  platformV001,
  edgeV001,
  medicalV001,
  type Preset,
  type ThemeMode,
  type DensityId,
} from '../src/tokens'
import { ReviewWidget } from '../stories/support/ReviewWidget'
import { CommentPanel } from '../stories/support/CommentPanel'

type ServiceId = 'none' | 'platform' | 'edge' | 'medical'
type VersionId = '0.0.1'

const presetMatrix: Partial<Record<ServiceId, Partial<Record<VersionId, Preset>>>> = {
  platform: { '0.0.1': platformV001 },
  edge: { '0.0.1': edgeV001 },
  medical: { '0.0.1': medicalV001 },
}

function resolvePreset(service: string, version: string): Preset | undefined {
  return presetMatrix[service as ServiceId]?.[version as VersionId]
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

// Storybook viewport addon 의 viewport 정의 + Factory Monitor 추가.
const customViewports = {
  mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' }, type: 'mobile' },
  tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  laptop: { name: 'Laptop', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
  desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
  factoryMonitor: { name: 'Factory Monitor', styles: { width: '1920px', height: '1080px' }, type: 'desktop' },
} as const

const preview: Preview = {
  parameters: {
    layout: 'padded',
    a11y: {
      test: 'error',
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: customViewports,
    },
    options: {
      storySort: {
        order: ['Guides', 'Foundations', 'Components', 'Patterns', 'Pages', 'Builders', 'Sandboxes'],
      },
    },
  },
  globalTypes: {
    version: {
      name: 'Version',
      description: '서비스 UI version (§ 14.3)',
      toolbar: {
        icon: 'time',
        dynamicTitle: true,
        items: [{ value: '0.0.1', title: '0.0.1' }],
      },
    },
    mode: {
      name: 'Mode',
      description: '화면 모드 (§ 14.5) — inherit = preset.mode 따름',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'inherit', title: 'Inherit' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'high-contrast', title: 'High Contrast (placeholder)' },
        ],
      },
    },
    density: {
      name: 'Density',
      description: '정보 밀도 (§ 14.6) — inherit = preset.density 따름',
      toolbar: {
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'inherit', title: 'Inherit' },
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'compact', title: 'Compact' },
          { value: 'ultra-dense', title: 'Ultra Dense' },
        ],
      },
    },
    locale: {
      name: 'Locale',
      description: '언어 (§ 14.8) — placeholder (i18n 미구현)',
      toolbar: {
        icon: 'globe',
        dynamicTitle: true,
        items: [
          { value: 'ko', title: '한국어' },
          { value: 'en', title: 'English' },
        ],
      },
    },
  },
  initialGlobals: {
    version: '0.0.1',
    mode: 'inherit',
    density: 'inherit',
    locale: 'ko',
  },
  loaders: [mswLoader],
  decorators: [
    (Story, context) => {
      const version = context.globals.version as string
      const modeGlobal = context.globals.mode as string
      const densityGlobal = context.globals.density as string
      const locale = context.globals.locale as string

      // service 는 story parameters.handoff.service 또는 parameters.service 에서 가져옴
      const handoff = context.parameters?.handoff as { service?: string } | undefined
      const service = handoff?.service ?? (context.parameters?.service as string | undefined) ?? 'none'

      const preset = resolvePreset(service, version)
      const modeOverride: ThemeMode | undefined =
        modeGlobal === 'inherit' || modeGlobal === 'high-contrast' ? undefined : (modeGlobal as ThemeMode)
      const densityOverride: DensityId | undefined =
        densityGlobal === 'inherit' ? undefined : (densityGlobal as DensityId)

      // page story (handoff metadata 있는 것) 에만 ReviewWidget 표시.
      const showReviewWidget = !!handoff?.service

      const inner = (
        <>
          <IngradientGlobalStyle />
          <div
            data-ig-locale={locale}
            style={{
              minHeight: '100vh',
              background: 'var(--ig-color-bg-canvas)',
              transition: 'background 160ms ease',
            }}
          >
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
              <Story />
            </div>
          </div>
          {showReviewWidget ? <ReviewWidget storyId={context.id} /> : null}
          {showReviewWidget ? <CommentPanel storyId={context.id} /> : null}
        </>
      )

      // preset 매칭 시 PresetProvider 가 mode + density + data-ig-* attr 관리
      if (preset) {
        return (
          <PresetProvider preset={preset} modeOverride={modeOverride} densityOverride={densityOverride}>
            {inner}
          </PresetProvider>
        )
      }
      // preset 없으면 IngradientThemeProvider 만 (mode 는 toolbar 선택 또는 dark default)
      return <IngradientThemeProvider mode={modeOverride ?? 'dark'}>{inner}</IngradientThemeProvider>
    },
  ],
}

export default preview
