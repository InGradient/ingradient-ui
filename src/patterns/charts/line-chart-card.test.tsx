import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LineChartCard } from './line-chart-card'

const data = [
  { month: 'Jan', sales: 100, cost: 60 },
  { month: 'Feb', sales: 120, cost: 70 },
  { month: 'Mar', sales: 90, cost: 55 },
]

const series = [
  { key: 'sales', label: 'Sales' },
  { key: 'cost', label: 'Cost' },
]

describe('LineChartCard', () => {
  it('renders chart title', () => {
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })

  it('does not render data table when onPointClick is not provided', () => {
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" />)
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('renders visually-hidden data table when onPointClick is provided', () => {
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" onPointClick={() => {}} />)
    expect(screen.getByRole('table', { name: /revenue data — enter on a row to select/i })).toBeInTheDocument()
  })

  it('data table has column headers from series labels', () => {
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" onPointClick={() => {}} />)
    expect(screen.getByRole('columnheader', { name: 'month' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Sales' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Cost' })).toBeInTheDocument()
  })

  it('calls onPointClick on Enter keydown', () => {
    const onPointClick = vi.fn()
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" onPointClick={onPointClick} />)
    const rows = screen.getAllByRole('row')
    // Skip header row (index 0), test first data row (index 1)
    fireEvent.keyDown(rows[1], { key: 'Enter' })
    expect(onPointClick).toHaveBeenCalledWith(data[0], 0)
  })

  it('calls onPointClick on Space keydown', () => {
    const onPointClick = vi.fn()
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" onPointClick={onPointClick} />)
    const rows = screen.getAllByRole('row')
    fireEvent.keyDown(rows[2], { key: ' ' })
    expect(onPointClick).toHaveBeenCalledWith(data[1], 1)
  })

  it('data table rows are keyboard-focusable', () => {
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" onPointClick={() => {}} />)
    const rows = screen.getAllByRole('row')
    // Data rows (not header) should have tabindex=0
    expect(rows[1]).toHaveAttribute('tabindex', '0')
    expect(rows[2]).toHaveAttribute('tabindex', '0')
    expect(rows[3]).toHaveAttribute('tabindex', '0')
  })

  it('does not render data table when loading', () => {
    render(<LineChartCard title="Revenue" data={data} series={series} xKey="month" onPointClick={() => {}} loading />)
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('does not render data table when data is empty', () => {
    render(<LineChartCard title="Revenue" data={[]} series={series} xKey="month" onPointClick={() => {}} />)
    expect(screen.queryByRole('table')).toBeNull()
  })
})