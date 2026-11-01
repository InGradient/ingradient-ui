/**
 * Slow, visible playback for workflow stories.
 *
 * Workflow `play` functions run every click and keystroke back to back, so a person watching
 * Storybook cannot see what happened. Import `userEvent` from this module instead of
 * `storybook/test`: before each action it outlines the target, shows a caption naming the
 * action, and waits `PACE_MS`. Wrap a play in `paced()` to show its `step` titles too.
 *
 * Automated runs stay at full speed. Playwright and the Vitest browser runner set
 * `navigator.webdriver`, so `test-storybook`, probes, and visual tests skip every pause.
 * Add `&pace=<ms>` to an iframe URL to force a pace (for example `pace=0` or `pace=1200`).
 */
import { userEvent as baseUserEvent } from 'storybook/test'

const PACE_MS = 1000
const CAPTION_ID = 'ig-play-caption'

const ACTION_LABELS: Record<string, string> = {
  click: 'Click',
  dblClick: 'Double-click',
  tripleClick: 'Triple-click',
  hover: 'Hover',
  unhover: 'Leave',
  type: 'Type',
  clear: 'Clear',
  keyboard: 'Press',
  tab: 'Tab',
  selectOptions: 'Select',
  deselectOptions: 'Deselect',
  upload: 'Upload',
  paste: 'Paste',
  pointer: 'Pointer',
}

let currentStep = ''

/** Pause between actions in ms; 0 in automated runs. */
export function playbackPaceMs(): number {
  if (typeof window === 'undefined') return 0
  const override = new URLSearchParams(window.location.search).get('pace')
  if (override !== null) {
    const value = Number(override)
    return Number.isFinite(value) && value >= 0 ? value : 0
  }
  return window.navigator.webdriver ? 0 : PACE_MS
}

const wait = (ms: number) => new Promise<void>((resolve) => { window.setTimeout(resolve, ms) })

function accessibleName(el: Element): string {
  const aria = el.getAttribute('aria-label')
  if (aria) return aria
  const labels = (el as HTMLInputElement).labels
  const labelText = labels && labels.length > 0 ? labels[0].textContent : null
  if (labelText?.trim()) return labelText.trim()
  const text = el.textContent?.replace(/\s+/g, ' ').trim()
  if (text) return text.length > 40 ? `${text.slice(0, 40)}…` : text
  return el.getAttribute('placeholder') ?? el.getAttribute('role') ?? el.tagName.toLowerCase()
}

function describe(action: string, args: unknown[]): string {
  const label = ACTION_LABELS[action] ?? action
  const target = args[0] instanceof Element ? accessibleName(args[0]) : null
  if (action === 'type') return `${label} "${String(args[1] ?? '')}"${target ? ` · ${target}` : ''}`
  if (action === 'keyboard') return `${label} ${String(args[0] ?? '')}`
  if (action === 'selectOptions' || action === 'deselectOptions') return `${label} ${String(args[1] ?? '')}${target ? ` · ${target}` : ''}`
  return target ? `${label} · ${target}` : label
}

function showCaption(action: string): void {
  let el = document.getElementById(CAPTION_ID)
  if (!el) {
    el = document.createElement('div')
    el.id = CAPTION_ID
    el.setAttribute('aria-hidden', 'true')
    el.setAttribute('data-ig-play-caption', '')
    Object.assign(el.style, {
      position: 'fixed',
      left: 'var(--ig-spacing-16)',
      bottom: 'var(--ig-spacing-16)',
      zIndex: 'var(--ig-z-tooltip)',
      maxWidth: 'var(--ig-popup-md)',
      padding: 'var(--ig-spacing-8) var(--ig-spacing-12)',
      borderRadius: 'var(--ig-radius-md)',
      border: 'var(--ig-border-1px) solid var(--ig-color-warning)',
      background: 'var(--ig-color-surface-raised)',
      color: 'var(--ig-color-text-primary)',
      font: 'var(--ig-font-weight-medium) var(--ig-text-body-sm)/var(--ig-text-body-sm-leading) var(--ig-font-sans)',
      pointerEvents: 'none',
      whiteSpace: 'pre-line',
    })
    document.body.appendChild(el)
  }
  el.textContent = currentStep ? `${currentStep}\n${action}` : action
}

function removeCaption(): void {
  document.getElementById(CAPTION_ID)?.remove()
}

function highlight(el: Element): () => void {
  if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) return () => undefined
  const style = (el as HTMLElement).style
  const previous = { outline: style.outline, outlineOffset: style.outlineOffset }
  el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  style.outline = 'var(--ig-border-2px) solid var(--ig-color-warning)'
  style.outlineOffset = 'var(--ig-spacing-2)'
  return () => {
    style.outline = previous.outline
    style.outlineOffset = previous.outlineOffset
  }
}

type BaseUserEvent = typeof baseUserEvent

/** Drop-in replacement for `userEvent` from `storybook/test` that paces each action. */
export const userEvent: BaseUserEvent = new Proxy(baseUserEvent, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    if (typeof prop !== 'string' || typeof value !== 'function' || !(prop in ACTION_LABELS)) return value
    return async (...args: unknown[]) => {
      const pace = playbackPaceMs()
      if (pace === 0) return (value as (...a: unknown[]) => unknown).apply(target, args)
      showCaption(describe(prop, args))
      const restore = args[0] instanceof Element ? highlight(args[0]) : () => undefined
      await wait(pace)
      restore()
      return (value as (...a: unknown[]) => unknown).apply(target, args)
    }
  },
})

type StepFn = (name: string, run: () => Promise<void> | void) => Promise<void> | void
type PlayContext = { step: StepFn }

/**
 * Wraps a play function so each `step` title is shown above the action caption, and the
 * caption is cleared after the last action. Pass-through in automated runs.
 */
export function paced<C extends PlayContext>(play?: (context: C) => Promise<void> | void) {
  if (!play) return undefined
  return async (context: C) => {
    if (playbackPaceMs() === 0) return play(context)
    const step: StepFn = async (name, run) => {
      currentStep = name
      try {
        await context.step(name, run)
      } finally {
        currentStep = ''
      }
    }
    try {
      await play({ ...context, step })
      await wait(playbackPaceMs())
    } finally {
      currentStep = ''
      removeCaption()
    }
  }
}
