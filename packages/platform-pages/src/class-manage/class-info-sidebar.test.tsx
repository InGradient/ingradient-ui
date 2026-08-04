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

    expect(screen.getByRole('heading', { name: 'Name', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Description', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reference Image', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Model Mapping', level: 2 })).toBeInTheDocument()
    expect(screen.queryByText('Danger zone')).not.toBeInTheDocument()
  })
})
