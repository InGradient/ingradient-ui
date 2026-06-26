import { Badge } from '@ingradient/ui/components'
import {
  ClassChip, ClassChipDot, ClassChipName,
} from './dataset-card.styles'
import type { EdgeClass } from './types'

const CLASS_SHOW_MAX = 3

export function renderClassChips(classes: EdgeClass[] | undefined, noClassesLabel: string): JSX.Element {
  if (!classes || classes.length === 0) {
    return <Badge $tone="neutral">{noClassesLabel}</Badge>
  }
  const visible = classes.slice(0, CLASS_SHOW_MAX)
  const rest = classes.length - CLASS_SHOW_MAX
  return (
    <>
      {visible.map((c) => (
        <ClassChip key={c.name} $color={c.color}>
          <ClassChipDot $color={c.color} />
          <ClassChipName>{c.name}</ClassChipName>
        </ClassChip>
      ))}
      {rest > 0 && <Badge $tone="neutral">+{rest}</Badge>}
    </>
  )
}
