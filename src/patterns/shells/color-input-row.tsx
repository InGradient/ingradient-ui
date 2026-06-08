import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { useClickOutside } from '../../hooks/useClickOutside'
import { ColorEditorPopover } from './color-editor-popover'
import { hexToHsl, hslToHex, type HslColor } from './color-input-row.utils'

const Field = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const Label = styled.span`
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  color: var(--ig-color-text-muted);
`

const Row = styled.div`
  display: grid;
  grid-template-columns: var(--ig-control-height-sm) minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--ig-space-3);
`

const Preview = styled.button<{ $color: string }>`
  width: var(--ig-control-height-sm);
  height: var(--ig-control-height-sm);
  padding: 0;
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-md);
  background: ${(p) => p.$color};
  box-shadow: inset 0 0 0 2px var(--ig-color-surface-panel);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--ig-color-accent-ring);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const HexInput = styled(TextField).attrs({ size: 'sm' as const })`
  min-width: 0;
  font-family: var(--ig-font-mono);
  text-transform: lowercase;
`

const RandomButton = styled(Button).attrs({ variant: 'secondary', size: 'sm' as const })`
  white-space: nowrap;
`

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export interface ColorInputRowProps {
  value: string
  onChange?: (hex: string) => void
  onRandomize?: () => void
  randomLabel?: string
  ariaLabel?: string
  disabled?: boolean
}

export function ColorInputRow({
  value, onChange, onRandomize,
  randomLabel = 'Random',
  ariaLabel = 'Color',
  disabled,
}: ColorInputRowProps) {
  const [draft, setDraft] = useState(value)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorColor, setEditorColor] = useState<HslColor>(() => hexToHsl(value))
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDraft(value)
    setEditorColor(hexToHsl(value))
  }, [value])

  useEffect(() => {
    if (!editorOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEditorOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [editorOpen])

  useClickOutside({
    refs: fieldRef,
    enabled: editorOpen,
    onClickOutside: () => setEditorOpen(false),
  })

  const commit = () => {
    const normalized = draft.startsWith('#') ? draft : `#${draft}`
    if (HEX_COLOR.test(normalized)) {
      const next = normalized.toLowerCase()
      onChange?.(next)
      setDraft(next)
      setEditorColor(hexToHsl(next))
      return
    }
    setDraft(value)
  }

  const changeFromEditor = (next: HslColor) => {
    const hex = hslToHex(next)
    setEditorColor(next)
    setDraft(hex)
    onChange?.(hex)
  }

  return (
    <Field ref={fieldRef}>
      <Label>{ariaLabel}</Label>
      <Row>
        <Preview
          type="button"
          $color={value}
          aria-label={`Edit ${ariaLabel.toLowerCase()}`}
          aria-expanded={editorOpen}
          disabled={disabled}
          onClick={() => setEditorOpen((open) => !open)}
        />
        <HexInput
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
            if (event.key === 'Escape') setDraft(value)
          }}
          aria-label={`${ariaLabel} hex value`}
          disabled={disabled}
          maxLength={7}
          spellCheck={false}
        />
        <RandomButton type="button" onClick={onRandomize} disabled={disabled}>
          {randomLabel}
        </RandomButton>
      </Row>
      {editorOpen ? (
        <ColorEditorPopover
          color={editorColor}
          hexDraft={draft}
          onChange={changeFromEditor}
          onChangeHexDraft={setDraft}
          onCommitHex={commit}
          onRandomize={onRandomize}
          onClose={() => setEditorOpen(false)}
        />
      ) : null}
    </Field>
  )
}
