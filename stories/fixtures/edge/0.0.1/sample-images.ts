import type { ImageItem, BBox, ClassInfo } from '@ingradient/edge-pages'

/** 작은 회색 grid 패턴 — 라벨링 시연용 placeholder */
export const SAMPLE_IMAGE_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#333" stroke-width="0.5"/>
    </pattern>
    <radialGradient id="bg">
      <stop offset="0%" stop-color="#2a2a2a"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#grid)"/>
  <ellipse cx="400" cy="300" rx="220" ry="160" fill="#1a3a5a" opacity="0.5"/>
  <ellipse cx="240" cy="180" rx="80" ry="60" fill="#5a1a1a" opacity="0.6"/>
  <ellipse cx="560" cy="420" rx="60" ry="50" fill="#3a3a1a" opacity="0.7"/>
  <ellipse cx="650" cy="180" rx="50" ry="40" fill="#1a5a3a" opacity="0.5"/>
  <text x="400" y="320" font-family="monospace" font-size="14" fill="#888" text-anchor="middle">SAMPLE CAPTURE</text>
</svg>
`)}`

export const SAMPLE_CLASSES_FULL: ClassInfo[] = [
  { class_id: 'c1', class_name: 'scratch', color: '#f43f5e' },
  { class_id: 'c2', class_name: 'dent', color: '#f59e0b' },
  { class_id: 'c3', class_name: 'stain', color: '#10b981' },
  { class_id: 'c4', class_name: 'crack', color: '#3b82f6' },
]

export const SAMPLE_BBOXES: BBox[] = [
  { classId: 'c1', x: 0.20, y: 0.18, w: 0.18, h: 0.20 },
  { classId: 'c2', x: 0.66, y: 0.62, w: 0.13, h: 0.16 },
  { classId: 'c4', x: 0.78, y: 0.22, w: 0.10, h: 0.13 },
]

/** ImagesView 의 grid 용 ImageItem[]. 4 sequence × 일부 sync 상태. */
export const SAMPLE_IMAGE_ITEMS: ImageItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `img-${i}`,
  src: SAMPLE_IMAGE_DATA_URL,
  fullSrc: SAMPLE_IMAGE_DATA_URL,
  label: `2026-05-${(20 - Math.floor(i / 4)).toString().padStart(2, '0')}_capture_${(i % 4) + 1}.png`,
  capturedAt: new Date(2026, 4, 20 - Math.floor(i / 4), 12, 30 + i).toISOString(),
  syncState: i % 4 === 0 ? 'synced'
    : i % 4 === 1 ? 'local_only'
    : i % 4 === 2 ? 'uploading'
    : 'upload_failed',
  isLocal: true,
  width: 800,
  height: 600,
  bboxes: i % 3 === 0 ? [
    { classId: 'c1', x: 0.15, y: 0.20, w: 0.18, h: 0.22 },
    { classId: 'c2', x: 0.62, y: 0.58, w: 0.16, h: 0.18 },
  ] : i % 3 === 1 ? [
    { classId: 'c3', x: 0.40, y: 0.35, w: 0.22, h: 0.24 },
  ] : [],
}))
