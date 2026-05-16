/**
 * ThemeBuilder token override 의 공유 타입 + 헬퍼.
 * 각 카테고리 파일 (colors / spacing / radius / typography / shadows / motion / control-sizes) 가 이 타입에 맞춰 TOKEN_DEFS 를 export.
 */

import type { InputType } from 'storybook/internal/types'

export type AppliesTarget = string | { var: string; alpha: number }

export type TokenDef = {
  argKey: string
  label: string
  subcategory: string
  cssVar: string
  appliesTo: readonly AppliesTarget[]
}

export type TokenCategory = {
  defs: readonly TokenDef[]
  controlType: 'color' | 'text'
  category: string
}

export function hexToRgba(hex: string, alpha: number): string | null {
  if (!hex) return null
  const m = hex.replace('#', '').trim()
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(m)) return null
  const full = m.length === 3 ? m[0] + m[0] + m[1] + m[1] + m[2] + m[2] : m
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function buildOverridesFromDefs(
  defs: readonly TokenDef[],
  args: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const def of defs) {
    const value = args[def.argKey]
    if (!value) continue
    for (const target of def.appliesTo) {
      if (typeof target === 'string') {
        out[target] = value
      } else {
        const rgba = hexToRgba(value, target.alpha)
        if (rgba) out[target.var] = rgba
      }
    }
  }
  return out
}

export function buildAutoSyncFromDefs(
  defs: readonly TokenDef[],
  prev: Record<string, string>,
  next: Record<string, string>,
  current: Record<string, string>,
): Record<string, string> {
  const updates: Record<string, string> = {}
  for (const def of defs) {
    const prevValue = prev[def.cssVar]
    const nextValue = next[def.cssVar]
    if (!nextValue) continue
    const currentValue = current[def.argKey]
    // 빈 picker = "default 따름" / current === prev = "default 트래킹 중" → sync 가능
    // 값 있고 prev 와 다름 (or prev 없음 = mount with URL override) = "user override" → 유지
    const userHasOverridden = currentValue !== '' && currentValue !== prevValue
    if (!userHasOverridden && currentValue !== nextValue) {
      updates[def.argKey] = nextValue
    }
  }
  return updates
}

export function buildArgTypesFromDefs(
  defs: readonly TokenDef[],
  category: string,
  controlType: 'color' | 'text',
): Record<string, InputType> {
  return defs.reduce((acc, def) => {
    acc[def.argKey] = {
      name: def.label,
      control: controlType,
      description: '비우면 theme/brand default',
      table: { category, subcategory: def.subcategory },
    }
    return acc
  }, {} as Record<string, InputType>)
}

export function buildDefaultsFromDefs(defs: readonly TokenDef[]): Record<string, string> {
  return defs.reduce((acc, def) => {
    acc[def.argKey] = ''
    return acc
  }, {} as Record<string, string>)
}
