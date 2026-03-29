import styled from 'styled-components'
import { surfacePanel } from '../../primitives'
import { icons, type IconName } from './registry'

const IconGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--ig-space-5);
`

const IconTile = styled.div`
  ${surfacePanel}
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ig-space-4);
  color: var(--ig-color-text-secondary);
`

const IconPreview = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--ig-radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-accent-soft-surface);
  color: var(--ig-color-accent-soft);
`

const IconLabel = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  text-align: center;
  word-break: break-word;
`

export function IconGallery({
  names = Object.keys(icons) as IconName[],
  size = 20,
}: {
  names?: IconName[]
  size?: number
}) {
  return (
    <IconGalleryGrid>
      {names.map((name) => {
        const Glyph = icons[name]
        return (
          <IconTile key={name}>
            <IconPreview><Glyph size={size} strokeWidth={1.8} /></IconPreview>
            <IconLabel>{name}</IconLabel>
          </IconTile>
        )
      })}
    </IconGalleryGrid>
  )
}
