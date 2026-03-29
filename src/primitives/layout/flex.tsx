import React from 'react'
import styled from 'styled-components'
import { numberOrString, space, type Space } from '../shared'

const StackRoot = styled.div<{ $gap?: Space; $align?: string; $justify?: string }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: ${(p) => space(p.$gap) ?? 'var(--ig-space-7)'};
  align-items: ${(p) => p.$align ?? 'stretch'};
  justify-content: ${(p) => p.$justify ?? 'flex-start'};
`

export function Stack({
  gap,
  align,
  justify,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { gap?: Space; align?: string; justify?: string }) {
  return <StackRoot $gap={gap} $align={align} $justify={justify} {...props} />
}

const InlineRoot = styled.div<{ $gap?: Space; $align?: string; $justify?: string; $wrap?: string }>`
  display: flex;
  flex-wrap: ${(p) => p.$wrap ?? 'wrap'};
  min-width: 0;
  gap: ${(p) => space(p.$gap) ?? 'var(--ig-space-5)'};
  align-items: ${(p) => p.$align ?? 'center'};
  justify-content: ${(p) => p.$justify ?? 'flex-start'};
`

export function Inline({
  gap,
  align,
  justify,
  wrap,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { gap?: Space; align?: string; justify?: string; wrap?: string }) {
  return <InlineRoot $gap={gap} $align={align} $justify={justify} $wrap={wrap} {...props} />
}

const GridRoot = styled.div<{ $gap?: Space; $columns?: string; $minItemWidth?: string | number }>`
  display: grid;
  min-width: 0;
  gap: ${(p) => space(p.$gap) ?? 'var(--ig-space-7)'};
  grid-template-columns: ${(p) =>
    p.$columns ?? `repeat(auto-fit, minmax(${numberOrString(p.$minItemWidth) ?? '220px'}, 1fr))`};
`

export function Grid({
  gap,
  columns,
  minItemWidth,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { gap?: Space; columns?: string; minItemWidth?: string | number }) {
  return <GridRoot $gap={gap} $columns={columns} $minItemWidth={minItemWidth} {...props} />
}

const ContainerRoot = styled.div<{ $maxWidth?: string | number; $padding?: Space }>`
  width: 100%;
  max-width: ${(p) => numberOrString(p.$maxWidth) ?? '1280px'};
  margin: 0 auto;
  padding-inline: ${(p) => space(p.$padding) ?? 'var(--ig-space-11)'};
`

export function Container({
  maxWidth,
  padding,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { maxWidth?: string | number; padding?: Space }) {
  return <ContainerRoot $maxWidth={maxWidth} $padding={padding} {...props} />
}
