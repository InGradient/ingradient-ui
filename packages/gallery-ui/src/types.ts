export interface Bbox {
  x: number
  y: number
  w: number
  h: number
  classId?: string
}

export interface Point {
  x: number
  y: number
  classId?: string
}

export interface ClassItem {
  id: string
  name: string
  color: string
  locked?: boolean
  display_name?: Record<string, string>
  description?: string
  image_count?: number
  reference_image_url?: string | null
}

export interface ImageItem {
  id: string
  dataset_id?: string
  created_at?: string
  uploader?: string
  width?: number
  height?: number
  size_bytes?: number
  thumb_url: string
  preview_url?: string
  original_url?: string
  thumb_bbox_url?: string | null
  bboxes?: Bbox[]
  points?: Point[]
  status?: string
  name?: string
  source?: string
  camera_ip?: string | null
  captured_at?: string | null
  split?: 'eval' | 'test' | null
  classification_class_ids?: string[]
  classification_class_id?: string | null
}

export interface UploadFileState {
  file: File
  progress?: number
  done?: boolean
  error?: string
}

export interface CursorPage<T> {
  items: T[]
  next_cursor: string | null
  total_count?: number
}
