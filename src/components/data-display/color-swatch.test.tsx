import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ColorSwatch } from './color-swatch'

describe('ColorSwatch', () => {
  it('renders with given color', () => {
    const { container } = render(<ColorSwatch $color="#ff0000" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('accepts $size prop', () => {
    const { container } = render(<ColorSwatch $color="#00f" $size="md" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('accepts $shape=square', () => {
    const { container } = render(<ColorSwatch $color="#0f0" $shape="square" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
