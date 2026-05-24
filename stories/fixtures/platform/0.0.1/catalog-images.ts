import type { SyncState } from '@ingradient/ui/patterns'
import jpg1 from '../../../assets/20230808.jpg'
import jpg2 from '../../../assets/20230816.jpg'
import jpg3 from '../../../assets/20230823.jpg'
import jpg4 from '../../../assets/20230824.jpg'
import jpg5 from '../../../assets/20230830.jpg'
import jpg6 from '../../../assets/20230906.jpg'
import jpg7 from '../../../assets/20230907.jpg'
import jpg8 from '../../../assets/20230913.jpg'
import jpg9 from '../../../assets/20230927.jpg'

const ASSET_URLS = [jpg1, jpg2, jpg3, jpg4, jpg5, jpg6, jpg7, jpg8, jpg9].map((u) => u as string)

export type MockGalleryImage = {
  id: string
  thumb_url: string
  name: string
  sync_state?: SyncState
  archived?: boolean
  processing?: boolean
  group_count?: number
  dataset_id?: string
  sequence_id?: string
  sequence_step?: number
  pattern_label?: string
  classification_class_ids?: string[]
  labeled_at?: string
  labeled_by?: string
  width?: number
  height?: number
  size_bytes?: number
  created_at: string
  uploader?: string
}

function img(i: number, partial: Partial<MockGalleryImage>): MockGalleryImage {
  const date = ['20230808','20230816','20230823','20230824','20230830','20230906','20230907','20230913','20230927'][i % 9]
  return {
    id: `img-${i + 1}`,
    thumb_url: ASSET_URLS[i % 9],
    name: `${date}-wafer-${String(i + 1).padStart(3, '0')}.jpg`,
    sync_state: 'synced',
    dataset_id: 'd1',
    created_at: `2024-12-${String((i % 28) + 1).padStart(2, '0')}`,
    width: 4096,
    height: 3072,
    size_bytes: 2_500_000 + (i * 35_000),
    uploader: 'jhlee',
    ...partial,
  }
}

export const mockImages: MockGalleryImage[] = [
  img(0, { sync_state: 'synced', pattern_label: 'A', sequence_id: 'seq-1', sequence_step: 0 }),
  img(1, { sync_state: 'synced', pattern_label: 'A', sequence_id: 'seq-1', sequence_step: 1 }),
  img(2, { sync_state: 'uploading' }),
  img(3, { sync_state: 'upload_failed' }),
  img(4, { sync_state: 'local_only' }),
  img(5, { archived: true, sync_state: 'synced' }),
  img(6, { processing: true, sync_state: 'uploading' }),
  img(7, { group_count: 5, sync_state: 'synced', sequence_id: 'seq-2' }),
  img(8, { group_count: 12, sync_state: 'synced' }),
  img(9, { sync_state: 'synced', dataset_id: 'd2', pattern_label: 'B' }),
  img(10, { sync_state: 'synced', dataset_id: 'd2', pattern_label: 'B' }),
  img(11, { sync_state: 'synced', dataset_id: 'd2' }),
  img(12, { sync_state: 'synced', name: 'very-long-image-filename-2024-q4-batch-3-wafer-line-a-013-cropped-and-aligned.jpg' }),
  img(13, { sync_state: 'synced' }),
  img(14, { sync_state: 'synced' }),
  img(15, { sync_state: 'synced' }),
  img(16, { sync_state: 'synced' }),
  img(17, { sync_state: 'synced' }),
  img(18, { sync_state: 'synced' }),
  img(19, { sync_state: 'synced' }),
]
