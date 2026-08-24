import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as React from 'react'
import { Heading } from './heading'
import { H1, H2, H3, H4 } from './type-scale'

describe('Heading', () => {
  it('renders h1 for level=1', () => {
    const { container } = render(<Heading level={1}>Title</Heading>)
    const el = container.querySelector('h1')
    expect(el).not.toBeNull()
    expect(el?.tagName).toBe('H1')
    expect(el?.textContent).toBe('Title')
  })

  it('renders h2 for level=2 (default)', () => {
    const { container } = render(<Heading>Section</Heading>)
    const el = container.querySelector('h2')
    expect(el).not.toBeNull()
    expect(el?.tagName).toBe('H2')
  })

  it('renders h3 for level=3', () => {
    const { container } = render(<Heading level={3}>Subsection</Heading>)
    expect(container.querySelector('h3')?.tagName).toBe('H3')
  })

  it('renders h4 for level=4', () => {
    const { container } = render(<Heading level={4}>Block</Heading>)
    expect(container.querySelector('h4')?.tagName).toBe('H4')
  })

  it('does NOT shift heading level by one (regression for F-02)', () => {
    const { container } = render(<Heading level={1}>Test</Heading>)
    // Before fix: level=1 rendered h2. After fix: level=1 renders h1.
    expect(container.querySelector('h2')).toBeNull()
    expect(container.querySelector('h1')).not.toBeNull()
  })
})

describe('H1–H4 aliases', () => {
  it('H1 renders h1', () => {
    const { container } = render(<H1>Hero</H1>)
    expect(container.querySelector('h1')?.textContent).toBe('Hero')
  })

  it('H2 renders h2', () => {
    const { container } = render(<H2>Section</H2>)
    expect(container.querySelector('h2')?.textContent).toBe('Section')
  })

  it('H3 renders h3', () => {
    const { container } = render(<H3>Sub</H3>)
    expect(container.querySelector('h3')?.textContent).toBe('Sub')
  })

  it('H4 renders h4', () => {
    const { container } = render(<H4>Block</H4>)
    expect(container.querySelector('h4')?.textContent).toBe('Block')
  })

  it('H4 does NOT render h5 (regression for F-02)', () => {
    const { container } = render(<H4>Dialog Title</H4>)
    expect(container.querySelector('h5')).toBeNull()
    expect(container.querySelector('h4')).not.toBeNull()
  })
})