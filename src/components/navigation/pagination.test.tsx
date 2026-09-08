import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('keeps the default landmark name', () => {
    render(<Pagination page={1} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })

  it('accepts a contextual landmark name when multiple paginations are present', () => {
    render(<Pagination page={1} totalPages={3} onChange={() => {}} ariaLabel="Search results pagination" />)
    expect(screen.getByRole('navigation', { name: 'Search results pagination' })).toBeInTheDocument()
  })
})
