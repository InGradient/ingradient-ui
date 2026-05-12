/**
 * 브라우저에서 파일 다운로드 트리거 + clipboard 복사 헬퍼.
 * Builders 의 Export 기능 (ThemeBuilder/PageComposer/LayoutComposer) 공통.
 */

export function downloadFile(filename: string, content: string, mimeType = 'application/octet-stream') {
  if (typeof document === 'undefined') return
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
