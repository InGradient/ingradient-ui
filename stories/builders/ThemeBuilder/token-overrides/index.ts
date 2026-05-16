/**
 * ThemeBuilder token override barrel.
 * 7개 카테고리 (colors / spacing / radius / typography / shadows / motion / control-sizes) 를
 * 합쳐 unified Args / argTypes / defaults / build / autoSync 를 제공.
 */

import type { InputType } from 'storybook/internal/types'
import {
  buildArgTypesFromDefs, buildAutoSyncFromDefs, buildDefaultsFromDefs, buildOverridesFromDefs,
  type TokenCategory, type TokenDef,
} from './shared'
import { colorCategory } from './colors'
import { spacingCategory } from './spacing'
import { radiusCategory } from './radius'
import { typographyCategory } from './typography'
import { shadowCategory } from './shadows'
import { motionCategory } from './motion'
import { controlSizeCategory } from './control-sizes'

const CATEGORIES: readonly TokenCategory[] = [
  colorCategory, spacingCategory, radiusCategory, typographyCategory,
  shadowCategory, motionCategory, controlSizeCategory,
]

const ALL_DEFS: readonly TokenDef[] = CATEGORIES.flatMap((c) => c.defs)

export type TokenOverrideArgs = Record<string, string>

export const tokenOverrideArgTypes: Record<string, InputType> = CATEGORIES.reduce((acc, cat) => {
  Object.assign(acc, buildArgTypesFromDefs(cat.defs, cat.category, cat.controlType))
  return acc
}, {} as Record<string, InputType>)

export const tokenOverrideDefaults: TokenOverrideArgs = buildDefaultsFromDefs(ALL_DEFS)

export function buildTokenOverrides(args: TokenOverrideArgs): Record<string, string> {
  return buildOverridesFromDefs(ALL_DEFS, args)
}

export function buildTokenAutoSyncUpdates(
  prev: Record<string, string>,
  next: Record<string, string>,
  current: TokenOverrideArgs,
): Partial<TokenOverrideArgs> {
  return buildAutoSyncFromDefs(ALL_DEFS, prev, next, current)
}
