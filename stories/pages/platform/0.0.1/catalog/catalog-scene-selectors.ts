import type { GalleryFilterPanelState } from '@ingradient/platform-pages'
import type { MockGalleryImage } from '../../../../fixtures/platform/0.0.1/catalog-images'

interface CatalogImageQuery {
  deletedIds: Set<string>
  filterState: GalleryFilterPanelState
  searchValue: string
  sortValue: string
}

export function selectCatalogImages(
  images: MockGalleryImage[],
  { deletedIds, filterState, searchValue, sortValue }: CatalogImageQuery,
) {
  const query = searchValue.trim().toLocaleLowerCase()
  const filtered = images.filter((image) => {
    if (deletedIds.has(image.id)) return false
    if (query && !image.name.toLocaleLowerCase().includes(query)) return false
    if (!matchesDateRange(image.created_at, filterState.uploadFrom, filterState.uploadTo)) return false
    if (!matchesDateRange(image.modified_at, filterState.modifiedFrom, filterState.modifiedTo)) return false
    if (filterState.labeled === 'labeled' && !image.labeled_at) return false
    if (filterState.labeled === 'unlabeled' && image.labeled_at) return false
    if (filterState.archive === 'archived' && !image.archived) return false
    if (filterState.archive === 'unarchived' && image.archived) return false
    if (filterState.hasComments && !image.has_comments) return false
    if (!matchesSet(filterState.selectedClassIds, image.classification_class_ids)) return false
    if (!matchesSet(filterState.selectedMemberIds, image.labeled_by ? [image.labeled_by] : [])) return false
    if (!matchesSet(
      filterState.selectedPatternIds,
      image.pattern_label ? [`pt-${image.pattern_label}`] : [],
    )) return false
    return true
  })

  return filtered
    .map((image, index) => ({ image, index }))
    .sort((a, b) => compareImages(a.image, b.image, sortValue) || a.index - b.index)
    .map(({ image }) => image)
}

export function catalogFilterIsActive(state: GalleryFilterPanelState): boolean {
  return !!(
    state.uploadFrom || state.uploadTo || state.modifiedFrom || state.modifiedTo ||
    state.labeled !== 'all' || state.archive !== 'all' || state.hasComments ||
    state.selectedClassIds.size || state.selectedMemberIds.size || state.selectedPatternIds.size
  )
}

function matchesDateRange(value: string | undefined, from: string, to: string) {
  if (!from && !to) return true
  if (!value) return false
  return (!from || value >= from) && (!to || value <= to)
}

function matchesSet(selected: Set<string>, values: string[] = []) {
  return selected.size === 0 || values.some((value) => selected.has(value))
}

function compareImages(a: MockGalleryImage, b: MockGalleryImage, sortValue: string) {
  switch (sortValue) {
    case 'name-asc':
      return a.name.localeCompare(b.name)
    case 'name-desc':
      return b.name.localeCompare(a.name)
    case 'size':
      return (b.size_bytes ?? 0) - (a.size_bytes ?? 0)
    case 'labeled':
      return Number(!!b.labeled_at) - Number(!!a.labeled_at) || a.name.localeCompare(b.name)
    case 'recent':
    default:
      return b.created_at.localeCompare(a.created_at) || a.name.localeCompare(b.name)
  }
}
