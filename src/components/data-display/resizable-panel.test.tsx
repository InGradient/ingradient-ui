import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResizablePanel } from './resizable-panel'

describe('ResizablePanel', () => {
  it('renders two children panels', () => {
    render(
      <ResizablePanel>
        <div>Left</div>
        <div>Right</div>
      </ResizablePanel>,
    )
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('renders with vertical direction', () => {
    render(
      <ResizablePanel direction="vertical">
        <div>Top</div>
        <div>Bottom</div>
      </ResizablePanel>,
    )
    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Bottom')).toBeInTheDocument()
  })
})
