import { Heading } from './heading'
import { Text, type TextProps } from './text'
import type { ComponentProps } from 'react'

/**
 * Named type scale primitives — design system 의 의미적 텍스트 스타일.
 *
 * | 토큰 | font-size | weight | 용도 |
 * |---|---|---|---|
 * | H1 | 5xl (28px) | 800 | Page hero title |
 * | H2 | 4xl (24px) | 700 | Section title |
 * | H3 | 2xl (18px) | 600 | Subsection title |
 * | H4 | xl  (16px) | 600 | Block title, dialog title |
 * | B1 | lg  (15px) | 400 | Body large — emphasis body |
 * | B2 | md  (14px) | 400 | Body medium — default body |
 * | B3 | sm  (13px) | 400 | Body small — dense table, secondary |
 * | C1 | xs  (12px) | 400 | Caption — meta, footnote |
 * | L1 | xs  (12px) | 600 | Label — uppercase, letter-spaced |
 *
 * Heading 은 의미적 h1~h4 element 로 렌더 (a11y). Body/Caption/Label 은 span 기본.
 * 기본 동작이 부족하면 underlying Heading/Text 의 props 전달 가능.
 *
 * 더 작은 텍스트 (10/11px) 는 type scale 에 없음. `<Text size="var(--ig-font-size-3xs)" />`
 * 또는 `2xs` 토큰 직접 사용 (mobile small label, icon-sized chip 등).
 */

type HeadingProps = ComponentProps<typeof Heading>

export function H1(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={1} {...props} />
}

export function H2(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={2} {...props} />
}

export function H3(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={3} {...props} />
}

export function H4(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={4} {...props} />
}

export function B1(props: Omit<TextProps, 'size'>) {
  return <Text size="var(--ig-font-size-lg)" {...props} />
}

export function B2(props: Omit<TextProps, 'size'>) {
  return <Text size="var(--ig-font-size-md)" {...props} />
}

export function B3(props: Omit<TextProps, 'size'>) {
  return <Text size="var(--ig-font-size-sm)" {...props} />
}

export function C1(props: Omit<TextProps, 'size' | 'tone'>) {
  return <Text size="var(--ig-font-size-xs)" tone="muted" {...props} />
}

export function L1(props: Omit<TextProps, 'size' | 'weight' | 'uppercase' | 'letterSpacing'>) {
  return (
    <Text
      size="var(--ig-font-size-xs)"
      weight={600}
      uppercase
      letterSpacing="0.06em"
      tone={props.tone ?? 'muted'}
      {...props}
    />
  )
}
