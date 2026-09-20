// 설정 탭 공통 조각. ui 에 있는 것은 ui 에서 쓰고, 여기엔 조합만 남긴다.
//
// Stack/Inline/Text/SettingsRow/Alert/EmptyState/Slider 가 ui 에 있으므로
// 예전에 여기서 만들던 행·라벨·박스는 전부 걷어냈다.
import { Inline, Stack, Text } from '@ingradient/ui'
import type { ReactNode } from 'react'

/** 탭 본문 세로 배치. */
export function TabWrap({ children }: { children: ReactNode }): JSX.Element {
  return <Stack gap="var(--ig-space-4)">{children}</Stack>
}

/** 아이콘 + 탭 이름. */
export function TabTitle({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Inline gap="var(--ig-space-2)" align="center">
      <Text as="h3" size="var(--ig-font-size-sm)" weight="semibold">{children}</Text>
    </Inline>
  )
}

/** 구역 이름. */
export function SectionLabel({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Text tone="muted" size="var(--ig-font-size-2xs)" uppercase letterSpacing="wide">
      {children}
    </Text>
  )
}

/** 보조 설명 한 줄. */
export function Hint({ children }: { children: ReactNode }): JSX.Element {
  return <Text tone="muted" size="var(--ig-font-size-2xs)">{children}</Text>
}

/** 목록 행 묶음. */
export function Rows({ children }: { children: ReactNode }): JSX.Element {
  return <Stack gap="var(--ig-space-2)">{children}</Stack>
}

/** 버튼 + 설명이 가로로 붙는 줄. */
export function ActionRow({ children }: { children: ReactNode }): JSX.Element {
  return <Inline gap="var(--ig-space-3)" align="center">{children}</Inline>
}
