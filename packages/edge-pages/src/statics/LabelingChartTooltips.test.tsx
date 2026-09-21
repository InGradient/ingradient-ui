import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AvgSizeTooltip, TrendTooltip } from './LabelingChartTooltips'

describe('Labeling chart tooltip adapters', () => {
  it.each([undefined, [], [{ value: 0 }], [{ value: -1 }], [{ value: 'invalid' }], [{}]])('hides empty/nonpositive trend payload %j', (payload) => {
    const { container } = render(<TrendTooltip active label="Today" payload={payload} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('retains positive-only numeric conversion, numeric labels and class swatches', () => {
    const { container } = render(<TrendTooltip active label={0} payload={[
      { dataKey: 'positive', name: 'Defect', value: '12', color: 'red' },
      { dataKey: 'zero', name: 'Zero', value: 0, color: 'green' },
      { dataKey: 'other', name: 'Scratch', value: 2.5, color: 'blue' },
      { dataKey: 'fallback', name: 'Unknown', value: 1 },
    ]} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('2.5')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.queryByText('Zero')).not.toBeInTheDocument()
    const swatches = container.querySelectorAll('[aria-hidden]')
    expect(swatches).toHaveLength(3)
    expect(getComputedStyle(swatches[0]).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(getComputedStyle(swatches[1]).backgroundColor).toBe('rgb(0, 0, 255)')
  })
  it('preserves one-decimal px formatting and width/height labels including zero', () => {
    render(<AvgSizeTooltip active label={0} payload={[
      { dataKey: 'avg_w', value: '12.345' }, { dataKey: 'avg_h', value: 0 },
    ]} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Width')).toBeInTheDocument()
    expect(screen.getByText('Height')).toBeInTheDocument()
    expect(screen.getByText('12.3px')).toBeInTheDocument()
    expect(screen.getByText('0.0px')).toBeInTheDocument()
  })
  it.each([undefined, []])('hides empty average-size payload %j', (payload) => {
    const { container } = render(<AvgSizeTooltip active payload={payload} />)
    expect(container).toBeEmptyDOMElement()
  })
  it.each([TrendTooltip, AvgSizeTooltip])('hides inactive tooltips', (Tooltip) => {
    const { container } = render(<Tooltip active={false} payload={[{ value: 12 }]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
