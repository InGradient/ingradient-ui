import React from 'react'
import { createPortal } from 'react-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderTokensCss } from '../../tokens'
import {
  MAX_SURFACE_DEPTH,
  SurfaceDepthProvider,
  SurfaceDepthScope,
  SurfaceRegion,
  computeSurfaceDepth,
  resolveSurfaceRadius,
  surfaceDepthAttributes,
  useSurfaceDepth,
} from './surface-depth'

function TestSurface({ name, floating, children }: { name: string; floating?: boolean; children?: React.ReactNode }) {
  const state = useSurfaceDepth({ floating })
  return (
    <div
      data-testid={name}
      data-radius={resolveSurfaceRadius(state, 'var(--ig-radius-xl)')}
      {...surfaceDepthAttributes(state)}
    >
      <SurfaceDepthScope state={state}>{children}</SurfaceDepthScope>
    </div>
  )
}

const radiusOf = (name: string) => screen.getByTestId(name).getAttribute('data-radius')
const depthOf = (name: string) => screen.getByTestId(name).getAttribute('data-ig-depth')

describe('surface depth', () => {
  it('keeps the legacy radius and adds no depth attribute without a provider', () => {
    render(
      <TestSurface name="outer">
        <TestSurface name="inner" />
      </TestSurface>,
    )
    expect(radiusOf('outer')).toBe('var(--ig-radius-xl)')
    expect(radiusOf('inner')).toBe('var(--ig-radius-xl)')
    expect(depthOf('outer')).toBeNull()
  })

  it('gives each nested surface the next depth and a smaller radius token', () => {
    render(
      <SurfaceDepthProvider>
        <TestSurface name="d1">
          <TestSurface name="d2">
            <TestSurface name="d3" />
          </TestSurface>
        </TestSurface>
      </SurfaceDepthProvider>,
    )
    expect([depthOf('d1'), depthOf('d2'), depthOf('d3')]).toEqual(['1', '2', '3'])
    expect([radiusOf('d1'), radiusOf('d2'), radiusOf('d3')]).toEqual([
      'var(--ig-depth-1-radius)',
      'var(--ig-depth-2-radius)',
      'var(--ig-depth-3-radius)',
    ])
  })

  it('clamps the radius at the maximum depth but keeps the raw depth for checks', () => {
    render(
      <SurfaceDepthProvider>
        <TestSurface name="d1">
          <TestSurface name="d2">
            <TestSurface name="d3">
              <TestSurface name="d4" />
            </TestSurface>
          </TestSurface>
        </TestSurface>
      </SurfaceDepthProvider>,
    )
    expect(depthOf('d4')).toBe('4')
    expect(radiusOf('d4')).toBe(`var(--ig-depth-${MAX_SURFACE_DEPTH}-radius)`)
  })

  it('restarts floating surfaces at depth 1 wherever they open', () => {
    render(
      <SurfaceDepthProvider>
        <TestSurface name="page">
          <TestSurface name="card">
            <TestSurface name="menu" floating>
              <TestSurface name="menu-section" />
            </TestSurface>
          </TestSurface>
        </TestSurface>
      </SurfaceDepthProvider>,
    )
    expect(depthOf('card')).toBe('2')
    expect(depthOf('menu')).toBe('1')
    expect(depthOf('menu-section')).toBe('2')
  })

  it('carries depth across a portal, which CSS inheritance cannot do', () => {
    render(
      <SurfaceDepthProvider>
        <TestSurface name="modal" floating>
          {createPortal(<TestSurface name="portaled" />, document.body)}
        </TestSurface>
      </SurfaceDepthProvider>,
    )
    expect(depthOf('portaled')).toBe('2')
  })

  it('counts a flush region as one level without drawing anything', () => {
    render(
      <SurfaceDepthProvider>
        <SurfaceRegion>
          <TestSurface name="card">
            <TestSurface name="inner" />
          </TestSurface>
        </SurfaceRegion>
      </SurfaceDepthProvider>,
    )
    expect(depthOf('card')).toBe('2')
    expect(depthOf('inner')).toBe('3')
  })

  it('turns off for a subtree when the provider is disabled', () => {
    render(
      <SurfaceDepthProvider enabled={false}>
        <TestSurface name="off" />
      </SurfaceDepthProvider>,
    )
    expect(radiusOf('off')).toBe('var(--ig-radius-xl)')
    expect(depthOf('off')).toBeNull()
  })

  it('computes depth without React', () => {
    expect(computeSurfaceDepth({ enabled: false, depth: 0 })).toEqual({ enabled: false, depth: 0, level: undefined })
    expect(computeSurfaceDepth({ enabled: true, depth: 2 })).toEqual({ enabled: true, depth: 3, level: 3 })
    expect(computeSurfaceDepth({ enabled: true, depth: 5 }, true)).toEqual({ enabled: true, depth: 1, level: 1 })
  })

  it('emits the depth radius CSS variables', () => {
    const css = renderTokensCss().replace(/\s/g, '')
    expect(css).toContain('--ig-depth-1-radius:16px')
    expect(css).toContain('--ig-depth-2-radius:12px')
    expect(css).toContain('--ig-depth-3-radius:8px')
  })
})
