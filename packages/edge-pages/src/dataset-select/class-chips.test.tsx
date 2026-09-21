import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServerStyleSheet } from 'styled-components'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderClassChips } from './class-chips'
import { edgeTaskTagStyle } from './dataset-card.styles'

describe('dataset class chips', () => {
  it('uses the readable accent foreground for compact detection task tags', () => {
    expect(edgeTaskTagStyle('object_detection')).toEqual({
      bg: 'var(--ig-color-blue-tint-15)', color: 'var(--ig-color-accent-soft)',
    })
  })
  it('uses semantic readable text while retaining class-colored surfaces and swatches', () => {
    const sheet = new ServerStyleSheet()
    try {
      renderToStaticMarkup(sheet.collectStyles(renderClassChips([{ name: 'Defect', color: '#164e63' }], 'No classes')))
      const css = sheet.getStyleTags()
      expect(css).toContain('color:var(--ig-color-text-primary)')
      expect(css).not.toContain('color:#164e63;')
      expect(css).toContain('background:#164e6322')
      expect(css).toContain('solid #164e6344')
      expect(css).toContain('background:#164e63;')
    } finally {
      sheet.seal()
    }
  })

  it('preserves class names and overflow counts', () => {
    render(<>{renderClassChips(['One', 'Two', 'Three', 'Four'].map(name => ({ name, color: '#164e63' })), 'No classes')}</>)
    for (const name of ['One', 'Two', 'Three', '+1']) expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.queryByText('Four')).not.toBeInTheDocument()
  })

  it('preserves the empty label', () => {
    render(<>{renderClassChips(undefined, 'No classes')}</>)
    expect(screen.getByText('No classes')).toBeInTheDocument()
  })
})
