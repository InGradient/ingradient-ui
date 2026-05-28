import styled from 'styled-components'

/**
 * Static small tag visual. Generic atomic — caller controls bg / color.
 *
 * For interactive button-like chips, use `ActionChip`.
 * For Badge-shaped (pill, larger) tags, use `Badge` / `Chip` from feedback.
 */
export const Tag = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 1px var(--ig-space-2);
  border-radius: var(--ig-radius-xs);
  font-size: var(--ig-font-size-3xs);
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`
