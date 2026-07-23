import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardOverviewPanel } from './dashboard-overview-panel'

describe('DashboardOverviewPanel', () => {
  it('does not nest the loading layout inside a paragraph', () => {
    const { container } = render(
      <DashboardOverviewPanel dateLabel="All time" state="loading" />,
    )

    expect(container.querySelector('p > div')).not.toBeInTheDocument()
  })
})
