import React from 'react'
import styled from 'styled-components'

const HeadingRoot = styled.h2<{ $level?: 1 | 2 | 3 | 4 }>`
  margin: 0;
  color: var(--ig-color-text-primary);
  letter-spacing: -0.02em;
  font-size: ${(p) => (p.$level === 1 ? 'var(--ig-font-size-5xl)' : p.$level === 2 ? 'var(--ig-font-size-4xl)' : p.$level === 3 ? 'var(--ig-font-size-2xl)' : 'var(--ig-font-size-xl)')};
  font-weight: ${(p) => (p.$level === 1 ? 800 : p.$level === 2 ? 700 : 600)};
`

export function Heading({
  level = 2,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 }) {
  const as = `h${Math.min(level + 1, 6)}` as React.ElementType
  return <HeadingRoot as={as} $level={level} {...props} />
}
