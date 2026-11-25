import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ChoiceDialog } from './choice-dialog'

const OPTIONS = [
  { value: 'a', label: 'Option A', disabled: true },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('ChoiceDialog', () => {
  it('renders nothing while closed', () => {
    const { container } = render(
      <ChoiceDialog open={false} title="Pick" options={OPTIONS} onClose={() => undefined} onContinue={() => undefined} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('starts on the first enabled option and continues with the chosen value', () => {
    const onContinue = vi.fn()
    render(<ChoiceDialog open title="Pick" options={OPTIONS} onClose={() => undefined} onContinue={onContinue} />)
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(onContinue).toHaveBeenLastCalledWith('b')
    fireEvent.click(screen.getByText('Option C'))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(onContinue).toHaveBeenLastCalledWith('c')
  })
})
