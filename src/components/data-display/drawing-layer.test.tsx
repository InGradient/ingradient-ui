import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DrawingLayer, type DrawingObject } from './drawing-layer'

const objects: DrawingObject[] = [
  { id: '1', type: 'rect', x: 0.1, y: 0.1, w: 0.3, h: 0.2, color: '#f00', label: 'Box' },
  { id: '2', type: 'point', x: 0.5, y: 0.5, color: '#0f0' },
]

describe('DrawingLayer', () => {
  it('renders SVG with objects', () => {
    const { container } = render(<DrawingLayer objects={objects} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    // rect + point
    expect(svg?.querySelectorAll('rect').length).toBeGreaterThanOrEqual(1)
    expect(svg?.querySelectorAll('circle').length).toBeGreaterThanOrEqual(1)
  })

  it('renders handles when selected', () => {
    const { container } = render(<DrawingLayer objects={objects} selectedId="1" showHandles />)
    // 4 corner handles + 1 point circle = 5 circles
    expect(container.querySelectorAll('circle').length).toBe(5)
  })

  it('renders labels when showLabels is true', () => {
    const { container } = render(<DrawingLayer objects={objects} showLabels />)
    expect(container.querySelector('text')?.textContent).toBe('Box')
  })

  it('renders drawing preview', () => {
    const { container } = render(
      <DrawingLayer objects={[]} drawingPreview={{ x: 0, y: 0, w: 0.5, h: 0.5 }} />,
    )
    // preview rect + no object rects
    expect(container.querySelectorAll('rect').length).toBe(1)
  })

  it('renders crosshair when enabled', () => {
    const { container } = render(
      <DrawingLayer objects={[]} showCrosshair cursorX={0.5} cursorY={0.5} />,
    )
    expect(container.querySelectorAll('line').length).toBe(2)
  })
})
