import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DetailPanelSidebar } from './detail-panel-sidebar'

describe('DetailPanelSidebar', () => {
  it('keeps its scrollable body keyboard-focusable', () => {
    render(
      <DetailPanelSidebar
        headerSlot={<div>Header</div>}
        bodySectionTitle="Properties"
        bodySlot={<div>Long scrollable content</div>}
      />,
    )

    expect(screen.getByText('Properties').parentElement).toHaveAttribute('tabindex', '0')
  })
})
