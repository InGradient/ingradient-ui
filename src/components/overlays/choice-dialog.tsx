import { useState } from 'react'
import { DialogShell } from './dialog-shell'
import { Button } from '../inputs/button'
import { RadioCardGroup, type RadioCardGroupOption } from '../inputs/radio-card-group'

const CHOICE_DIALOG_WIDTH = 'min(var(--ig-popup-xl), 100%)'

export interface ChoiceDialogProps {
  open: boolean
  title: string
  options: RadioCardGroupOption[]
  onClose: () => void
  onContinue: (value: string) => void
  cancelLabel?: string
  continueLabel?: string
}

/** 한 진입점에서 갈 수 있는 길이 둘 이상일 때 먼저 고르게 하는 dialog. 닫히면 선택이 초기화된다. */
export function ChoiceDialog(props: ChoiceDialogProps) {
  return props.open ? <ChoiceDialogBody {...props} /> : null
}

function ChoiceDialogBody({
  title, options, onClose, onContinue, cancelLabel = 'Cancel', continueLabel = 'Continue',
}: ChoiceDialogProps) {
  const [value, setValue] = useState(options.find((option) => !option.disabled)?.value ?? '')
  return (
    <DialogShell
      title={title}
      onClose={onClose}
      width={CHOICE_DIALOG_WIDTH}
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button type="button" variant="solid" disabled={value === ''} onClick={() => onContinue(value)}>
            {continueLabel}
          </Button>
        </>
      }
    >
      <RadioCardGroup value={value} onChange={setValue} options={options} />
    </DialogShell>
  )
}
