import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LicenseInfoDisplay } from './license-info-display'

describe('LicenseInfoDisplay', () => {
  it('uses English default copy for personal licenses', () => {
    render(
      <LicenseInfoDisplay
        license={{
          type: 'personal',
          expiresAt: '2026-08-30',
          remainingDays: 107,
          expired: false,
        }}
      />,
    )

    expect(screen.getByText('Personal license | Expires: 2026-08-30 (107 days remaining)')).toBeInTheDocument()
  })

  it('uses English default copy for loading and expired states', () => {
    const { rerender } = render(<LicenseInfoDisplay license={null} />)
    expect(screen.getByText('Loading license information…')).toBeInTheDocument()

    rerender(
      <LicenseInfoDisplay
        license={{
          type: 'personal',
          expiresAt: '2026-01-01',
          remainingDays: 0,
          expired: true,
        }}
      />,
    )
    expect(screen.getByText('Expired')).toBeInTheDocument()
  })
})
