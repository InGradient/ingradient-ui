import { toPng } from 'html-to-image'
import { chartColors } from '../tokens/core'

const DEFAULT_BG = chartColors.canvasExportBg
const MAX_PIXEL_RATIO = 3

function slugifyFileName(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'chart'
  )
}

export interface DownloadCaptureOptions {
  /** PNG 배경색. 기본 `chartColors.canvasExportBg` (#181818). */
  backgroundColor?: string
  /** 파일명에 사용할 title. slug 화 후 `.png` 가 붙음. */
  title: string
  /** 캡쳐 시 제외할 노드 판별. true 반환 시 포함. 기본은 `data-download-hide` 속성 없으면 포함. */
  filter?: (node: HTMLElement) => boolean
}

/**
 * DOM node 를 PNG 로 캡쳐 후 자동 다운로드.
 * - device pixel ratio 를 max 3 까지 사용 (선명도)
 * - `data-download-hide` 속성이 있는 자식 노드는 기본 필터로 제외
 * - container 가 null 이면 no-op
 */
export async function downloadCaptureAsPng(
  container: HTMLElement | null,
  options: DownloadCaptureOptions,
): Promise<void> {
  if (!container) return
  const { title, backgroundColor = DEFAULT_BG, filter } = options
  const width = Math.max(1, Math.round(container.scrollWidth || container.clientWidth))
  const height = Math.max(1, Math.round(container.scrollHeight || container.clientHeight))
  const pixelRatio = Math.min(MAX_PIXEL_RATIO, Math.max(1, window.devicePixelRatio || 1))

  const pngUrl = await toPng(container, {
    cacheBust: true,
    backgroundColor,
    pixelRatio,
    canvasWidth: Math.max(1, Math.round(width * pixelRatio)),
    canvasHeight: Math.max(1, Math.round(height * pixelRatio)),
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true
      if (node.hasAttribute('data-download-hide')) return false
      return filter ? filter(node) : true
    },
  })

  const link = document.createElement('a')
  link.href = pngUrl
  link.download = `${slugifyFileName(title)}.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
}
