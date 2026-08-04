import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ClassManageImageGrid } from './ClassManageImageGrid'

vi.mock('@ingradient/ui/components', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

vi.mock('@ingradient/ui/patterns', () => ({
  AnnotationOverlay: () => null,
  ImageGrid: ({
    items,
    layout,
    renderCellTopRight,
  }: {
    items: Array<{ id: string }>
    layout?: { minWidth?: number; fixedWidth?: boolean; aspectRatio?: string }
    renderCellTopRight?: (item: never) => ReactNode
  }) => (
    <div
      data-testid="class-image-grid"
      data-min-width={layout?.minWidth}
      data-fixed-width={layout?.fixedWidth}
      data-aspect-ratio={layout?.aspectRatio}
    >
      {items.map((item) => <div key={item.id}>{renderCellTopRight?.(item as never)}</div>)}
    </div>
  ),
}))

describe('ClassManageImageGrid', () => {
  it('passes the original numeric 140px minimum width so the class gallery keeps five desktop columns', () => {
    render(
      <ClassManageImageGrid
        images={[]}
        selectedClassId="class-1"
        classIdToColor={{}}
        onOpenImage={vi.fn()}
        onOpenContextMenu={vi.fn()}
      />,
    )

    expect(screen.getByTestId('class-image-grid')).toHaveAttribute('data-min-width', '140')
    expect(screen.getByTestId('class-image-grid')).toHaveAttribute('data-fixed-width', 'true')
    expect(screen.getByTestId('class-image-grid')).toHaveAttribute('data-aspect-ratio', '4/3')
  })

  it('shows the number of images that share each non-empty sequence', () => {
    const makeImage = (id: string, sequenceId?: string | null) => ({
      id,
      name: id,
      thumb_url: `/${id}.jpg`,
      width: 100,
      height: 75,
      sequence_id: sequenceId,
    })

    render(
      <ClassManageImageGrid
        images={[
          makeImage('image-1', 'sequence-a'),
          makeImage('image-2', 'sequence-a'),
          makeImage('image-3', 'sequence-a'),
          makeImage('image-4', null),
        ]}
        selectedClassId="class-1"
        classIdToColor={{}}
        onOpenImage={vi.fn()}
        onOpenContextMenu={vi.fn()}
      />,
    )

    expect(screen.getAllByText('3')).toHaveLength(3)
    expect(screen.queryByText('4')).not.toBeInTheDocument()
  })
})
