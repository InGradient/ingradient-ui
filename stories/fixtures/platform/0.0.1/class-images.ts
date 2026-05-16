import sample1 from '../../../assets/20230808.jpg'
import sample2 from '../../../assets/20230816.jpg'
import sample3 from '../../../assets/20230823.jpg'
import sample4 from '../../../assets/20230824.jpg'
import sample5 from '../../../assets/20230830.jpg'
import sample6 from '../../../assets/20230906.jpg'
import sample7 from '../../../assets/20230907.jpg'
import sample8 from '../../../assets/20230913.jpg'
import sample9 from '../../../assets/20230927.jpg'

export interface MockClassImageBbox {
  classId?: string
  x: number
  y: number
  w: number
  h: number
}
export interface MockClassImagePoint {
  classId?: string
  x: number
  y: number
}

export interface MockClassImage {
  id: string
  name: string
  thumb_url: string
  original_url?: string
  width: number
  height: number
  bboxes?: MockClassImageBbox[]
  points?: MockClassImagePoint[]
  sequence_id?: string | null
  pattern_label?: string | null
  dataset_id?: string
}

const samples = [sample1, sample2, sample3, sample4, sample5, sample6, sample7, sample8, sample9] as unknown as string[]

/** Class cl-1 (Crack) — bbox/point annotations referenced to cl-1 */
export const imagesForCl1: MockClassImage[] = Array.from({ length: 9 }, (_, i) => {
  const sample = samples[i % samples.length]
  return {
    id: `img-cl1-${i + 1}`,
    name: `wafer-batch-${String(i + 1).padStart(3, '0')}.jpg`,
    thumb_url: sample,
    original_url: sample,
    width: 1024,
    height: 768,
    bboxes: [
      { classId: 'cl-1', x: 0.1 + (i * 0.05) % 0.4, y: 0.15 + (i * 0.03) % 0.3, w: 0.22, h: 0.18 },
    ],
    points: i % 3 === 0 ? [{ classId: 'cl-1', x: 0.5, y: 0.5 }] : undefined,
    dataset_id: ['ds-1', 'ds-2', 'ds-3', 'ds-4'][i % 4],
  }
})

/** Class cl-1 sequence group — 동일 sequence_id 의 4 패턴 (lightbox tab 테스트) */
export const sequenceImagesForCl1: MockClassImage[] = [
  { id: 'seq-1', name: 'seq-solid.jpg', thumb_url: sample1 as string, original_url: sample1 as string, width: 1024, height: 768, sequence_id: 'seq-001', pattern_label: 'solid', bboxes: [{ classId: 'cl-1', x: 0.2, y: 0.3, w: 0.3, h: 0.2 }] },
  { id: 'seq-2', name: 'seq-black.jpg', thumb_url: sample2 as string, original_url: sample2 as string, width: 1024, height: 768, sequence_id: 'seq-001', pattern_label: 'black', bboxes: [{ classId: 'cl-1', x: 0.4, y: 0.4, w: 0.2, h: 0.15 }] },
  { id: 'seq-3', name: 'seq-x-0.jpg', thumb_url: sample3 as string, original_url: sample3 as string, width: 1024, height: 768, sequence_id: 'seq-001', pattern_label: 'x_phase_0_of_3', bboxes: [{ classId: 'cl-1', x: 0.5, y: 0.5, w: 0.2, h: 0.2 }] },
  { id: 'seq-4', name: 'seq-x-1.jpg', thumb_url: sample4 as string, original_url: sample4 as string, width: 1024, height: 768, sequence_id: 'seq-001', pattern_label: 'x_phase_1_of_3', bboxes: [{ classId: 'cl-1', x: 0.55, y: 0.45, w: 0.18, h: 0.18 }] },
]

/** Many images (cl-1, group representative case): 24 images */
export const manyImagesForCl1: MockClassImage[] = Array.from({ length: 24 }, (_, i) => {
  const sample = samples[i % samples.length]
  return {
    id: `img-many-${i + 1}`,
    name: `dense-batch-${String(i + 1).padStart(3, '0')}.jpg`,
    thumb_url: sample,
    width: 1024,
    height: 768,
    bboxes: i % 2 === 0 ? [{ classId: 'cl-1', x: 0.2, y: 0.3, w: 0.2, h: 0.15 }] : undefined,
    dataset_id: ['ds-1', 'ds-2'][i % 2],
  }
})

/** Reference image bbox candidates — 같은 image 의 여러 bbox (BboxNavigation 테스트) */
export const referenceBboxCandidatesForCl1 = [
  { imageId: 'img-cl1-1', bboxIndex: 0 },
  { imageId: 'img-cl1-1', bboxIndex: 1 },
  { imageId: 'img-cl1-1', bboxIndex: 2 },
]
