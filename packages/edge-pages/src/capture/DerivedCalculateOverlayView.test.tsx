import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DerivedCalculateOverlayView } from './DerivedCalculateOverlayView'

describe('DerivedCalculateOverlayView', () => {
  it('keeps the running action name free of decorative spinner text', () => {
    render(<DerivedCalculateOverlayView state="running" labels={{ calculate: 'Calculate', calculating: 'Calculating simulation' }} onCalculate={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Calculating simulation' })).toBeDisabled()
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
  })
})
