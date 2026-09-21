import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BBoxCanvasView } from './BBoxCanvasView'
import { LABELING_BOXES, LABELING_LABELS, SYNTHETIC_CAPTURE } from '../../../../stories/pages/edge/0.0.5/workspace/capture-fixtures'

describe('BBoxCanvasView controlled class editing', () => {
  it('applies a pending class change to saved boxes and reports it once', async () => {
    const onBboxesChange = vi.fn()
    const onSave = vi.fn()
    const change = { bboxIdx: 0, classId: 'c2' }
    render(<BBoxCanvasView imageDataUrl={SYNTHETIC_CAPTURE} classes={[{ class_id: 'c1', class_name: 'One', color: 'var(--ig-color-danger)' }, { class_id: 'c2', class_name: 'Two', color: 'var(--ig-color-accent)' }]} selectedClassId="c2" editMode="cursor" initialBboxes={LABELING_BOXES} pendingClassChange={change} labels={LABELING_LABELS} onSave={onSave} onSkip={vi.fn()} onRetry={vi.fn()} onBboxesChange={onBboxesChange} />)
    expect(onBboxesChange).toHaveBeenCalledTimes(1)
    expect(onBboxesChange.mock.calls[0][0][0].classId).toBe('c2')
    await userEvent.click(screen.getByRole('button', { name: 'Save labels' }))
    expect(onSave.mock.calls[0][0][0].classId).toBe('c2')
  })
})
