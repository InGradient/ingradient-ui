import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Spinner } from './spinner'

export type MediaOverlayVariant = 'archived' | 'processing'

const overlayVariantStyles: Record<MediaOverlayVariant, ReturnType<typeof css>> = {
  archived: css`
    background:
      repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5) 2px,
        transparent 2px,
        transparent 4px
      ),
      rgba(0, 0, 0, 0.3);
    color: var(--ig-color-text-secondary);
  `,
  processing: css`
    background: var(--ig-color-lightbox-surface);
    color: var(--ig-color-text-primary);
  `,
}

const Root = styled.div<{ $variant: MediaOverlayVariant }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-3);
  pointer-events: none;
  ${(p) => overlayVariantStyles[p.$variant]}
`

const Label = styled.span`
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`

const Animated = styled(Root)`
  animation: ${fadeIn} 160ms ease;
`

export interface MediaOverlayProps {
  variant: MediaOverlayVariant
  label?: string
  icon?: React.ReactNode
  className?: string
}

const defaultLabels: Record<MediaOverlayVariant, string> = {
  archived: 'Archived',
  processing: 'Processing',
}

export function MediaOverlay({ variant, label, icon, className }: MediaOverlayProps) {
  return (
    <Animated $variant={variant} className={className} aria-label={`Media overlay: ${variant}`}>
      {icon ?? (variant === 'processing' ? <Spinner size="md" /> : null)}
      <Label>{label ?? defaultLabels[variant]}</Label>
    </Animated>
  )
}
