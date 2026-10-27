import React, { createContext, useContext, useMemo } from 'react'

/**
 * Surface depth: a rounded surface placed inside another rounded surface must be less
 * rounded than its parent. Token values or role names cannot guarantee that, because the
 * same component sits at different depths in different places. Surfaces therefore read
 * their depth from React context (which, unlike CSS inheritance, crosses portals).
 *
 * - No `SurfaceDepthProvider` above → `enabled: false`; surfaces keep their legacy radius.
 * - A regular surface is one level deeper than the nearest enclosing surface.
 * - A floating surface (modal, dialog, drawer, popover, menu) restarts at depth 1.
 * - Depth is clamped to `MAX_SURFACE_DEPTH` for styling, but the raw depth is kept so
 *   checks can flag panels nested deeper than the design allows.
 */

export const MAX_SURFACE_DEPTH = 3

export type SurfaceDepthLevel = 1 | 2 | 3

export interface SurfaceDepthState {
  /** True when a `SurfaceDepthProvider` is active above this surface. */
  enabled: boolean
  /** Raw nesting depth (1 = outermost surface). 0 when disabled. */
  depth: number
  /** Depth clamped to `MAX_SURFACE_DEPTH`, used to pick the radius. Undefined when disabled. */
  level: SurfaceDepthLevel | undefined
}

interface SurfaceDepthContextValue {
  enabled: boolean
  /** Depth of the nearest enclosing surface; 0 directly under the provider. */
  depth: number
}

const DISABLED: SurfaceDepthContextValue = { enabled: false, depth: 0 }

const SurfaceDepthContext = createContext<SurfaceDepthContextValue>(DISABLED)

export interface SurfaceDepthProviderProps {
  /** Set to false to turn depth-based styling off for a subtree. Defaults to true. */
  enabled?: boolean
  children?: React.ReactNode
}

/** Turns on depth-based surface styling for everything below it. */
export function SurfaceDepthProvider({ enabled = true, children }: SurfaceDepthProviderProps) {
  const value = useMemo<SurfaceDepthContextValue>(() => (enabled ? { enabled: true, depth: 0 } : DISABLED), [enabled])
  return <SurfaceDepthContext.Provider value={value}>{children}</SurfaceDepthContext.Provider>
}

function toLevel(depth: number): SurfaceDepthLevel {
  return Math.min(Math.max(depth, 1), MAX_SURFACE_DEPTH) as SurfaceDepthLevel
}

/** Pure depth calculation, exported for tests and for non-React callers. */
export function computeSurfaceDepth(parent: { enabled: boolean; depth: number }, floating = false): SurfaceDepthState {
  if (!parent.enabled) return { enabled: false, depth: 0, level: undefined }
  const depth = floating ? 1 : parent.depth + 1
  return { enabled: true, depth, level: toLevel(depth) }
}

/**
 * Depth of the surface that calls this hook. Pass `floating: true` for surfaces that
 * float above the page (modal, dialog, drawer, popover, menu).
 */
export function useSurfaceDepth(options: { floating?: boolean } = {}): SurfaceDepthState {
  const parent = useContext(SurfaceDepthContext)
  return computeSurfaceDepth(parent, options.floating)
}

export interface SurfaceDepthScopeProps {
  /** The state returned by `useSurfaceDepth()` for the surface that owns these children. */
  state: SurfaceDepthState
  children?: React.ReactNode
}

/** Makes `state.depth` the parent depth for the children of a surface. */
export function SurfaceDepthScope({ state, children }: SurfaceDepthScopeProps) {
  const value = useMemo<SurfaceDepthContextValue>(
    () => (state.enabled ? { enabled: true, depth: state.depth } : DISABLED),
    [state.enabled, state.depth],
  )
  return <SurfaceDepthContext.Provider value={value}>{children}</SurfaceDepthContext.Provider>
}

/**
 * Border radius for a surface: the depth token when depth styling is on, otherwise the
 * surface's existing (legacy) radius, so surfaces without a provider look unchanged.
 */
export function resolveSurfaceRadius(state: SurfaceDepthState, legacyRadius: string): string {
  return state.enabled && state.level ? `var(--ig-depth-${state.level}-radius)` : legacyRadius
}

/** `data-ig-depth` attribute for automation and hierarchy checks; omitted when disabled. */
export function surfaceDepthAttributes(state: SurfaceDepthState): { 'data-ig-depth'?: number } {
  return state.enabled ? { 'data-ig-depth': state.depth } : {}
}
