import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FringeProfilePreviewView } from './FringeProfilePreviewView'

describe('FringeProfilePreviewView', () => {
  it('opens a named dialog by keyboard and restores trigger focus on Escape', async () => {
    const user = userEvent.setup()
    render(<FringeProfilePreviewView values={[0, 128, 255]} windowPx={3} labels={{ caption: 'Synthetic profile', zoom: 'Enlarge profile', zoomTitle: 'Profile preview', close: 'Close' }} />)
    const trigger = screen.getByRole('button', { name: 'Enlarge profile' })
    trigger.focus()
    await user.keyboard(' ')
    expect(screen.getByRole('dialog', { name: 'Profile preview' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
