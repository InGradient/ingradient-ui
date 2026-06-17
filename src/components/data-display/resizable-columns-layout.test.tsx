import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResizableColumnsLayout } from './resizable-columns-layout'

describe('ResizableColumnsLayout', () => {
  it('does not render hidden column content', () => {
    render(
      <ResizableColumnsLayout
        columns={[
          { width: 200, hidden: true },
          { width: 'auto' },
        ]}
      >
        <div>Left sidebar</div>
        <div>Body</div>
      </ResizableColumnsLayout>,
    )

    expect(screen.queryByText('Left sidebar')).not.toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})
