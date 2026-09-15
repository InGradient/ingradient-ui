import { IconButton, Stack } from '@ingradient/ui'
import { ColorSwatch, PanelRightOpenIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

/**
 * 접힌 우측 패널 — 펼치기 버튼과 클래스 색 동그라미만 보여준다.
 *
 * 색을 누르면 펼친 상태와 **같은 동작**이 일어난다(선택된 bbox 가 있으면 클래스 변경,
 * 없으면 편집 모드 진입). 이름은 툴팁으로만 나오므로 검색·ROI·코멘트가 필요하면 펼쳐야 한다.
 * 펼치기 버튼이 항상 맨 위에 있어 갇히는 상태가 없다.
 */
export interface CollapsedPanelClass {
  id: string
  name: string
  color: string
}

export interface RightPanelCollapsedViewProps {
  classes: CollapsedPanelClass[]
  selectedClassId: string | null
  labels: { expand: string }
  onClassClick: (classId: string) => void
  onExpand: () => void
}

export function RightPanelCollapsedView(props: RightPanelCollapsedViewProps): JSX.Element {
  const { classes, selectedClassId, labels, onClassClick, onExpand } = props

  return (
    <Stack gap="var(--ig-space-2)" align="center" style={{ padding: 'var(--ig-space-2)' }}>
      <IconButton
        size="xs"
        variant="ghost"
        title={labels.expand}
        aria-label={labels.expand}
        onClick={onExpand}
      >
        <PanelRightOpenIcon size={iconSizeNumbers.sm} />
      </IconButton>

      {classes.map((cls) => (
        <IconButton
          key={cls.id}
          size="xs"
          variant="ghost"
          title={cls.name}
          aria-label={cls.name}
          aria-pressed={selectedClassId === cls.id}
          onClick={() => onClassClick(cls.id)}
        >
          <ColorSwatch
            $color={cls.color}
            $size="md"
            $shape="circle"
            // 선택된 클래스는 테두리로 드러난다 — 색 동그라미만 있는 화면이라 다른 표식이 없다.
            style={selectedClassId === cls.id
              ? { outline: '2px solid var(--ig-color-accent)', outlineOffset: '1px' }
              : undefined}
          />
        </IconButton>
      ))}
    </Stack>
  )
}
