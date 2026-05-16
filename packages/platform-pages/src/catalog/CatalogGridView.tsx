import { GalleryImageCard, HoverPreview } from '@ingradient/ui/patterns'
import { Grid } from '@ingradient/ui/primitives'
import { DragOverGrid, GridWrap } from './CatalogView.styles'
import type { CatalogImage, CatalogImagesPaneProps } from './types'

interface Props extends CatalogImagesPaneProps {
  dragOverGrid?: boolean
}

const PREVIEW_STYLE: React.CSSProperties = {
  width: 320,
  height: 240,
  objectFit: 'cover',
  borderRadius: 'var(--ig-radius-md)',
}

function renderCard(
  image: CatalogImage,
  selected: boolean,
  onToggleSelect: (id: string, checked: boolean) => void,
  onOpenDetail: (id: string) => void,
  onOpenMenu: (id: string, anchor: HTMLElement) => void,
) {
  return (
    <GalleryImageCard
      key={image.id}
      image={image}
      selected={selected}
      onSelect={(id) => onToggleSelect(id, !selected)}
      onOpen={(id) => onOpenDetail(id)}
      onOpenMenu={onOpenMenu}
    />
  )
}

export function CatalogGridView({
  images,
  selectedImageIds,
  hoverImageId,
  onToggleSelect,
  onOpenDetail,
  onOpenMenu,
  dragOverGrid,
}: Props) {
  return (
    <GridWrap>
      {dragOverGrid ? <DragOverGrid>Drop images here to upload</DragOverGrid> : null}
      <Grid columns="repeat(auto-fill, minmax(140px, 1fr))" gap={1}>
        {images.map((image) => {
          const card = renderCard(
            image,
            selectedImageIds.has(image.id),
            onToggleSelect,
            onOpenDetail,
            onOpenMenu,
          )
          if (hoverImageId === image.id) {
            return (
              <HoverPreview
                key={image.id}
                preview={<img src={image.thumb_url} alt={image.name} style={PREVIEW_STYLE} />}
                delay={0}
                scale={1.06}
              >
                {card}
              </HoverPreview>
            )
          }
          return card
        })}
      </Grid>
    </GridWrap>
  )
}
