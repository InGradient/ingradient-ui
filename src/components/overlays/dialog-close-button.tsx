import type React from 'react'
import { X } from 'lucide-react'
import styled from 'styled-components'
import { IconButton } from '../inputs/icon-button'

const Root = styled(IconButton)`
  border-color: transparent;
  background: transparent;
  color: var(--ig-color-text-muted);

  &:hover:not(:disabled) {
    background: var(--ig-color-surface-interactive);
    border-color: var(--ig-color-border-subtle);
    color: var(--ig-color-text-primary);
  }
`

export function DialogCloseButton({
  'aria-label': ariaLabel = 'Close dialog',
  title = 'Close',
  children,
  ...props
}: React.ComponentProps<typeof IconButton>) {
  return (
    <Root type="button" variant="secondary" aria-label={ariaLabel} title={title} {...props}>
      {children ?? <X size={16} />}
    </Root>
  )
}
