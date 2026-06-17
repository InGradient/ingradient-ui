import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { surfaceRaised } from '../../primitives'
import { ColorEditorPlane } from './color-editor-plane'
import { hslToHex, type HslColor } from './color-input-row.utils'

const Panel = styled.div`
  ${surfaceRaised}
  position: absolute;
  top: calc(100% + var(--ig-space-3));
  left: 0;
  z-index: var(--ig-z-popover);
  width: 100%;
  box-sizing: border-box;
  padding: var(--ig-space-5);
  border-radius: var(--ig-radius-lg);
  box-shadow: var(--ig-shadow-popover);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-4);
`

const Title = styled.strong`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
`

const Hex = styled.code`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const EditRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-5);
`

const HexInput = styled(TextField).attrs({ size: 'sm' as const })`
  min-width: 0;
  font-family: var(--ig-font-mono);
  text-transform: lowercase;
`

const Control = styled.label`
  display: grid;
  grid-template-columns: var(--ig-control-height-3xl-plus) minmax(0, 1fr) var(--ig-control-height-2xl);
  align-items: center;
  gap: var(--ig-space-3);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

const ValueInput = styled(TextField).attrs({ size: 'sm' as const, type: 'number' })`
  width: var(--ig-control-height-2xl);
  height: var(--ig-control-height-xs);
  padding: 0 var(--ig-space-3);
  text-align: right;
  font-family: var(--ig-font-mono);
`

const Slider = styled.input<{ $track: string }>`
  width: 100%;
  height: var(--ig-space-2);
  margin: 0;
  appearance: none;
  border-radius: var(--ig-radius-pill);
  background: ${(p) => p.$track};
  cursor: pointer;

  &::-webkit-slider-thumb {
    width: var(--ig-space-7);
    height: var(--ig-space-7);
    appearance: none;
    border: var(--ig-border-2px) solid var(--ig-color-text-primary);
    border-radius: var(--ig-radius-pill);
    background: var(--ig-color-surface-raised);
    box-shadow: var(--ig-shadow-focus-ring);
  }

  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-1);
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--ig-space-5);
  padding-top: var(--ig-space-4);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`

export interface ColorEditorPopoverProps {
  color: HslColor
  hexDraft: string
  onChange: (color: HslColor) => void
  onChangeHexDraft: (hex: string) => void
  onCommitHex: () => void
  onRandomize?: () => void
  onClose: () => void
}

export function ColorEditorPopover({
  color,
  hexDraft,
  onChange,
  onChangeHexDraft,
  onCommitHex,
  onRandomize,
  onClose,
}: ColorEditorPopoverProps) {
  const hex = hslToHex(color)
  const update = (key: keyof HslColor, value: number, max: number) =>
    onChange({ ...color, [key]: Math.min(max, Math.max(0, value)) })
  return (
    <Panel role="dialog" aria-label="Color editor">
      <Header><Title>Color editor</Title><Hex>{hex}</Hex></Header>
      <ColorEditorPlane color={color} onChange={onChange} />
      <EditRow>
        <HexInput
          value={hexDraft}
          onChange={(event) => onChangeHexDraft(event.target.value)}
          onBlur={onCommitHex}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
          }}
          aria-label="Editor hex value"
          maxLength={7}
          spellCheck={false}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="Randomize color in editor"
          onClick={onRandomize}
        >
          Random
        </Button>
      </EditRow>
      <Controls>
        <Control>
          Hue
          <Slider type="range" min={0} max={359} value={color.h}
            $track="linear-gradient(90deg, hsl(0 80% 55%), hsl(60 80% 55%), hsl(120 80% 55%), hsl(180 80% 55%), hsl(240 80% 55%), hsl(300 80% 55%), hsl(360 80% 55%))"
            onChange={(event) => update('h', Number(event.target.value), 359)} aria-label="Hue" />
          <ValueInput min={0} max={359} value={color.h}
            onChange={(event) => update('h', Number(event.target.value), 359)}
            aria-label="Hue value" />
        </Control>
        <Control>
          Saturation
          <Slider type="range" min={0} max={100} value={color.s}
            $track={`linear-gradient(90deg, hsl(${color.h} 0% ${color.l}%), hsl(${color.h} 100% ${color.l}%))`}
            onChange={(event) => update('s', Number(event.target.value), 100)} aria-label="Saturation" />
          <ValueInput min={0} max={100} value={color.s}
            onChange={(event) => update('s', Number(event.target.value), 100)}
            aria-label="Saturation value" />
        </Control>
        <Control>
          Lightness
          <Slider type="range" min={0} max={100} value={color.l}
            $track={`linear-gradient(90deg, hsl(${color.h} ${color.s}% 0%), hsl(${color.h} ${color.s}% 50%), hsl(${color.h} ${color.s}% 100%))`}
            onChange={(event) => update('l', Number(event.target.value), 100)} aria-label="Lightness" />
          <ValueInput min={0} max={100} value={color.l}
            onChange={(event) => update('l', Number(event.target.value), 100)}
            aria-label="Lightness value" />
        </Control>
      </Controls>
      <Footer><Button type="button" size="sm" onClick={onClose}>Done</Button></Footer>
    </Panel>
  )
}
