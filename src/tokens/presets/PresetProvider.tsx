import React, { createContext, useContext, useLayoutEffect, useMemo } from 'react'
import { densityRegistry } from '../density'
import { IngradientThemeProvider } from '../globals/theme-provider'
import type { ThemeMode } from '../modes'
import { composePreset } from './compose'
import type { ComposedPreset, DensityId, Preset } from './types'

const PresetContext = createContext<ComposedPreset | null>(null)

export interface PresetProviderProps {
  /** 적용할 preset. 미지정 시 PresetProvider 가 thin pass-through (mode='dark' default). */
  preset?: Preset
  /** preset.mode 를 무시하고 강제 mode. Global toolbar 의 Mode selector 용. */
  modeOverride?: ThemeMode
  /** preset.density 위에 추가 density 적용. Global toolbar 의 Density selector 용. */
  densityOverride?: DensityId
  children: React.ReactNode
}

/**
 * Preset 을 런타임에 적용한다. 내부에서 `IngradientThemeProvider` 를 감싸므로
 * 별도로 ThemeProvider 를 둘 필요 없음.
 *
 * Override 우선순위 (뒤가 앞을 이김):
 *   composePreset(preset).cssVariables → densityRegistry[densityOverride].cssVars
 *   composePreset(preset).mode → modeOverride
 */
export function PresetProvider({ preset, modeOverride, densityOverride, children }: PresetProviderProps) {
  const composed = useMemo(() => (preset ? composePreset(preset) : null), [preset])

  // 최종 CSS vars = composed + densityOverride 의 cssVars
  const finalCssVars = useMemo(() => {
    const base = composed?.cssVariables ?? {}
    const densityVars = densityOverride ? densityRegistry[densityOverride]?.cssVars ?? {} : {}
    return { ...base, ...densityVars }
  }, [composed, densityOverride])

  // 최종 attributes — densityOverride 적용 시 data-ig-density 갱신
  const finalAttributes = useMemo(() => {
    const base = composed?.attributes ?? {}
    if (densityOverride) {
      return { ...base, 'data-ig-density': densityOverride }
    }
    return base
  }, [composed, densityOverride])

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    Object.entries(finalAttributes).forEach(([key, value]) => {
      root.setAttribute(key, value)
    })
    Object.entries(finalCssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    return () => {
      Object.keys(finalAttributes).forEach((key) => {
        root.removeAttribute(key)
      })
      Object.keys(finalCssVars).forEach((key) => {
        root.style.removeProperty(key)
      })
    }
  }, [finalAttributes, finalCssVars])

  const mode = modeOverride ?? composed?.mode ?? 'dark'

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
