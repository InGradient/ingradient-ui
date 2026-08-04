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

  it('renders an opted-in divider inside the column boundary', () => {
    render(
      <ResizableColumnsLayout
        columns={[
          { width: 'auto' },
          { width: 320, dividerBefore: 'strong' },
        ]}
      >
        <div>Body</div>
        <aside>Right inspector</aside>
      </ResizableColumnsLayout>,
    )

    const rules = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules))
      .map((rule) => rule.cssText.replace(/\s/g, ''))

    expect(rules.some((rule) =>
      rule.includes('border-left:var(--ig-border-1px)solidvar(--ig-color-border-strong)'),
    )).toBe(true)
  })
})
