import React from 'react'
import styled from 'styled-components'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SurfaceDepthProvider } from '../primitives'
import { Card } from './data-display/card'
import { SectionPanel } from './data-display/layout'
import { ModalCard } from './overlays/modal-primitives'
import { Menu, PopoverCard } from './overlays/popovers'

// Tests run in order and styled-components keeps injected rules for the whole file,
// so the "no provider" check runs before any provider renders a depth rule.

const allCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map((s) => s.textContent ?? '')
    .join('\n')
    .replace(/\s/g, '')

const Overridden = styled(SectionPanel)`
  border-radius: 3px;
`

describe('depth-aware shared surfaces', () => {
  it('adds no depth rule and no depth attribute without a provider', () => {
    render(
      <ModalCard data-testid="modal">
        <SectionPanel data-testid="section">
          <Card data-testid="card">content</Card>
        </SectionPanel>
      </ModalCard>,
    )
    expect(allCss()).not.toContain('var(--ig-depth-')
    for (const id of ['modal', 'section', 'card']) expect(screen.getByTestId(id).hasAttribute('data-ig-depth')).toBe(false)
    // Legacy radii are still the ones in use.
    expect(allCss()).toContain('border-radius:var(--ig-radius-4xl)')
    expect(allCss()).toContain('border-radius:var(--ig-radius-xl)')
    expect(allCss()).toContain('border-radius:var(--ig-radius-lg)')
  })

  it('assigns depth 1, 2, 3 to nested shared surfaces under a provider', () => {
    render(
      <SurfaceDepthProvider>
        <ModalCard data-testid="modal">
          <SectionPanel data-testid="section">
            <Card data-testid="card">content</Card>
          </SectionPanel>
        </ModalCard>
      </SurfaceDepthProvider>,
    )
    expect(screen.getByTestId('modal').getAttribute('data-ig-depth')).toBe('1')
    expect(screen.getByTestId('section').getAttribute('data-ig-depth')).toBe('2')
    expect(screen.getByTestId('card').getAttribute('data-ig-depth')).toBe('3')
    // The depth rule must actually win over each surface's own legacy radius.
    expect(getComputedStyle(screen.getByTestId('modal')).borderRadius).toBe('var(--ig-depth-1-radius)')
    expect(getComputedStyle(screen.getByTestId('section')).borderRadius).toBe('var(--ig-depth-2-radius)')
    expect(getComputedStyle(screen.getByTestId('card')).borderRadius).toBe('var(--ig-depth-3-radius)')
    const css = allCss()
    expect(css).toContain('border-radius:var(--ig-depth-1-radius)')
    expect(css).toContain('border-radius:var(--ig-depth-2-radius)')
    expect(css).toContain('border-radius:var(--ig-depth-3-radius)')
  })

  it('restarts floating menus and popovers at depth 1 inside a modal', () => {
    render(
      <SurfaceDepthProvider>
        <ModalCard>
          <SectionPanel>
            <Menu data-testid="menu" />
            <PopoverCard data-testid="popover" />
          </SectionPanel>
        </ModalCard>
      </SurfaceDepthProvider>,
    )
    expect(screen.getByTestId('menu').getAttribute('data-ig-depth')).toBe('1')
    expect(screen.getByTestId('popover').getAttribute('data-ig-depth')).toBe('1')
  })

  it('lets an explicit styled() override and an explicit Card radius win', () => {
    render(
      <SurfaceDepthProvider>
        <Overridden data-testid="overridden">
          <Card data-testid="explicit" radius="var(--ig-radius-2xs)">content</Card>
        </Overridden>
      </SurfaceDepthProvider>,
    )
    const overridden = screen.getByTestId('overridden')
    expect(overridden.getAttribute('data-ig-depth')).toBe('1')
    expect(getComputedStyle(overridden).borderRadius).toBe('3px')
    const explicit = screen.getByTestId('explicit')
    expect(explicit.getAttribute('data-ig-depth')).toBe('2')
    expect(getComputedStyle(explicit).borderRadius).toBe('var(--ig-radius-2xs)')
  })
})
