import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageGrid } from './image-grid'

type Item = { id: string; name: string }

const items: Item[] = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Bravo' },
  { id: 'c', name: 'Charlie' },
]

const getThumb = (item: Item) => `thumb://${item.id}`

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  // jsdom 에 IntersectionObserver 가 없음 — minimal mock
  ;(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }))
})

describe('ImageGrid', () => {
  it('renders an img per item with the resolved thumbnail url', () => {
    const { container } = render(<ImageGrid items={items} getThumbnailUrl={getThumb} />)
    const imgs = container.querySelectorAll('img')
    expect(imgs).toHaveLength(3)
    expect(imgs[0].getAttribute('src')).toBe('thumb://a')
  })

  it('marks each cell with data-grid-id for highlightedId targeting', () => {
    const { container } = render(<ImageGrid items={items} getThumbnailUrl={getThumb} />)
    expect(container.querySelector('[data-grid-id="a"]')).not.toBeNull()
    expect(container.querySelector('[data-grid-id="b"]')).not.toBeNull()
  })

  it('calls onItemClick with item, index, and event on cell click', () => {
    const onItemClick = vi.fn()
    const { container } = render(
      <ImageGrid items={items} getThumbnailUrl={getThumb} onItemClick={onItemClick} />,
    )
    const cell = container.querySelector('[data-grid-id="b"]') as HTMLElement
    fireEvent.click(cell)
    expect(onItemClick).toHaveBeenCalledTimes(1)
    expect(onItemClick.mock.calls[0][0]).toEqual(items[1])
    expect(onItemClick.mock.calls[0][1]).toBe(1)
  })

  it('classifies selection action from modifier keys', () => {
    const onSelectionChange = vi.fn()
    const { container } = render(
      <ImageGrid items={items} getThumbnailUrl={getThumb} onSelectionChange={onSelectionChange} />,
    )
    const cellA = container.querySelector('[data-grid-id="a"]') as HTMLElement
    fireEvent.click(cellA)
    fireEvent.click(cellA, { ctrlKey: true })
    fireEvent.click(cellA, { shiftKey: true })
    expect(onSelectionChange.mock.calls.map((c) => c[0])).toEqual(['single', 'toggle', 'range'])
  })

  it('renders content from renderCellOverlay / Footer / TopRight slots', () => {
    render(
      <ImageGrid
        items={items}
        getThumbnailUrl={getThumb}
        renderCellOverlay={(it) => <span>overlay-{it.id}</span>}
        renderCellFooter={(it) => <span>footer-{it.name}</span>}
        renderCellTopRight={(it) => <span>tr-{it.id}</span>}
      />,
    )
    expect(screen.getByText('overlay-a')).toBeInTheDocument()
    expect(screen.getByText('footer-Alpha')).toBeInTheDocument()
    expect(screen.getByText('tr-c')).toBeInTheDocument()
  })

  it('scrollIntoView on the highlighted cell when highlightedId changes', () => {
    const spy = vi.mocked(Element.prototype.scrollIntoView)
    spy.mockClear()
    render(<ImageGrid items={items} getThumbnailUrl={getThumb} highlightedId="b" />)
    expect(spy).toHaveBeenCalled()
  })

  it('forwards drag and contextmenu events with item + index', () => {
    const onDragStart = vi.fn()
    const onContextMenu = vi.fn()
    const { container } = render(
      <ImageGrid
        items={items}
        getThumbnailUrl={getThumb}
        onDragStart={onDragStart}
        onContextMenu={onContextMenu}
      />,
    )
    const cell = container.querySelector('[data-grid-id="c"]') as HTMLElement
    fireEvent.dragStart(cell)
    fireEvent.contextMenu(cell)
    expect(onDragStart.mock.calls[0][1]).toBe(2)
    expect(onContextMenu.mock.calls[0][1]).toBe(2)
  })

  it('forwards mouse enter / leave callbacks', () => {
    const onCellMouseEnter = vi.fn()
    const onCellMouseLeave = vi.fn()
    const { container } = render(
      <ImageGrid
        items={items}
        getThumbnailUrl={getThumb}
        onCellMouseEnter={onCellMouseEnter}
        onCellMouseLeave={onCellMouseLeave}
      />,
    )
    const cell = container.querySelector('[data-grid-id="a"]') as HTMLElement
    fireEvent.mouseEnter(cell)
    fireEvent.mouseLeave(cell)
    expect(onCellMouseEnter).toHaveBeenCalled()
    expect(onCellMouseLeave).toHaveBeenCalled()
  })

  it('supports fixed-width 4:3 cells for migrated galleries', () => {
    const { container } = render(
      <ImageGrid
        items={items}
        getThumbnailUrl={getThumb}
        layout={{ minWidth: 140, fixedWidth: true, aspectRatio: '4/3' }}
      />,
    )
    const cell = container.querySelector('[data-grid-id="a"]') as HTMLElement
    const imageFrame = cell.querySelector('img')?.parentElement as HTMLElement
    const grid = cell.parentElement as HTMLElement

    expect(getComputedStyle(grid).gridTemplateColumns).toBe('repeat(auto-fill, 140px)')
    expect(getComputedStyle(imageFrame).aspectRatio).toBe('4/3')
  })
})
