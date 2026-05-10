import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepIndicator } from './step-indicator'
import type { StepItem } from './step-indicator'

const items: StepItem[] = [
  { label: 'Connect device', status: 'done' },
  { label: 'Validate firmware', status: 'running' },
  { label: 'Sync settings', status: 'pending' },
  { label: 'Verify integrity', status: 'error' },
]

describe('StepIndicator', () => {
  it('renders one row per item with role=listitem', () => {
    render(<StepIndicator items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('exposes the container as role=list', () => {
    render(<StepIndicator items={items} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('shows each item label', () => {
    render(<StepIndicator items={items} />)
    expect(screen.getByText('Connect device')).toBeInTheDocument()
    expect(screen.getByText('Validate firmware')).toBeInTheDocument()
    expect(screen.getByText('Sync settings')).toBeInTheDocument()
    expect(screen.getByText('Verify integrity')).toBeInTheDocument()
  })

  it('falls back to ellipsis label when item.label is empty', () => {
    render(<StepIndicator items={[{ label: '', status: 'pending' }]} />)
    expect(screen.getByText('…')).toBeInTheDocument()
  })

  it('renders zero rows for empty items', () => {
    render(<StepIndicator items={[]} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
