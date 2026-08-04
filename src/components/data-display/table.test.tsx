import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Table, type TableColumn } from './table'

interface WorkerRow {
  workerId: string
  name: string
  completed: number
}

const columns: TableColumn<WorkerRow>[] = [
  { key: 'name', header: 'Worker', render: (row) => row.name },
  { key: 'completed', header: 'Completed', numeric: true, render: (row) => row.completed },
]

describe('Table', () => {
  it('names intentionally empty column headers for assistive technology', () => {
    render(
      <Table
        columns={[
          { key: 'select', header: '', headerAriaLabel: 'Select rows', render: () => null },
        ]}
        rows={[]}
      />,
    )

    expect(screen.getByRole('columnheader', { name: 'Select rows' })).toBeInTheDocument()
  })

  it('supports rows without an id field when a row key resolver is supplied', () => {
    render(
      <Table
        columns={columns}
        rows={[{ workerId: 'worker-1', name: 'June Lee', completed: 12 }]}
        getRowKey={(row) => row.workerId}
      />,
    )

    expect(screen.getByRole('cell', { name: 'June Lee' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '12' })).toBeInTheDocument()
  })
})
