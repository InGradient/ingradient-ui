import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ClassInfoSidebar } from './class-info-sidebar'

describe('ClassInfoSidebar', () => {
  it('uses catalog-style property sections without a danger zone', () => {
    render(
      <ClassInfoSidebar
        selectedClass={{ id: 'c-1', name: 'Crack', color: '#ef4444' }}
        referenceImageSlot={<span>Reference content</span>}
        mappingSlot={<span>Mapping content</span>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Description' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reference Image' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Model Mapping' })).toBeInTheDocument()
    expect(screen.queryByText('Danger zone')).not.toBeInTheDocument()
  })
})
