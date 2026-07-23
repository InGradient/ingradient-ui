import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ClassManageOverlays } from './ClassManageOverlays'
import type { ClassManageOverlaysProps } from './types'

const closedOverlays: ClassManageOverlaysProps = {
  addClass: {
    open: false,
    name: '',
    onNameChange: vi.fn(),
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  },
  contextMenu: {
    position: null,
    onClose: vi.fn(),
  },
  lightbox: {
    image: null,
    siblings: [],
    selectedClassId: null,
    classIdToColor: {},
    onClose: vi.fn(),
  },
  deleteConfirm: {
    open: false,
    selectedClass: null,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  },
}

describe('ClassManageOverlays', () => {
  it('preserves the Add Class dialog title from the Platform 0.0.1 reference', () => {
    render(
      <ClassManageOverlays
        {...closedOverlays}
        addClass={{ ...closedOverlays.addClass, open: true }}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Add Class' })).toBeInTheDocument()
  })
})
