import type { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Layer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  > * {
    pointer-events: auto;
  }
`

export type OverlayLayerProps = HTMLAttributes<HTMLDivElement>

/**
 * Full-fill absolute layer for placing interactive elements on top of an image/canvas.
 * The wrapper passes pointer events through; children opt back in via the `> *` rule,
 * so the underlying surface remains clickable except where overlay children sit.
 */
export function OverlayLayer(props: OverlayLayerProps) {
  return <Layer {...props} />
}
