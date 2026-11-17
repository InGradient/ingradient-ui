/**
 * 4px grid check (DESIGN.md "Borders stay inside the grid" and "What the grid applies to").
 *
 * Runs after each story's play function in automated runs (`navigator.webdriver`) for page stories
 * that opt in — by default Platform 0.0.1 and Edge 0.0.6. A story turns it off with
 * `parameters: { grid4px: 'off' }` and a reason next to it.
 *
 * Measured: form controls and bordered boxes. Skipped, because their height is not theirs to choose:
 * - fluid sizes: stretched to a parent or the window, sized by aspect ratio, or holding an image,
 *   canvas or video whose height follows the available width;
 * - animated or transformed elements (a rotating spinner's box changes size every frame);
 * - anything inside svg/img/video/canvas, hidden, or 0–2px tall.
 */

export type GridMode = 'error' | 'off'

export interface GridIssue {
  owner: string
  tag: string
  height: number
  border: number
  cause: 'border' | 'control' | 'content'
  text: string
}

const CHECKED_TITLES = ['Pages/Platform/0.0.1/', 'Pages/Edge/0.0.6/']

const FLUID_TAGS = new Set(['IMG', 'VIDEO', 'CANVAS', 'SVG', 'svg'])
const CONTROL_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'])

function ownerOf(el: Element): string {
  const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$'))
  let fiber = key ? (el as unknown as Record<string, { type?: unknown; return?: unknown }>)[key] : null
  while (fiber) {
    const t = fiber.type as { displayName?: string; name?: string } | string | undefined
    const name = typeof t === 'function' ? (t as { displayName?: string; name?: string }).displayName || (t as { name?: string }).name : null
    if (name && !/^(styled|Styled|forwardRef|Memo|_c)/.test(name) && name.length > 2 && /^[A-Z]/.test(name)) return name
    fiber = fiber.return as typeof fiber
  }
  return '?'
}

function isOnGrid(h: number) {
  return Math.abs(h - Math.round(h / 4) * 4) < 0.05
}

function isStretchedByParent(el: HTMLElement, cs: CSSStyleDeclaration, rect: DOMRect) {
  if (/%|vh|dvh|svh/.test(el.style.height) || /%|vh/.test(cs.maxHeight)) return true
  const parent = el.parentElement
  if (!parent) return false
  const ps = getComputedStyle(parent)
  const flex = ps.display.includes('flex')
  const grid = ps.display.includes('grid')
  const column = ps.flexDirection.startsWith('column')
  if (flex && column && parseFloat(cs.flexGrow) > 0) return true
  const selfAlign = cs.alignSelf === 'auto' ? ps.alignItems : cs.alignSelf
  if (((flex && !column) || grid) && (selfAlign === 'stretch' || selfAlign === 'normal')
    && parent.clientHeight > 0 && Math.abs(rect.height - parent.clientHeight) < 1.5) return true
  const parentHeight = parent.getBoundingClientRect().height
  if (cs.height !== 'auto' && parentHeight > innerHeight * 0.4 && Math.abs(rect.height - parentHeight) < 1.5) return true
  return false
}

/** Height follows the available width: the box sits in, or holds, media or an aspect-ratio box. */
function holdsFluidContent(el: Element) {
  for (let up = el.parentElement; up; up = up.parentElement) {
    if (getComputedStyle(up).aspectRatio !== 'auto') return true
  }
  if (el.querySelector('img, video, canvas')) return true
  for (const child of el.querySelectorAll('*')) {
    if (getComputedStyle(child).aspectRatio !== 'auto') return true
  }
  return false
}

function isMoving(cs: CSSStyleDeclaration) {
  return cs.animationName !== 'none' || cs.transform !== 'none'
}

/** The story's canvas plus portals (dialogs, popovers) attached to body outside it. */
function candidatesIn(canvas: Element): HTMLElement[] {
  const roots = [canvas, ...[...document.body.children].filter((c) => !c.contains(canvas) && c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE')]
  return roots.flatMap((root) => [...root.querySelectorAll<HTMLElement>('*')])
}

export function findOffGridBoxes(canvas: Element = document.getElementById('storybook-root') ?? document.body): GridIssue[] {
  const issues: GridIssue[] = []
  for (const el of candidatesIn(canvas)) {
    if (FLUID_TAGS.has(el.tagName) || el.closest('svg, img, video, canvas')) continue
    const rect = el.getBoundingClientRect()
    if (!rect.width || rect.height <= 2 || rect.bottom < 0 || rect.top > innerHeight) continue
    if (isOnGrid(rect.height)) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.aspectRatio !== 'auto' || isMoving(cs)) continue
    if (rect.height >= innerHeight * 0.6) continue
    const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    const control = CONTROL_TAGS.has(el.tagName)
    if (!control && border === 0) continue
    if (isStretchedByParent(el, cs, rect) || holdsFluidContent(el)) continue
    const height = Math.round(rect.height * 100) / 100
    const cause = isOnGrid(height - border) ? 'border' : control ? 'control' : 'content'
    const text = (el.getAttribute('aria-label') || el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)
    issues.push({ owner: ownerOf(el), tag: el.tagName.toLowerCase(), height, border, cause, text })
  }
  return issues
}

export function gridModeFor(title: string, parameters: Record<string, unknown>): GridMode {
  const explicit = parameters.grid4px as GridMode | undefined
  if (explicit) return explicit
  return CHECKED_TITLES.some((prefix) => title.startsWith(prefix)) ? 'error' : 'off'
}

function nextFrames() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}

/** Preview `afterEach`: fails the story test when a checked page story renders off the 4px grid. */
export async function gridCheckAfterEach({ title, parameters, canvasElement }: { title: string; parameters: Record<string, unknown>; canvasElement: HTMLElement }) {
  if (typeof window === 'undefined' || !window.navigator.webdriver) return
  if (gridModeFor(title, parameters) === 'off') return
  await document.fonts.ready
  await nextFrames()
  const issues = findOffGridBoxes(canvasElement)
  if (issues.length === 0) return
  const lines = issues.slice(0, 20).map((i) => `  ${i.owner} <${i.tag}> h=${i.height} border=${i.border} cause=${i.cause} "${i.text}"`)
  const more = issues.length > 20 ? `\n  …and ${issues.length - 20} more` : ''
  throw new Error(`${issues.length} box(es) off the 4px grid (DESIGN.md "Borders stay inside the grid"):\n${lines.join('\n')}${more}`)
}
