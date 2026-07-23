import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ClassManageImageGrid } from './ClassManageImageGrid'

vi.mock('@ingradient/ui/components', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

vi.mock('@ingradient/ui/patterns', () => ({
  AnnotationOverlay: () => null,
  ImageGrid: ({ layout }: { layout?: { minWidth?: number; fixedWidth?: boolean; aspectRatio?: string } }) => (
    <div
      data-testid="class-image-grid"
      data-min-width={layout?.minWidth}
      data-fixed-width={layout?.fixedWidth}
      data-aspect-ratio={layout?.aspectRatio}
    />
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
})
