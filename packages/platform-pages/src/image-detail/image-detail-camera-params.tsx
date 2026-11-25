import styled from 'styled-components'
import { iconSizeNumbers } from '@ingradient/ui'
import { Stack } from '@ingradient/ui/primitives'
import { ChevronDownIcon, ChevronRightIcon, InfoRow, InfoRowLabel, InfoRowValue, TextButton } from '@ingradient/ui/components'

const ToggleBox = styled(TextButton)`
  padding: var(--ig-spacing-8) 0;
`
const BodyBox = styled(Stack)`
  padding-top: var(--ig-spacing-8);
`

export interface ImageDetailCameraParamRow {
  label: string
  /** Already formatted for display, including its unit. */
  value: string
}

export interface ImageDetailCameraParamsProps {
  rows: ImageDetailCameraParamRow[]
  open: boolean
  onToggle: () => void
}

/** Collapsible camera-parameter rows for `ImageDetailInfoPanel`'s `cameraParamsSlot`. Renders nothing without rows. */
export function ImageDetailCameraParams({ rows, open, onToggle }: ImageDetailCameraParamsProps) {
  if (rows.length === 0) return null
  return (
    <>
      <ToggleBox
        tone="accent"
        size="sm"
        aria-expanded={open}
        iconLeading={open ? <ChevronDownIcon size={iconSizeNumbers.sm} /> : <ChevronRightIcon size={iconSizeNumbers.sm} />}
        onClick={onToggle}
      >
        {open ? 'Hide camera parameters' : 'Camera Parameters'}
      </ToggleBox>
      {open ? (
        <BodyBox gap="var(--ig-spacing-8)">
          {rows.map((row) => (
            <InfoRow key={row.label}>
              <InfoRowLabel>{row.label}</InfoRowLabel>
              <InfoRowValue>{row.value}</InfoRowValue>
            </InfoRow>
          ))}
        </BodyBox>
      ) : null}
    </>
  )
}
