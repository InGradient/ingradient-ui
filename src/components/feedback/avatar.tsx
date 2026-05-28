import styled from 'styled-components'

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
  font-weight: var(--ig-font-weight-bold);
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
