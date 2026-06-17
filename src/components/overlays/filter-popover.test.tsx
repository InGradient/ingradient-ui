import { describe, it, expect, vi } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { FilterPopover } from './filter-popover'
import { FilterPopoverSection } from './filter-popover-section'

describe('FilterPopover', () => {
  it('renders children', () => {
    render(
      <FilterPopover>
        <div data-testid="content">filter body</div>
      </FilterPopover>,
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('uses fixed positioning + anchor coords when anchor is supplied', () => {
    render(
      <FilterPopover anchor={{ top: 120, left: 240 }} data-testid="pop">
        anchored
      </FilterPopover>,
    )
    const el = screen.getByTestId('pop')
    expect(el.style.position).toBe('fixed')
    expect(el.style.top).toBe('120px')
    expect(el.style.left).toBe('240px')
  })

  it('omits positioning style when no anchor is supplied', () => {
    render(<FilterPopover data-testid="pop">no anchor</FilterPopover>)
    const el = screen.getByTestId('pop')
    expect(el.style.position).toBe('')
    expect(el.style.top).toBe('')
    expect(el.style.left).toBe('')
  })

  it('preserves caller-supplied style alongside anchor positioning', () => {
    render(
      <FilterPopover
        anchor={{ top: 50, left: 80 }}
        style={{ background: 'red' }}
        data-testid="pop"
      >
        anchored + bg
      </FilterPopover>,
    )
    const el = screen.getByTestId('pop')
    expect(el.style.position).toBe('fixed')
    expect(el.style.background).toBe('red')
  })

  it('forwards ref to the root div', () => {
    const ref = createRef<HTMLDivElement>()
    render(<FilterPopover ref={ref}>body</FilterPopover>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes through native attributes (e.g. onClick)', () => {
    const onClick = vi.fn()
    render(
      <FilterPopover onClick={onClick} data-testid="pop">
        click target
      </FilterPopover>,
    )
    screen.getByTestId('pop').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('FilterPopoverSection', () => {
  it('renders title and children', () => {
    render(
      <FilterPopoverSection title="Tags">
        <div data-testid="body">tag list</div>
      </FilterPopoverSection>,
    )
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByTestId('body')).toBeInTheDocument()
  })

  it('renders the actions slot when supplied', () => {
    render(
      <FilterPopoverSection
        title="Tags"
        actions={<button data-testid="reset">Reset</button>}
      >
        body
      </FilterPopoverSection>,
    )
    expect(screen.getByTestId('reset')).toBeInTheDocument()
  })

  it('does not render the actions container content when actions is omitted', () => {
    render(<FilterPopoverSection title="Plain">body</FilterPopoverSection>)
    expect(screen.queryByTestId('reset')).not.toBeInTheDocument()
  })
})
