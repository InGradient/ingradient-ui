import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CaptureTabView } from './CaptureTabView'

const labels = {
  title: 'Capture', aiModeLabel: 'AI mode', aiModeDesc: 'Predict phase from one pattern',
  classicHint: 'Use phase shifting', aiSection: 'AI capture', aiPattern: 'Pattern',
  aiPatternHint: 'Model-matched pitch', aiFallback: 'When unavailable', capturingHint: 'Locked while capturing',
}
const options = [{ value: 'grid', label: 'Grid' }]
const fallbacks = [{ value: 'classic', label: 'Switch to phase shifting' }, { value: 'stop', label: 'Stop and notify', hint: 'Stops the sequence' }]

describe('CaptureTabView', () => {
  it('names its controls and reveals the classic-mode explanation when disabled', () => {
    const toggle = vi.fn()
    const { rerender } = render(<CaptureTabView aiEnabled aiPattern="grid" patternOptions={options}
      aiFallback="classic" fallbackOptions={fallbacks} isCapturing={false} labels={labels}
      onToggleAi={toggle} onChangePattern={vi.fn()} onChangeFallback={vi.fn()} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'AI mode' }))
    expect(toggle).toHaveBeenCalledWith(false)
    rerender(<CaptureTabView aiEnabled={false} aiPattern="grid" patternOptions={options}
      aiFallback="classic" fallbackOptions={fallbacks} isCapturing={false} labels={labels}
      onToggleAi={toggle} onChangePattern={vi.fn()} onChangeFallback={vi.fn()} />)
    expect(screen.getByText('Use phase shifting')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'When unavailable' })).not.toBeInTheDocument()
  })

  it('prevents capture-time setting changes without hiding the selected values', () => {
    const toggle = vi.fn()
    render(<CaptureTabView aiEnabled aiPattern="grid" patternOptions={options}
      aiFallback="classic" fallbackOptions={fallbacks} isCapturing labels={labels}
      onToggleAi={toggle} onChangePattern={vi.fn()} onChangeFallback={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: 'AI mode' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pattern' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'When unavailable' })).toBeDisabled()
    expect(screen.getByText('Locked while capturing')).toBeVisible()
  })
})
