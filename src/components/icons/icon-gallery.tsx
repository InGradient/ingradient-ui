import styled from 'styled-components'
import { surfacePanel } from '../../primitives'
import { icons, type IconName } from './registry'

const IconGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`

const IconTile = styled.div`
  ${surfacePanel}
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--ig-color-text-secondary);
`

const IconPreview = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-accent-soft-surface);
  color: var(--ig-color-accent-soft);
`

const IconLabel = styled.div`
  font-size: 12px;
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
