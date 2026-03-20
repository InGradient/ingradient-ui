import styled from 'styled-components'

const badgeTone = {
  neutral: 'var(--ig-color-badge-neutral)',
  accent: 'var(--ig-color-badge-accent)',
  success: 'var(--ig-color-badge-success)',
  warning: 'var(--ig-color-badge-warning)',
  danger: 'var(--ig-color-badge-danger)',
} as const

export const Badge = styled.span<{ $tone?: keyof typeof badgeTone }>`
  padding: var(--ig-space-1) var(--ig-space-4);
  border-radius: var(--ig-radius-pill);
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  color: var(--ig-color-text-primary);
  background: ${(p) => badgeTone[p.$tone ?? 'neutral']};
`

export const Chip = styled(Badge)`
  border: 1px solid var(--ig-color-border-subtle);
`

const AvatarRoot = styled.div<{ $size: number }>`
  width: ${(p) => `${p.$size}px`};
  height: ${(p) => `${p.$size}px`};
  border-radius: var(--ig-radius-pill);
  overflow: hidden;
  background: var(--ig-color-avatar-bg);
  color: var(--ig-color-accent-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export function Avatar({
  src,
  alt,
  initials,
  size = 36,
}: {
  src?: string
  alt?: string
  initials?: string
  size?: number
}) {
  return <AvatarRoot $size={size}>{src ? <img src={src} alt={alt ?? 'Avatar'} /> : initials ?? 'IG'}</AvatarRoot>
}
