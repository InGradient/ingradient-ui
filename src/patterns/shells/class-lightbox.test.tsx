import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ClassLightbox } from './class-lightbox'

describe('ClassLightbox', () => {
  it('shows the labeled image and close button in the gallery detail shell', () => {
    const onClose = vi.fn()

    render(
      <ClassLightbox
        open
        item={{
          id: 'image-1',
          name: 'Example image',
          bboxes: [{ classId: 'class-1', x: 0.1, y: 0.1, w: 0.2, h: 0.2 }],
          points: [{ classId: 'class-1', x: 0.4, y: 0.5 }],
          pattern_label: 'x_phase_0_of_2',
        }}
        imageUrl="/example.jpg"
        selectedClassId="class-1"
        classIdToColor={{ 'class-1': '#ff0000' }}
        siblings={[{ id: 'image-2', pattern_label: 'x_phase_1_of_2' }]}
        onClose={onClose}
      />,
    )

    expect(screen.getByRole('img', { name: 'Example image' })).toHaveAttribute('src', '/example.jpg')
    expect(screen.queryByText('Image info')).not.toBeInTheDocument()
    expect(screen.queryByText('x_phase_0_of_2')).not.toBeInTheDocument()
    expect(document.querySelectorAll('rect')).toHaveLength(1)
    expect(document.querySelectorAll('circle')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
