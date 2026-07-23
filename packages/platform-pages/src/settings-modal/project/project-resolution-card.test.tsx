import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProjectResolutionCard } from './project-resolution-card'

describe('ProjectResolutionCard', () => {
  it('keeps the project title and metadata on separate block lines', () => {
    render(
      <ProjectResolutionCard
        project={{
          project_id: 'project-1',
          project_name: 'Wafer line A',
          role: 'owner',
          member_count: 2,
          transfer_candidates: [],
        }}
        resolution={{ action: 'delete_project' }}
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Wafer line A').tagName).toBe('DIV')
    expect(screen.getByText(/role: owner/).tagName).toBe('DIV')
  })
})
