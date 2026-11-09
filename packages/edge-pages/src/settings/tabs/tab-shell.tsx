// 설정 탭 공통 조각. ui 에 있는 것은 ui 에서 쓰고, 여기엔 조합만 남긴다.
//
// Stack/Inline/Text/SettingsRow/Alert/EmptyState/Slider 가 ui 에 있으므로
// 예전에 여기서 만들던 행·라벨·박스는 전부 걷어냈다.
import { Inline, Stack, Text } from '@ingradient/ui'
import type { ReactNode } from 'react'

/** 탭 본문 세로 배치. */
export function TabWrap({ children }: { children: ReactNode }): JSX.Element {
  return <Stack gap="var(--ig-spacing-8)">{children}</Stack>
}

/** 아이콘 + 탭 이름. 아이콘과 글자 사이를 8px 띄우려고 제목 자체를 가로 줄로 둔다. */
const TITLE_ROW = { display: 'flex', alignItems: 'center', gap: 'var(--ig-spacing-8)' } as const

export function TabTitle({ children }: { children: ReactNode }): JSX.Element {
  return <Text as="h3" size="var(--ig-text-body-sm)" weight="semibold" style={TITLE_ROW}>{children}</Text>
}

/** 구역 이름. */
export function SectionLabel({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Text tone="muted" size="var(--ig-text-micro)" uppercase letterSpacing="wide">
      {children}
    </Text>
  )
}

/** 보조 설명 한 줄. 결과·경고 문장은 role(status/alert)을 붙여 화면 읽기 도구에 알린다. */
export function Hint({ children, role }: { children: ReactNode; role?: 'status' | 'alert' }): JSX.Element {
  return <Text tone="muted" size="var(--ig-text-micro)" role={role}>{children}</Text>
}

/** 목록 행 묶음. */
export function Rows({ children }: { children: ReactNode }): JSX.Element {
  return <Stack gap="var(--ig-spacing-8)">{children}</Stack>
}

/** 버튼 + 설명이 가로로 붙는 줄. */
export function ActionRow({ children }: { children: ReactNode }): JSX.Element {
  return <Inline gap="var(--ig-spacing-8)" align="center">{children}</Inline>
}
