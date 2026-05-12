import React, { createContext, useContext, useLayoutEffect, useMemo } from 'react'
import { IngradientThemeProvider } from '../globals/theme-provider'
import { composePreset } from './compose'
import type { ComposedPreset, Preset } from './types'

const PresetContext = createContext<ComposedPreset | null>(null)

export interface PresetProviderProps {
  /** 적용할 preset. 미지정 시 PresetProvider 가 thin pass-through (mode='dark' default). */
  preset?: Preset
  children: React.ReactNode
}

/**
 * Preset 을 런타임에 적용한다. 내부에서 `IngradientThemeProvider` 를 감싸므로
 * 별도로 ThemeProvider 를 둘 필요 없음.
 *
 * Phase 4 현재: mode 만 ThemeProvider 로 전달, density/brand 는 data-ig-* attr 로만
 * 표현. 실제 토큰 override 는 Phase 4+ 에서 themes/brands/density 채워지면 동작.
 */
export function PresetProvider({ preset, children }: PresetProviderProps) {
  const composed = useMemo(() => (preset ? composePreset(preset) : null), [preset])

  // DOM 의 root 에 data-ig-* attribute 적용 — 외부 CSS 가 attribute selector 로 override 가능.
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const attrs = composed?.attributes ?? {}
    Object.entries(attrs).forEach(([key, value]) => {
      root.setAttribute(key, value)
    })
    return () => {
      Object.keys(attrs).forEach((key) => {
        root.removeAttribute(key)
      })
    }
  }, [composed])

  const mode = composed?.mode ?? 'dark'

  return (
    <PresetContext.Provider value={composed}>
      <IngradientThemeProvider mode={mode}>{children}</IngradientThemeProvider>
    </PresetContext.Provider>
  )
}

/**
 * 현재 적용된 preset (없으면 null). 메타데이터 접근용.
 */
export function usePreset(): ComposedPreset | null {
  return useContext(PresetContext)
}
