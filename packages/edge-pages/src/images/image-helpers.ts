export interface EdgeCommentItem {
  id: string
  author_email: string
  author_name: string
  body: string
  created_at: string
  synced: boolean
}

export interface ImageItem {
  id: string
  src: string
  fullSrc: string
  originalUrl?: string | null
  label: string
  capturedAt?: string | null
  projectId?: string
  sequenceId?: string | null
  sequenceStep?: number | null
  patternLabel?: string | null
  syncState?: 'pending_review' | 'local_only' | 'uploading' | 'synced' | 'upload_failed' | null
  conversionStatus?: 'pending' | 'completed' | 'failed' | null
  conversionError?: string | null
  uploadError?: string | null
  remoteImageId?: string | null
  isLocal?: boolean
  comment?: string | null
  comments?: EdgeCommentItem[] | null
  bboxes?: { classId: string; x: number; y: number; w: number; h: number }[] | null
  width?: number | null
  height?: number | null
  groupCount?: number | null
}

export interface ProjectGroupSettings {
  multi_image_group_enabled: boolean
  group_key_regex: string | null
  group_representative_regex: string | null
}

export type ImagesDatePreset = 'all' | 'today' | 'last7' | 'last30' | 'custom'

export const DERIVED_VIRTUAL_IMAGE_ID_PREFIX = '::derived::'

export function getDerivedLabelFromVirtualId(imageId: string | null | undefined): string | null {
  if (!imageId) return null
  const idx = imageId.indexOf(DERIVED_VIRTUAL_IMAGE_ID_PREFIX)
  if (idx < 0) return null
  const label = imageId.slice(idx + DERIVED_VIRTUAL_IMAGE_ID_PREFIX.length)
  return label.startsWith('derived_') ? label : null
}

export function getGroupKey(fileName: string, regex: string | null | undefined): string | null {
  if (!regex?.trim()) return null
  try {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const m = fileName.match(new RegExp(regex.trim()))
    if (!m || m.length < 2) return null
    return typeof m[1] === 'string' ? m[1] : null
  } catch {
    return null
  }
}

function isRepresentative(fileName: string, repRegex: string | null | undefined): boolean {
  if (!repRegex?.trim()) return false
  try { return new RegExp(repRegex.trim()).test(fileName) } catch { return false }
}

export function dedupeSequenceMembers(members: ImageItem[]): ImageItem[] {
  const byStep = new Map<number | string, ImageItem>()
  for (const member of members) {
    const key = member.sequenceStep ?? member.id
    const existing = byStep.get(key)
    if (!existing || (!existing.isLocal && member.isLocal)) byStep.set(key, member)
  }
  return [...byStep.values()].sort((a, b) => (a.sequenceStep ?? 0) - (b.sequenceStep ?? 0))
}

export function buildGroups(
  items: ImageItem[],
  settings: ProjectGroupSettings | null,
): { displayItems: ImageItem[]; groupMap: Map<string, ImageItem[]>; sequenceGroupMap: Map<string, ImageItem[]> } {
  const groupMap = new Map<string, ImageItem[]>()
  const sequenceGroupMap = new Map<string, ImageItem[]>()
  const displayItems: ImageItem[] = []
  const consumedIds = new Set<string>()
  const bySequenceId = new Map<string, ImageItem[]>()

  for (const img of items) {
    if (!img.sequenceId) continue
    const members = bySequenceId.get(img.sequenceId) ?? []
    members.push(img)
    bySequenceId.set(img.sequenceId, members)
  }

  for (const [sequenceId, sequenceItems] of bySequenceId) {
    const members = dedupeSequenceMembers(sequenceItems)
    if (members.length === 0) continue
    sequenceGroupMap.set(sequenceId, members)
    members.forEach((member) => consumedIds.add(member.id))
    const representative =
      members.find((member) => member.patternLabel === 'solid')
      ?? members.reduce((best, current) => ((current.sequenceStep ?? -1) > (best.sequenceStep ?? -1) ? current : best), members[0])
    displayItems.push(representative)
  }

  const remainingItems = items.filter((item) => !consumedIds.has(item.id))
  if (!settings?.multi_image_group_enabled || !settings.group_key_regex) {
    return { displayItems: [...displayItems, ...remainingItems], groupMap, sequenceGroupMap }
  }

  const ungrouped: ImageItem[] = []
  for (const img of remainingItems) {
    const key = getGroupKey(img.label, settings.group_key_regex)
    if (!key) { ungrouped.push(img); continue }
    const arr = groupMap.get(key) ?? [];
    arr.push(img)
    groupMap.set(key, arr)
  }

  for (const [, members] of groupMap) {
    const rep = settings.group_representative_regex
      ? members.find((m) => isRepresentative(m.label, settings.group_representative_regex)) ?? members[0]
      : members[0]
    displayItems.push(rep)
  }
  displayItems.push(...ungrouped)
  return { displayItems, groupMap, sequenceGroupMap }
}

export function imagePassesDateFilter(
  img: ImageItem,
  preset: ImagesDatePreset,
  fromDate: string,
  toDate: string,
): boolean {
  if (preset === 'all') return true
  if (!img.capturedAt) return false
  const imageDate = new Date(img.capturedAt)
  const imageTime = imageDate.getTime()
  if (Number.isNaN(imageTime)) return false
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  switch (preset) {
    case 'today':
      return new Date(imageDate.getFullYear(), imageDate.getMonth(), imageDate.getDate()).getTime() === todayStart
    case 'last7':
      return imageTime >= now.getTime() - 7 * 86400000
    case 'last30':
      return imageTime >= now.getTime() - 30 * 86400000
    case 'custom': {
      if (!fromDate && !toDate) return true
      const from = fromDate ? new Date(fromDate).getTime() : 0
      const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : Infinity
      return imageTime >= from && imageTime <= to
    }
    default:
      return true
  }
}
