import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CatalogShell } from './catalog-shell'

describe('CatalogShell', () => {
  it('does not render left sidebar content while collapsed', () => {
    render(
      <CatalogShell
        sidebarCollapsed
        leftSidebar={<div>Left sidebar</div>}
        body={<div>Body</div>}
      />,
    )

    expect(screen.queryByText('Left sidebar')).not.toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})
