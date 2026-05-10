import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InfoRow, InfoRowLabel, InfoRowValue } from './info-row'

describe('InfoRow', () => {
  it('renders label and value content', () => {
    render(
      <InfoRow>
        <InfoRowLabel>Name</InfoRowLabel>
        <InfoRowValue>Acme Dataset</InfoRowValue>
      </InfoRow>,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Acme Dataset')).toBeInTheDocument()
  })

  it('renders multiple rows independently', () => {
    render(
      <>
        <InfoRow>
          <InfoRowLabel>Status</InfoRowLabel>
          <InfoRowValue>Connected</InfoRowValue>
        </InfoRow>
        <InfoRow>
          <InfoRowLabel>IP</InfoRowLabel>
          <InfoRowValue>192.168.1.10</InfoRowValue>
        </InfoRow>
      </>,
    )
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Connected')).toBeInTheDocument()
    expect(screen.getByText('IP')).toBeInTheDocument()
    expect(screen.getByText('192.168.1.10')).toBeInTheDocument()
  })

  it('forwards children as ReactNode (not just text)', () => {
    render(
      <InfoRow>
        <InfoRowLabel>Tags</InfoRowLabel>
        <InfoRowValue>
          <span data-testid="tag-a">tag-a</span>
          <span data-testid="tag-b">tag-b</span>
        </InfoRowValue>
      </InfoRow>,
    )
    expect(screen.getByTestId('tag-a')).toBeInTheDocument()
    expect(screen.getByTestId('tag-b')).toBeInTheDocument()
  })
})
