import React from 'react'
import { Inline } from '../../primitives'
import { B3 } from '../../primitives/typography/type-scale'

export function Breadcrumbs({
  items,
  ariaLabel = 'Breadcrumb',
}: {
  items: Array<{ label: string; href?: string }>
  /** Override for landmark uniqueness when multiple breadcrumbs render on the same page */
  ariaLabel?: string
}) {
  return (
    <nav aria-label={ariaLabel}>
      <Inline gap={2} align="center">
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <B3 tone="muted">/</B3> : null}
            {item.href ? (
              <B3 as="a" tone="muted" href={item.href} style={{ textDecoration: 'none' }}>
                {item.label}
              </B3>
            ) : (
              <B3>{item.label}</B3>
            )}
          </React.Fragment>
        ))}
      </Inline>
    </nav>
  )
}
