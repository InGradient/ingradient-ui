import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StorageOverview } from './storage-overview'

describe('StorageOverview', () => {
  it('renders metric labels and values on separate block lines', () => {
    render(<StorageOverview items={[{ label: 'Total Images', value: '128,402' }]} />)

    expect(screen.getByText('Total Images').tagName).toBe('DIV')
    expect(screen.getByText('128,402').tagName).toBe('DIV')
  })
})
