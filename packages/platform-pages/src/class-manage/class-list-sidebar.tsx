import { Box, Stack, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { LabeledSwatchRow } from '@ingradient/ui/components'

const SIDEBAR_STYLE = {
  width: 280,
  flexShrink: 0,
  background: 'var(--ig-color-surface-panel)',
  borderRadius: 'var(--ig-radius-xl)',
  border: '1px solid var(--ig-color-border-subtle)',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden' as const,
}

const HEADER_STYLE = {
  padding: 'var(--ig-space-7) var(--ig-space-7) var(--ig-space-5)',
  borderBottom: '1px solid var(--ig-color-border-subtle)',
  flexShrink: 0,
}

const LIST_STYLE = {
  listStyle: 'none' as const,
  margin: 0,
  padding: 'var(--ig-space-3) 0',
  overflowY: 'auto' as const,
  minHeight: 0,
  flex: 1,
}

const PLACEHOLDER_STYLE = { padding: 'var(--ig-space-9) var(--ig-space-6)' }

export interface ClassListSidebarClass {
  id: string
  name: string
  color: string
  image_count?: number
}

export interface ClassListSidebarProps {
  classes: ClassListSidebarClass[]
  selectedClassId?: string | null
  loading?: boolean
  emptyText?: string
  addClassLabel?: string
  onSelectClass?: (id: string) => void
  onAddClass?: () => void
}

export function ClassListSidebar({
  classes, selectedClassId, loading,
  emptyText = 'No classes yet.',
  addClassLabel = '+ Add class',
  onSelectClass, onAddClass,
}: ClassListSidebarProps) {
  return (
    <Stack as="aside" gap={0} style={SIDEBAR_STYLE}>
      <Box style={HEADER_STYLE}>
        <Button variant="accent" type="button" onClick={onAddClass}>
          {addClassLabel}
        </Button>
      </Box>
      {loading ? (
        <Text tone="muted" align="center" size="14px" style={PLACEHOLDER_STYLE}>Loading…</Text>
      ) : classes.length === 0 ? (
        <Text tone="muted" align="center" size="14px" style={PLACEHOLDER_STYLE}>{emptyText}</Text>
      ) : (
        <Box as="ul" role="listbox" aria-label="Classes" style={LIST_STYLE}>
          {classes.map((c) => (
            <LabeledSwatchRow
              key={c.id}
              id={c.id}
              label={c.name}
              color={c.color}
              count={c.image_count}
              selected={selectedClassId === c.id}
              onClick={onSelectClass}
            />
          ))}
        </Box>
      )}
    </Stack>
  )
}
