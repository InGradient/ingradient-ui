import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardView } from './DashboardView'

describe('DashboardView', () => {
  it('resolves date presets against the supplied reference date', () => {
    const onChangeDraft = vi.fn()
    const onSelectPreset = vi.fn()

    render(
      <DashboardView
        onSavePdf={vi.fn()}
        customize={{
          open: false,
          onToggle: vi.fn(),
          items: [],
          visibility: {},
          onToggleItem: vi.fn(),
        }}
        state="no-project"
        dateLabel="All time"
        onResetLayout={vi.fn()}
        dateRange={{
          open: true,
          onToggle: vi.fn(),
          draft: undefined,
          onChangeDraft,
          onSelectPreset,
          referenceDate: new Date(2026, 4, 14),
          onReset: vi.fn(),
          onApply: vi.fn(),
          summaryLabel: 'All time',
        }}
        widgets={{ layout: [], widgets: {} }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Last 7 days' }))

    expect(onSelectPreset).toHaveBeenCalledWith('last7')
    expect(onChangeDraft).toHaveBeenCalledWith({
      from: new Date(2026, 4, 8),
      to: new Date(2026, 4, 14),
    })
  })
})
