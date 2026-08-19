import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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

  it('keeps non-interactive rows out of the tab order', () => {
    const { container } = render(
      <Table
        columns={[{ key: 'name', header: 'Name', render: (row: WorkerRow) => row.name }]}
        rows={[{ workerId: 'worker-1', name: 'June Lee', completed: 12 }]}
      />,
    )

    expect(container.querySelector('tbody tr')).not.toHaveAttribute('tabindex')
  })

  it('activates a clickable row with Enter and Space', () => {
    const onRowClick = vi.fn()
    const rows = [{ workerId: 'worker-1', name: 'June Lee', completed: 12 }]
    const { container } = render(
      <Table
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.workerId}
        onRowClick={onRowClick}
        getRowAriaLabel={(row) => `Open worker ${row.name}`}
      />,
    )
    const row = container.querySelector('tbody tr') as HTMLTableRowElement

    expect(row).toHaveAttribute('tabindex', '0')
    expect(row).toHaveAttribute('aria-label', 'Open worker June Lee')

    fireEvent.keyDown(row, { key: 'Enter' })
    fireEvent.keyDown(row, { key: ' ' })

    expect(onRowClick).toHaveBeenCalledTimes(2)
    expect(onRowClick).toHaveBeenNthCalledWith(1, rows[0], 0)
    expect(onRowClick).toHaveBeenNthCalledWith(2, rows[0], 0)
  })

  it('does not re-activate a row for keyboard input owned by an inner control', () => {
    const onRowClick = vi.fn()
    render(
      <Table
        columns={[
          {
            key: 'select',
            header: 'Select',
            render: (row: WorkerRow) => <button type="button">Select {row.name}</button>,
          },
        ]}
        rows={[{ workerId: 'worker-1', name: 'June Lee', completed: 12 }]}
        getRowKey={(row) => row.workerId}
        onRowClick={onRowClick}
      />,
    )

    fireEvent.keyDown(screen.getByRole('button', { name: 'Select June Lee' }), { key: 'Enter' })

    expect(onRowClick).not.toHaveBeenCalled()
  })
})
