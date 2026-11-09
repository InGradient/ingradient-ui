import { useRef } from 'react'
import { iconSizeNumbers } from '@ingradient/ui'
import { ContextMenuWithSubmenus, GlobeIcon, IconButton } from '@ingradient/ui/components'
import type { LangSelectorViewProps } from './types'

/** Top-bar language switch: a globe icon button with a single-choice menu (like the account menu). */
export function LangSelectorView(props: LangSelectorViewProps): JSX.Element {
  const { value, options, open, label, onToggle, onClose, onSelect } = props
  const triggerRef = useRef<HTMLButtonElement>(null)
  const current = options.find((o) => o.value === value)?.label ?? value
  return (
    <>
      <IconButton
        ref={triggerRef}
        variant="secondary"
        size="sm"
        title={label}
        aria-label={`${label}: ${current}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); onToggle() }}
      >
        <GlobeIcon size={iconSizeNumbers.lg} />
      </IconButton>
      {open && (
        <ContextMenuWithSubmenus
          anchorEl={triggerRef.current}
          onClose={onClose}
          actions={options.map((o) => ({ key: o.value, label: o.label, checked: o.value === value, onClick: () => onSelect(o.value) }))}
        />
      )}
    </>
  )
}
